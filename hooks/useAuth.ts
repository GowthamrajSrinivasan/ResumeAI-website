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
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
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
      await signOut(auth);
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