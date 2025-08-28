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
import { collection, addDoc } from 'firebase/firestore';
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';

// Type declaration for window extensions
declare global {
  interface Window {
    handleFirebaseLoginSuccess?: (user: User) => void;
    handleFirebaseLogout?: () => void;
  }
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
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
      userId: user.uid, // Duplicate of uid for compatibility
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
      const premiumEndDate = new Date();
      premiumEndDate.setDate(premiumEndDate.getDate() + 7); // 7 days from now
      
      await setDoc(userRef, {
        ...userData,
        isPremium: true, // Set as premium by default for all new users
        subscriptionType: 'trial', // Mark as trial subscription
        subscriptionStart: serverTimestamp(),
        subscriptionEnd: premiumEndDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('New user created in Firestore:', userData);
      console.log('Firestore storage details:');
      console.log('  - userEmail:', user.email);
      console.log('  - userDetails:', userDetails);
      
      // Send welcome email for new users (all signup methods)
      if (user.email) {
        try {
          const response = await fetch(FIREBASE_FUNCTIONS.sendWelcomeEmail, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: user.email,
              userName: user.displayName || 'there'
            }),
          });

          if (!response.ok) {
            console.error('Failed to send welcome email:', await response.text());
          } else {
            console.log('Welcome email sent successfully to new user');
          }
        } catch (emailError) {
          console.error('Error sending welcome email to new user:', emailError);
          // Don't throw error for email failure
        }
      }
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
    extensionComm.onExtensionAuthenticated = (uid: string, userData?: any) => {
      console.log('Extension is authenticated with uid:', uid);
      if (userData) {
        console.log('📊 Extension user data:', userData);
        console.log('💎 Premium status:', userData.isPremium ? 'Premium' : 'Free');
        console.log('📈 Usage count:', userData.usageCount || 0);
      }
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
    
    // Set up heartbeat and presence handlers
    extensionComm.onExtensionHeartbeat = (data: any) => {
      console.log('💓 Extension heartbeat received');
      if (data.extensionVersion) {
        console.log('🔧 Extension version:', data.extensionVersion);
      }
      if (data.userId) {
        console.log('👤 Active user in extension:', data.userId);
      }
    };
    
    extensionComm.onExtensionPresent = (data: any) => {
      console.log('✅ Extension is present and responding');
      console.log('📊 Extension info:', {
        version: data.extensionVersion,
        userId: data.userId || 'No user logged in',
        installed: data.isInstalled
      });
    };
    
    extensionComm.onExtensionNotPresent = () => {
      console.log('⚠️ Extension is not present or not responding');
    };
    
    extensionComm.onRequillLoginSuccess = (data: any) => {
      console.log('✅ Requill login successful in extension:', data);
    };
    
    extensionComm.onRequillLoginFailed = (data: any) => {
      console.log('❌ Requill login failed in extension:', data);
    };

    // Extension Uninstall Detection
    const initializeExtensionUninstallDetection = () => {
      // Listen for messages from the Chrome extension
      const messageHandler = (event: MessageEvent) => {
        console.log('📨 Received message:', event.data, 'from origin:', event.origin);
        
        // Handle extension uninstall notification
        if (event.data.type === 'EXTENSION_UNINSTALLED') {
          console.log('🔴 Extension uninstalled for user:', event.data.userId);
          console.log('🔍 Current auth user:', auth.currentUser?.uid);
          handleExtensionUninstall(event.data.userId, event.data.timestamp);
          return;
        }
        
        // Security: Only accept other messages from your own domain or extension
        const allowedOrigins = [
          window.location.origin,
          'chrome-extension://' // Allow any chrome extension (you could be more specific)
        ];

        // Check if origin is allowed or if it's a chrome extension
        const isAllowedOrigin = allowedOrigins.some(origin =>
          event.origin === origin || event.origin.startsWith('chrome-extension://')
        );

        if (!isAllowedOrigin) {
          console.log('Blocked message from unauthorized origin:', event.origin);
          return;
        }
      };

      // Function to handle extension uninstall
      const handleExtensionUninstall = (userId: string, timestamp: number) => {
        try {
          // 1. Log the event for analytics/debugging
          console.log(`Extension uninstalled at ${new Date(timestamp)} for user: ${userId}`);

          // 2. Log uninstall event to Firestore
          addDoc(collection(db, 'extension_uninstalls'), {
            userId: userId,
            timestamp: serverTimestamp(),
            originalTimestamp: timestamp,
            userAgent: navigator.userAgent,
            event: 'extension_uninstalled',
            source: 'extension_content_script'
          }).catch(error => {
            console.error('Failed to log extension uninstall to Firestore:', error);
          });

          // 3. Check if this user is currently logged in using Firebase Auth directly
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid === userId) {
            // 4. Log out the user
            signOut(auth).then(() => {
              console.log('🚪 Extension was uninstalled - user has been logged out');
              // Optionally redirect to login page
              // if (typeof window !== 'undefined') {
              //   window.location.href = '/login';
              // }
            }).catch(error => {
              console.error('Error during extension uninstall logout:', error);
            });
          } else if (currentUser) {
            console.log('🔍 Extension uninstalled for different user:', userId, 'Current user:', currentUser.uid);
          } else {
            console.log('🔍 Extension uninstalled but no user currently logged in');
          }

        } catch (error) {
          console.error('Error handling extension uninstall:', error);
        }
      };

      window.addEventListener('message', messageHandler);
      return () => window.removeEventListener('message', messageHandler);
    };

    const cleanupExtensionUninstallDetection = initializeExtensionUninstallDetection();
    
    return () => {
      extensionComm.destroy();
      cleanupExtensionUninstallDetection();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Check if user was logged out due to extension issues
      const extensionUninstallLogout = localStorage.getItem('extension_uninstall_logout');
      const extensionNotInstalledLogout = localStorage.getItem('extension_not_installed_logout');
      const logoutUserId = localStorage.getItem('extension_uninstall_userId') || localStorage.getItem('extension_logout_userId');
      const logoutTimestamp = localStorage.getItem('extension_uninstall_timestamp') || localStorage.getItem('extension_logout_timestamp');
      
      if ((extensionUninstallLogout === 'true' || extensionNotInstalledLogout === 'true') && user) {
        // Check if this is the same user who was logged out due to extension issues
        if (logoutUserId === user.uid) {
          // For both extension uninstall and not installed - keep blocking until user manually logs in
          // Don't clear the flags automatically - force manual intervention
          const reason = extensionUninstallLogout === 'true' ? 'extension uninstall' : 'extension not installed';
          console.log(`🚫 Extension ${reason} - preventing automatic login`);
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }
      }
      
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
          
          // Prepare user data for extension
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          };
          
          // 🚀 IMMEDIATE: Send extension messages first (no waiting)
          console.log('🚀 Sending immediate extension messages...');
          
          // 🔐 Send the specific REQUILL_EXTENSION message for chrome extension
          if (typeof window !== 'undefined') {
            window.postMessage({
              source: "REQUILL_EXTENSION",
              type: "LOGIN_SUCCESS",
              uid: user.uid
            }, "*");
            console.log('✅ REQUILL_EXTENSION LOGIN_SUCCESS message sent immediately');
          }
          
          // Send comprehensive extension messages with retry logic
          extensionComm.setUid(user.uid, userData);
          extensionComm.sendRequillLogin(user.uid);
          
          // Call the global Firebase login success handler if available
          if (typeof window !== 'undefined' && window.handleFirebaseLoginSuccess) {
            window.handleFirebaseLoginSuccess(user);
            console.log('✅ Called window.handleFirebaseLoginSuccess');
          }
          
          console.log('✅ Extension communication messages sent immediately');
          
          // 📊 BACKGROUND: Save to Firestore (non-blocking)
          saveUserToFirestore(user)
            .then(() => {
              console.log('✅ User data saved to Firestore successfully (background)');
            })
            .catch((firestoreError) => {
              console.error('❌ Failed to save user data to Firestore:', firestoreError);
            });
          
          // Chrome extension will handle storing uid in Chrome storage when it receives the messages
        } catch (error) {
          console.error('Error storing user data:', error);
        }
      } else {
        // Extension will handle clearing uid from Chrome storage
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
      // Clear all extension logout flags on manual login
      localStorage.removeItem('extension_uninstall_logout');
      localStorage.removeItem('extension_uninstall_userId');
      localStorage.removeItem('extension_uninstall_timestamp');
      localStorage.removeItem('extension_not_installed_logout');
      localStorage.removeItem('extension_logout_userId');
      localStorage.removeItem('extension_logout_timestamp');
      
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

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Welcome email will be sent automatically by saveUserToFirestore for new users
      console.log('User account created successfully');
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
      // Clear all extension logout flags on manual login
      localStorage.removeItem('extension_uninstall_logout');
      localStorage.removeItem('extension_uninstall_userId');
      localStorage.removeItem('extension_uninstall_timestamp');
      localStorage.removeItem('extension_not_installed_logout');
      localStorage.removeItem('extension_logout_userId');
      localStorage.removeItem('extension_logout_timestamp');
      
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
      
      // Call the global Firebase logout handler if available
      if (typeof window !== 'undefined' && window.handleFirebaseLogout) {
        window.handleFirebaseLogout();
        console.log('✅ Called window.handleFirebaseLogout');
      }
      
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