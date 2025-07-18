"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { extensionComm } from '@/lib/extensionCommunication';
import React, { useEffect, useState } from "react";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight, Rocket, Zap, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    console.log('Login page - Auth state:', { user: user?.email || 'null', loading });
    
    if (user && !loading) {
      console.log('✅ User authenticated, attempting to navigate to stored LinkedIn URL');
      
      // Set up callback to handle stored LinkedIn URL retrieval
      extensionComm.onStoredLinkedInUrlRetrieved = (url: string) => {
        console.log('✅ Navigating to stored LinkedIn URL:', url);
        window.location.href = url;
      };
      
      extensionComm.onNoLinkedInUrlStored = () => {
        console.log('ℹ️ No stored LinkedIn URL, falling back to linkedin.com');
        window.location.href = 'https://www.linkedin.com';
      };
      
      // Request stored LinkedIn URL from extension
      extensionComm.getStoredLinkedInUrl();
      
      // Fallback timeout in case extension doesn't respond
      setTimeout(() => {
        console.log('⚠️ Extension response timeout, falling back to linkedin.com');
        window.location.href = 'https://www.linkedin.com';
      }, 2000);
    }
  }, [user, loading, router]);

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
      // Store current LinkedIn URL before starting sign-in
      extensionComm.storeLinkedInUrl();
      
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await signUp(formData.email, formData.password);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Store current LinkedIn URL before starting sign-in
      extensionComm.storeLinkedInUrl();
      
      // This will redirect to Google - the page will navigate away
      // No need to handle success here as the page redirects
      await signInWithGoogle();
    } catch (error: any) {
      // Only handle errors that occur before redirect (rare)
      setError(error.message || 'Failed to initiate Google sign-in');
      setIsLoading(false);
    }
    // Note: setIsLoading(false) not needed in finally because page redirects
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-xl font-extrabold">Requill</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="flex w-full max-w-7xl gap-12 items-center">
          {/* Left Side - Feature Highlights */}
          <div className="hidden lg:flex flex-col flex-1 space-y-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                Automate the Busywork.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Focus on What Matters.
                </span>
              </h2>
            </div>

            {/* Feature 1 */}
            <div className="relative rounded-2xl border border-blue-900/50 bg-[#181c28]/60 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500/50 group cursor-pointer">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                  <Rocket className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Effortless LinkedIn Engagement
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Busy executive, marketing lead, or job seeker? Our extension helps you stay consistently active on LinkedIn by summarizing posts and crafting personalized replies—so you can maintain your presence without spending hours online.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-2xl border border-purple-900/50 bg-[#181c28]/60 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500/50 group cursor-pointer">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex-shrink-0">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                     Others Are Leveling Up—Why Not You?
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Many professionals are automating their content interactions. With our free tool, you can do it faster, better, and more authentically, freeing you to focus on the creative, complex, and high-impact work that matters most.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-2xl border border-pink-900/50 bg-[#181c28]/60 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-pink-500/50 group cursor-pointer">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 via-blue-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                     Boost Your LinkedIn Presence, Effortlessly
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Whether you're job hunting or building your personal brand, the extension helps you increase visibility, engagement, and consistency—with minimal effort and maximum impact.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full max-w-md lg:max-w-lg">
          {/* Login/Signup Card */}
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl overflow-hidden transition hover:-translate-y-1 hover:scale-[1.01]">
            {/* Subtle radial glow for depth */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
              }}
            />
            
            <div className="relative z-10 p-8">
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Requill
                  </span>
                </h2>
                <p className="text-gray-400 text-sm">
                  {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
                </p>
              </div>

              {/* Single Login Tab - Only show if Login tab is active */}
              {isLogin && (
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-800/50 rounded-xl p-1 border border-gray-700">
                    <div className="py-3 px-6 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg cursor-default">
                      Log In
                    </div>
                  </div>
                </div>
              )}

              {/* Google Sign-in Button */}
              <button
                onClick={() => handleGoogleSignIn()}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-600 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="mb-6 flex items-center">
                <div className="flex-1 border-t border-gray-600"></div>
                <div className="mx-4 text-sm text-gray-400 font-medium">or</div>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                  {showPopupHelp && (
                    <div className="mt-4 space-y-3">
                      <div className="text-xs text-gray-400">
                        <p className="mb-2 font-medium text-gray-300">Choose an option:</p>
                      </div>
                      
                      {/* Option 1: Enable Popups */}
                      <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                        <p className="text-xs font-medium text-gray-300 mb-2">Option 1: Enable Popups</p>
                        <ul className="list-disc ml-4 space-y-1 text-xs text-gray-400">
                          <li>Click the popup blocker icon in your address bar</li>
                          <li>Select "Always allow popups from this site"</li>
                          <li>Refresh the page and try again</li>
                        </ul>
                      </div>
                      
                      {/* Option 2: Use Redirect */}
                      <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
                        <p className="text-xs font-medium text-blue-300 mb-2">Option 2: Use Redirect Method</p>
                        <p className="text-xs text-gray-400 mb-3">This will take you to Google's sign-in page directly</p>
                        <button
                          onClick={() => handleGoogleSignIn()}
                          disabled={isLoading}
                          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Redirecting...' : 'Sign in via Redirect'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field for signup */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-11 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field for signup */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Additional Links */}
              <div className="mt-8 text-center space-y-3">
                {isLogin && (
                  <div>
                    <button 
                      type="button"
                      onClick={() => alert('Forgot password functionality would be implemented here')}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                
                <div className="text-sm text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
                </div>
              </div>
            </div>

            {/* Additional glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"></div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <button 
              type="button"
              onClick={() => router.push('/terms')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              type="button"
              onClick={() => router.push('/privacy')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-gray-500">
        Version: 1.1.2.0
      </div>
    </div>
  );
}