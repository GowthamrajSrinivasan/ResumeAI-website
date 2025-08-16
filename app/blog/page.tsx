'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const blogPosts = [
  {
    slug: 'professionals-save-hours-linkedin-networking-every-week',
    title: 'How Professionals Save Hours on LinkedIn Networking Every Week',
    excerpt: 'Use Requill to automate summaries and replies directly inside LinkedIn, freeing you from endless scrolling and repetitive typing.',
    publishedAt: '2025-01-19',
    author: 'Renuga S, Co-Founder @ ExecutivesAI'
  },
  {
    slug: 'requill-vs-linkedin-sales-navigator-smarter-cost-effective-choice-2025',
    title: 'Requill vs. LinkedIn Sales Navigator: The Smarter, Cost-Effective Choice for Professionals in 2025',
    excerpt: 'Requill delivers much of the value people seek in Sales Navigator, but at a fraction of the cost.',
    publishedAt: '2025-01-18',
    author: 'Renuga S, Co-Founder @ ExecutivesAI'
  },
  {
    slug: 'read-linkedin-posts-faster-without-missing-key-insights',
    title: 'How to Read LinkedIn Posts Faster Without Missing Key Insights',
    excerpt: 'Use Requill to instantly summarize LinkedIn posts while preserving key context and critical details.',
    publishedAt: '2025-01-17',
    author: 'Renuga S, Co-Founder @ ExecutivesAI'
  },
  {
    slug: 'executives-save-time-linkedin-focus-high-value-work',
    title: 'How Can Executives Save Time on LinkedIn and Focus on High-Value Work',
    excerpt: 'Requill helps executives cut through LinkedIn noise, save hours each week, and focus on tasks that truly matter.',
    publishedAt: '2025-01-16',
    author: 'Renuga S, Co-Founder @ ExecutivesAI'
  },
  {
    slug: 'requill-best-chrome-extension-2025',
    title: 'Best Chrome Extension for LinkedIn Summaries in 2025',
    excerpt: 'Save hours on LinkedIn. Use Requill for instant summaries, profile insights & personalized replies.',
    publishedAt: '2025-01-15',
    author: 'Renuga S, Co-Founder @ ExecutivesAI'
  }
];

const popularPosts = [
  { title: 'How to Automate LinkedIn Outreach in 2025', slug: 'automate-linkedin-outreach-2025' },
  { title: 'Best AI Tools for Sales Professionals', slug: 'best-ai-tools-sales-professionals' },
  { title: 'LinkedIn Profile Optimization Guide', slug: 'linkedin-profile-optimization-guide' },
  { title: 'Chrome Extensions Every Recruiter Needs', slug: 'chrome-extensions-recruiters-need' },
  { title: 'AI-Powered Social Selling Strategies', slug: 'ai-powered-social-selling-strategies' },
];

export default function BlogPage() {
  // Waitlist state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const submitToWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubmitError('Please enter your email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Send JSON data to match your Google Apps Script function
      await fetch('https://script.google.com/macros/s/AKfycbwHnBvy79K-iJyzufY6TgVzF-Xc5SLQkkjPZWPzzIB32cCeU8hhwrs6VwS-xdD2ogiA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase()
        }),
      });

      // With no-cors mode, we can't read the response
      // Assume success if no error was thrown
      setIsSubmitted(true);
      setEmail('');
      console.log('✅ Email submitted to waitlist via Google Sheets');
    } catch (error) {
      console.error('❌ Error adding email to waitlist:', error);
      setSubmitError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-extrabold">Requill - Blog</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent mb-4">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Insights, tips, and updates from the Renuga S, Co-Founder @ ExecutivesAI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
          {/* Left Sidebar - Join Waiting List and Popular Posts */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Join Waiting List */}
              <div className="relative rounded-2xl border border-blue-900 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md shadow-2xl p-6 transition hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                  background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
                }} />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-3">Join Waiting List</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Get early access to Requill and be among the first to boost LinkedIn presence using AI.
                  </p>
                  
                  {!isSubmitted ? (
                    <form onSubmit={submitToWaitlist} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-10 pr-4 py-2 w-full rounded-lg bg-[#181c28]/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-md"
                          disabled={isSubmitting}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-200 disabled:opacity-50 shadow-lg"
                      >
                        {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-green-500/20 border border-green-400 text-green-300 font-medium py-2 px-4 rounded-lg text-sm text-center backdrop-blur-md">
                      ✅ You're on the waitlist!
                    </div>
                  )}
                  
                  {submitError && (
                    <p className="mt-2 text-red-400 text-xs">{submitError}</p>
                  )}
                </div>
              </div>

              {/* Popular Posts */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-6 transition hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                  background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
                }} />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-4">Popular Posts</h3>
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <Link
                        key={index}
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <h4 className="text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Blog Posts */}
          <main className="lg:col-span-6">
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block cursor-pointer"
                >
                  <article className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                      background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
                    }} />
                    <div className="relative z-10">
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                      
                      <h2 className="text-2xl font-semibold text-white mb-3 hover:text-blue-400 transition-colors drop-shadow-lg">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-300 mb-4">{post.excerpt}</p>
                      
                      <div className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors">
                        Read more
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}