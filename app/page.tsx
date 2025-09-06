"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from "react";
import { ArrowRight, Chrome } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 h-screen">
        <p className="text-xl text-foreground/80">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">Requill</h1>
          </div>
          <button
            onClick={() => window.open('https://chromewebstore.google.com/detail/requill-beta-powered-by-o/bhbnnmbpmjjgnncgbbbnpeabkhhjhhpb', '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Install Extension
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-blue-600">AI-Powered</span>{' '}
              LinkedIn Assistant
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Supercharge your LinkedIn presence with AI-generated content, smart messaging, and job application tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.open('https://chromewebstore.google.com/detail/requill-beta-powered-by-o/bhbnnmbpmjjgnncgbbbnpeabkhhjhhpb', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                <Chrome className="h-5 w-5" />
                Add to Chrome
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => router.push('/test-jobs')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                View Job Tracker Demo
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Features</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Creation</h4>
                  <p className="text-gray-600 text-sm">Generate engaging posts and articles.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Messaging</h4>
                  <p className="text-gray-600 text-sm">Craft personalized connection requests.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Job Tracking</h4>
                  <p className="text-gray-600 text-sm">Track and manage your job applications.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}