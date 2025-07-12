"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from "react";
import { Sparkles, LogOut, User, CreditCard, Crown } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-white" />
            <h1 className="text-xl font-extrabold">LinkedIn AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/pricing')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300"
            >
              <Crown className="h-4 w-4" />
              <span className="font-medium">Upgrade</span>
            </button>
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-white/80" />
              <span className="text-white/90">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-white/80 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 pt-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Welcome to your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started with LinkedIn AI Assistant to supercharge your professional presence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden group">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }}
            />
            <div className="relative z-10">
              <div className="text-blue-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Content Creation</h3>
              <p className="text-gray-300 text-sm mb-6">Generate engaging posts and articles tailored to your professional brand.</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center space-x-1">
                <span>Get Started</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden group">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }}
            />
            <div className="relative z-10">
              <div className="text-blue-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Messaging</h3>
              <p className="text-gray-300 text-sm mb-6">Craft personalized connection requests and follow-up messages.</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center space-x-1">
                <span>Get Started</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden group">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }}
            />
            <div className="relative z-10">
              <div className="text-blue-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Profile Optimization</h3>
              <p className="text-gray-300 text-sm mb-6">Get AI-driven suggestions to improve your LinkedIn profile.</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center space-x-1">
                <span>Get Started</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 md:p-12 mb-12 overflow-hidden group">
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
            }}
          />
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <Crown className="h-16 w-16 text-yellow-400" />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Unlock Your{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Full Potential
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Upgrade to Premium and get unlimited AI-powered content creation, advanced analytics, and priority support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/pricing')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                View Pricing Plans
              </button>
              <button className="px-8 py-4 border border-gray-600 text-white rounded-xl hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-12 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: "radial-gradient(circle at 30% 50%, #4361ee15 0%, transparent 70%)"
            }}
          />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:scale-105 transition-all duration-300">
                Generate Post
              </button>
              <button className="px-6 py-3 bg-gray-800/50 text-gray-200 border border-gray-600 rounded-xl font-medium hover:bg-gray-700/50 transition-all duration-300">
                Write Message
              </button>
              <button className="px-6 py-3 bg-gray-800/50 text-gray-200 border border-gray-600 rounded-xl font-medium hover:bg-gray-700/50 transition-all duration-300">
                Analyze Profile
              </button>
            </div>
          </div>
        </div>

        {/* Install Extension CTA */}
        <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: "radial-gradient(circle at 70% 30%, #4cc9f015 0%, transparent 70%)"
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Install Browser Extension</h3>
              <p className="text-gray-300">Get the full LinkedIn AI Assistant experience with our browser extension.</p>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300">
              Install Extension
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}