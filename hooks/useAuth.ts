import { useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { extensionComm } from '@/lib/extensionCommunication';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (useRedirect?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

// Function to save user data to Firestore
const saveUserToFirestore = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    // User details structure
    const userDetails = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    
    // Main user data structure
    const userData = {
      // Core fields
      userEmail: user.email,
      userDetails: userDetails,
      
      // Additional fields for comprehensive user management
      uid: user.uid,
      lastLoginAt: serverTimestamp(),
      providerData: user.providerData.map(provider => ({
        providerId: provider.providerId,
        uid: provider.uid,
        email: provider.email,
        displayName: provider.displayName,
        photoURL: provider.photoURL
      }))
    };

    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      console.log('User data updated in Firestore:', userData);
      console.log('Firestore storage details:');
      console.log('  - userEmail:', user.email);
      console.log('  - userDetails:', userDetails);
    } else {
      // Create new user
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('New user created in Firestore:', userData);
      console.log('Firestore storage details:');
      console.log('  - userEmail:', user.email);
      console.log('  - userDetails:', userDetails);
    }
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize extension communication
  useEffect(() => {
    extensionComm.initialize();
    
    // Set up custom extension event handlers
    extensionComm.onExtensionAuthenticated = (uid: string) => {
      console.log('Extension is authenticated with uid:', uid);
    };
    
    extensionComm.onExtensionUnauthenticated = () => {
      console.log('Extension is not authenticated');
    };
    
    extensionComm.onUidStored = () => {
      console.log('UID successfully stored in extension');
    };
    
    extensionComm.onUidCleared = () => {
      console.log('UID successfully cleared from extension');
    };
    
    return () => {
      extensionComm.destroy();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Update Chrome storage and Firestore on successful login
      if (user) {
        try {
          const userDetails = {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          };
          
          // Save user to Firestore
          try {
            await saveUserToFirestore(user);
            console.log('✅ User data saved to Firestore successfully');
            
            // 🔐 Send the specific REQUILL_EXTENSION message for chrome extension
            if (typeof window !== 'undefined') {
              window.postMessage({
                source: "REQUILL_EXTENSION",
                type: "LOGIN_SUCCESS",
                uid: user.uid
              }, "*");
              console.log('✅ REQUILL_EXTENSION LOGIN_SUCCESS message sent');
            }
            
            // Prepare user data for extension
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            };
            
            // Send comprehensive extension messages
            extensionComm.setUid(user.uid, userData);
            extensionComm.sendRequillLogin(user.uid);
            
            console.log('✅ Extension communication messages sent');
          } catch (firestoreError) {
            console.error('❌ Failed to save user data to Firestore:', firestoreError);
          }
          
          // Store only uid in Chrome storage sync if available
          try {
            if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
              console.log('Chrome extension environment detected, storing uid in sync storage...');
              const chromeStorageData = {
                uid: user.uid
              };
              
              await chrome.storage.sync.set(chromeStorageData);
              console.log('✅ User uid stored in Chrome sync storage:', chromeStorageData);
              console.log('Chrome sync storage details:');
              console.log('  - uid:', user.uid);
            } else {
              console.log('ℹ️ Chrome extension API not available - uid not stored in Chrome sync storage');
            }
          } catch (chromeError) {
            console.warn('⚠️ Chrome sync storage failed:', chromeError);
          }
        } catch (error) {
          console.error('Error storing user data:', error);
        }
      } else {
        // Clear uid from Chrome sync storage on logout
        if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
          try {
            await chrome.storage.sync.remove(['uid']);
            console.log('✅ User uid cleared from Chrome sync storage');
          } catch (error) {
            console.error('❌ Error clearing uid from Chrome sync storage:', error);
          }
        } else {
          console.log('ℹ️ Chrome extension API not available - no Chrome sync storage cleanup needed');
        }
      }
    });

    // Handle redirect result for Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User signed in successfully via redirect
          console.log('Google sign-in redirect successful');
        }
      })
      .catch((error) => {
        console.error('Google redirect sign-in error:', error);
      });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing in:', error);
      // Provide user-friendly error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled.');
      } else {
        throw new Error(error.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing up:', error);
      // Provide user-friendly error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else {
        throw new Error(error.message || 'Failed to create account. Please try again.');
      }
    }
  };

  const signInWithGoogle = async (useRedirect = false) => {
    try {
      const provider = new GoogleAuthProvider();
      
      if (useRedirect) {
        // Use redirect method directly
        const { signInWithRedirect } = await import('firebase/auth');
        await signInWithRedirect(auth, provider);
        return;
      }
      
      // Try popup first, fallback to redirect if popup is blocked
      try {
        await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          // Auto-fallback to redirect method
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupError;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      // Provide user-friendly error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('POPUP_BLOCKED'); // Special error code for handling
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with the same email address but different sign-in credentials.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
      } else {
        throw new Error(error.message || 'Failed to sign in with Google. Please try again.');
      }
    }
  };


  const logout = async () => {
    try {
      // Clear from extension first
      extensionComm.clearUid();
      
      // Then sign out from Firebase
      await signOut(auth);
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };
}