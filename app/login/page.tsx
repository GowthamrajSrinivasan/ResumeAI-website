"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState, Suspense } from "react";
import { Briefcase, Mail, Lock, User, ArrowRight, Chrome, Sparkles, Zap, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function LoginContent() {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopupHelp, setShowPopupHelp] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  useEffect(() => {
    console.log('Login page - Auth state:', { user: user?.email || 'null', loading, loginSuccessful });

    // Only redirect if user is authenticated AND login was explicitly successful
    if (user && !loading && loginSuccessful) {
      const returnTo = searchParams.get('returnTo') || '/jobs';
      console.log('✅ User authenticated and login completed, redirecting to:', returnTo);
      // Add a small delay to ensure all auth processes are complete
      setTimeout(() => {
        router.push(returnTo);
      }, 2000);
    } else if (user && !loading && !loginSuccessful) {
      // User is already logged in but hasn't performed a new login action
      // Don't redirect automatically - let them decide what to do
      console.log('ℹ️ User already authenticated but no new login performed - staying on login page');
    }
  }, [user, loading, loginSuccessful, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        console.log('🔐 Email/password sign in successful');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await signUp(formData.email, formData.password);
        console.log('📝 Email/password sign up successful');
      }
      
      // Mark login as successful after authentication completes
      setLoginSuccessful(true);
      
    } catch (error: any) {
      setError(error.message || 'An error occurred');
      setLoginSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setError('');
    setLoginSuccessful(false); // Reset login success flag when switching modes
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
      console.log('🔐 Google sign in successful');
      
      // Mark login as successful after Google authentication completes
      setLoginSuccessful(true);
      
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setLoginSuccessful(false);
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl animate-pulse" />
            <Briefcase className="relative h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          </div>
          <p className="text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loading...</p>
        </div>
      </div>
    );
  }

  // Show success screen when login is complete and about to redirect
  if (user && !loading && loginSuccessful) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="relative">
          {/* Gradient Background Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-3xl animate-pulse" />
          </div>

          <Card className="relative glass backdrop-blur-xl border-white/20 shadow-2xl max-w-md mx-auto animate-scale-in">
            <CardContent className="p-8 sm:p-12 text-center">
              {/* Success Icon with Gradient Background */}
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 blur-xl animate-pulse" />
                <div className="relative mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Login Successful!
              </h1>

              <p className="text-surface-600 text-base md:text-lg mb-8">
                Welcome back! Redirecting you to your dashboard...
              </p>

              {/* Loading Animation */}
              <div className="flex items-center justify-center space-x-3">
                <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                <p className="text-blue-600 font-medium">Setting up your workspace...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Gradient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl" />
                <div className="relative w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fit2Hire
              </h1>
            </div>
            <p className="text-lg md:text-xl text-surface-600 font-medium">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
            <p className="text-sm text-surface-500 mt-2">
              {isLogin ? 'Sign in to access your dashboard' : 'Join us and start your journey'}
            </p>
          </div>

        {/* Authentication Form */}
        <Card className="glass backdrop-blur-xl border-white/20 shadow-2xl animate-scale-in">
          <CardContent className="p-6 sm:p-8">
            {/* Toggle Buttons */}
            <div className="flex rounded-xl bg-surface-100 p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isLogin
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  !isLogin
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Sign Up
              </button>
            </div>

          {/* Google Sign In */}
          <Button
            onClick={() => {
              setIsLoading(true);
              signInWithGoogle()
                .then(() => {
                  setLoginSuccessful(true);
                })
                .catch((error) => {
                  setError(error.message || 'Google sign in failed');
                  setLoginSuccessful(false);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="w-full mb-6"
            leftIcon={<Chrome className="h-5 w-5" />}
          >
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-surface-500 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg animate-slide-down">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-down">
                <label htmlFor="name" className="block text-sm font-semibold text-surface-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  leftIcon={<User className="h-4 w-4" />}
                  inputSize="lg"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-surface-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4" />}
                inputSize="lg"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-surface-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                inputSize="lg"
                required
              />
            </div>

            {!isLogin && (
              <div className="animate-slide-down">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-surface-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  inputSize="lg"
                  required={!isLogin}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              variant="gradient"
              size="lg"
              className="w-full mt-6"
              rightIcon={!isLoading && <ArrowRight className="h-5 w-5" />}
            >
              {isLoading
                ? (isLogin ? 'Signing In...' : 'Creating Account...')
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center space-y-3">
            {isLogin && (
              <a href="#" className="block text-sm font-medium text-blue-600 hover:text-purple-600 transition-colors">
                Forgot your password?
              </a>
            )}
            <p className="text-sm text-surface-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-surface-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs text-surface-600 font-medium">Secure</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs text-surface-600 font-medium">Fast</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-pink-600" />
                </div>
                <p className="text-xs text-surface-600 font-medium">Smart</p>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-surface-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="font-medium text-blue-600 hover:text-purple-600 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="font-medium text-blue-600 hover:text-purple-600 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl" />
            <div className="relative animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
