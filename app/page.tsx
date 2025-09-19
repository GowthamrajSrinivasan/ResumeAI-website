"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from "react";
import { ArrowRight, Chrome, Sparkles, Zap, Shield, Users, BarChart3, Rocket, CheckCircle } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center text-center py-12 h-screen bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-body-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full glass border-b border-gray-200/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-heading-sm text-gray-900 font-bold">Requill</h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-body-md text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-body-md text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="/jobs" className="text-body-md text-gray-600 hover:text-gray-900 transition-colors">Job Tracker</a>
              <a href="/login" className="btn-ghost">Sign In</a>
            </div>

            <button
              onClick={() => window.open('https://chromewebstore.google.com/detail/requill-beta-powered-by-o/bhbnnmbpmjjgnncgbbbnpeabkhhjhhpb', '_blank')}
              className="btn-primary"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Install Extension
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-body-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Advanced AI
            </div>

            <h1 className="text-display-lg text-gray-900 mb-6 max-w-4xl mx-auto">
              Transform Your{' '}
              <span className="text-transparent bg-gradient-primary bg-clip-text">
                LinkedIn Experience
              </span>{' '}
              with AI
            </h1>

            <p className="text-body-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Streamline your professional networking, job search, and content creation with our intelligent
              LinkedIn assistant. Save hours every week with automated insights and personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.open('https://chromewebstore.google.com/detail/requill-beta-powered-by-o/bhbnnmbpmjjgnncgbbbnpeabkhhjhhpb', '_blank')}
                className="btn-primary px-8 py-4 text-body-md"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>

              <a href="/jobs" className="btn-secondary px-8 py-4 text-body-md">
                Try Job Tracker
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-body-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Free to start
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Works instantly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-display-sm text-gray-900 mb-4">
              Everything you need to succeed on LinkedIn
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of AI tools helps you build meaningful connections,
              find opportunities, and grow your professional presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-hover p-8 text-center group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 transition-colors">
                <Zap className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-3">Smart Job Tracking</h3>
              <p className="text-body-md text-gray-600">
                Automatically track your job applications, interviews, and follow-ups with intelligent
                status management and reminders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-hover p-8 text-center group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors">
                <Users className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-3">Network Analysis</h3>
              <p className="text-body-md text-gray-600">
                Get insights into your professional network and discover strategic connections
                to accelerate your career growth.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-hover p-8 text-center group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-3">Performance Analytics</h3>
              <p className="text-body-md text-gray-600">
                Track your LinkedIn engagement, profile views, and networking success with
                detailed analytics and actionable insights.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-hover p-8 text-center group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
                <Rocket className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-3">Content Optimization</h3>
              <p className="text-body-md text-gray-600">
                AI-powered suggestions to improve your posts, comments, and messages for
                maximum engagement and professional impact.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-hover p-8 text-center group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-500 transition-colors">
                <Shield className="h-6 w-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-3">Privacy Protection</h3>
              <p className="text-body-md text-gray-600">
                Your data stays secure with end-to-end encryption and privacy-first design.
                We never share your information with third parties.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-hover p-8 text-center group">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-500 transition-colors">
                <Sparkles className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-3">AI Recommendations</h3>
              <p className="text-body-md text-gray-600">
                Get personalized recommendations for connections, content, and career opportunities
                based on your professional goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-display-sm text-gray-900 mb-6">
            Ready to transform your LinkedIn experience?
          </h2>
          <p className="text-body-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who are already using Requill to accelerate their careers.
            Get started in seconds with our free Chrome extension.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.open('https://chromewebstore.google.com/detail/requill-beta-powered-by-o/bhbnnmbpmjjgnncgbbbnpeabkhhjhhpb', '_blank')}
              className="btn-primary px-8 py-4 text-body-md"
            >
              <Chrome className="h-5 w-5 mr-2" />
              Install Free Extension
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>

            <a href="/jobs" className="btn-ghost px-8 py-4 text-body-md">
              Explore Job Tracker
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center text-body-sm text-gray-500">
            <span>★★★★★</span>
            <span className="ml-2">Trusted by 10,000+ users</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-heading-sm font-bold">Requill</h3>
              </div>
              <p className="text-body-md text-gray-400 max-w-md">
                AI-powered LinkedIn assistant that helps professionals streamline their networking,
                job search, and content creation workflows.
              </p>
            </div>

            <div>
              <h4 className="text-heading-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-body-sm text-gray-400">
                <li><a href="/jobs" className="hover:text-white transition-colors">Job Tracker</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-heading-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-body-sm text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-body-sm text-gray-400">
              © 2024 Requill. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}