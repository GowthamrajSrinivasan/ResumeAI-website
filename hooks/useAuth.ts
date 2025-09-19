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
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';


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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Save user data to Firestore on successful login
      if (user) {
        try {
          // 📊 Save to Firestore (non-blocking)
          saveUserToFirestore(user)
            .then(() => {
              console.log('✅ User data saved to Firestore successfully');
            })
            .catch((firestoreError) => {
              console.error('❌ Failed to save user data to Firestore:', firestoreError);
            });
        } catch (error) {
          console.error('Error saving user data:', error);
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
      // Sign out from Firebase
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