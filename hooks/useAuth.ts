import { useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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

// Global singleton to ensure getRedirectResult is only called once
class RedirectResultManager {
  private static instance: RedirectResultManager;
  private hasChecked = false;
  private promise: Promise<void> | null = null;

  static getInstance(): RedirectResultManager {
    if (!RedirectResultManager.instance) {
      RedirectResultManager.instance = new RedirectResultManager();
    }
    return RedirectResultManager.instance;
  }

  async checkRedirectResult(): Promise<void> {
    if (this.hasChecked) {
      console.log('🔍 Redirect result already checked, skipping...');
      return;
    }

    if (this.promise) {
      console.log('🔍 Redirect result check already in progress, waiting...');
      return this.promise;
    }

    this.hasChecked = true;
    this.promise = this.performCheck();
    return this.promise;
  }

  private async performCheck(): Promise<void> {
    try {
      console.log('🔍 Checking for Google redirect result...');
      const result = await getRedirectResult(auth);
      
      if (result) {
        console.log('✅ Google sign-in redirect successful!');
        console.log('✅ User:', result.user.email);
        console.log('✅ Provider:', result.providerId);
        // User state will be updated via onAuthStateChanged
      } else {
        console.log('ℹ️ No redirect result - user did not come from a redirect');
      }
    } catch (error: any) {
      console.error('❌ Google redirect sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Handle specific redirect errors
      if (error.code === 'auth/unauthorized-domain') {
        console.error('🚨 Domain not authorized for redirect. Check Firebase Auth settings.');
      } else if (error.code === 'auth/operation-not-allowed') {
        console.error('🚨 Google provider not enabled. Check Firebase Auth settings.');
      }
    }
  }
}

export function useAuth(redirectPath = '/dashboard'): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectResultChecked, setRedirectResultChecked] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `Logged in as ${user.email}` : 'Not logged in');
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle redirect result using singleton pattern - MUST complete before any navigation
  useEffect(() => {
    const handleRedirectFlow = async () => {
      try {
        console.log('🚀 Starting handleRedirectFlow...');
        const redirectManager = RedirectResultManager.getInstance();
        await redirectManager.checkRedirectResult();
        console.log('✅ Redirect result check completed successfully');
        setRedirectResultChecked(true);
      } catch (error) {
        console.error('❌ Error checking redirect result:', error);
        setRedirectResultChecked(true); // Set to true even on error to prevent infinite loading
      }
    };
    
    console.log('🔧 useEffect for redirect flow triggered');
    handleRedirectFlow();
  }, []);

  // Handle automatic redirection ONLY after redirect result has been processed
  useEffect(() => {
    if (user && !loading && redirectResultChecked) {
      // Only redirect if user is authenticated and we're not on the target page
      if (typeof window !== 'undefined' && window.location.pathname !== redirectPath) {
        console.log(`🔄 Redirecting authenticated user to ${redirectPath}`);
        router.push(redirectPath);
      }
    }
  }, [user, loading, redirectResultChecked, redirectPath, router]);

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

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Add some additional configuration for better redirect flow
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('🚀 Initiating Google sign-in redirect...');
      // Use redirect method - this will redirect the entire page to Google
      // The function won't return because the page redirects away
      // Results are handled by getRedirectResult when user returns
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('Error initiating Google sign-in redirect:', error);
      // Handle errors that occur before redirect (rare)
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
      } else {
        throw new Error(error.message || 'Failed to initiate Google sign-in. Please try again.');
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