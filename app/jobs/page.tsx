"use client";

import { useAuth } from '@/hooks/useAuth';
import { Sparkles, User, Crown, LogOut, Home, BarChart3 } from 'lucide-react';
import JobTrackerReal from '@/components/JobTrackerReal';

export default function JobsPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full glass border-b border-gray-200/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-heading-sm text-gray-900 font-bold">Requill Job Tracker</h1>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="flex items-center space-x-2 text-body-md text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a
                href="/dashboard"
                className="flex items-center space-x-2 text-body-md text-gray-600 hover:text-gray-900 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-body-sm text-blue-700 font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-body-sm text-gray-600 hover:text-red-600 transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="btn-primary"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Title Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-display-sm text-gray-900 mb-4">
              Job Application Tracker
            </h1>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Manage your job applications with intelligent tracking, status updates, and insights
              to help you land your dream role.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <JobTrackerReal />
        </div>
      </section>
    </div>
  );
}