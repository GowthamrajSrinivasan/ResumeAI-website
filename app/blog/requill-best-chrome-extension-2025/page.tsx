'use client';

import Link from 'next/link';
import { Metadata } from 'next';
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Chrome Extension for LinkedIn Summaries in 2025 | Requill',
  description: 'Save hours on LinkedIn. Use Requill for instant summaries, profile insights & personalized replies.',
};

const tableOfContents = [
  { id: 'quick-answer', title: 'Quick Answer' },
  { id: 'why-people-search', title: 'Why People Search for This' },
  { id: 'what-requill-does', title: 'What Requill Does' },
  { id: 'how-to-use', title: 'How to Use Requill' },
  { id: 'who-should-use', title: 'Who Should Use Requill' },
  { id: 'why-better', title: 'Why Requill is Better' },
  { id: 'faq', title: 'FAQ' },
  { id: 'final-recommendation', title: 'Final Recommendation' },
];

const popularPosts = [
  { title: 'How to Automate LinkedIn Outreach in 2025', slug: 'automate-linkedin-outreach-2025' },
  { title: 'Best AI Tools for Sales Professionals', slug: 'best-ai-tools-sales-professionals' },
  { title: 'LinkedIn Profile Optimization Guide', slug: 'linkedin-profile-optimization-guide' },
  { title: 'Chrome Extensions Every Recruiter Needs', slug: 'chrome-extensions-recruiters-need' },
  { title: 'AI-Powered Social Selling Strategies', slug: 'ai-powered-social-selling-strategies' },
];

export default function RequillBestChromeExtensionPost() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Table of Contents */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ON THIS PAGE</h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Join Waiting List */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Join Waiting List</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get early access to Requill and be the first to supercharge your LinkedIn presence.
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
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        disabled={isSubmitting}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-100 border border-green-200 text-green-800 font-medium py-2 px-4 rounded-lg text-sm text-center">
                    ✅ You're on the waitlist!
                  </div>
                )}
                
                {submitError && (
                  <p className="mt-2 text-red-500 text-xs">{submitError}</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <header className="mb-8">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <time dateTime="2025-01-15">
                    January 15, 2025
                  </time>
                  <span className="mx-2">•</span>
                  <span>Requill Team</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Best Chrome Extension for LinkedIn Summaries in 2025
                </h1>
                
                <p className="text-xl text-gray-600">
                  Save hours on LinkedIn. Use Requill for instant summaries, profile insights & personalized replies.
                </p>
              </header>

              <div className="prose prose-lg max-w-none text-gray-700">
                <div id="quick-answer" className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">Quick Answer</h2>
                  <p className="text-blue-800">
                    In 2025, Requill is the top Chrome extension for summarizing LinkedIn posts. It works seamlessly inside LinkedIn to deliver instant AI-generated summaries and personalized replies — all while keeping your data 100% private.
                  </p>
                </div>

                <h2 id="why-people-search" className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why People Search for This</h2>
                <p className="mb-6">
                  LinkedIn is filled with long posts, detailed articles, and in-depth discussions. Professionals spend hours scrolling, yet often struggle to extract the main points quickly. With AI adoption at an all-time high, people now want a fast, accurate, and privacy-focused tool that helps them consume and respond to LinkedIn content without wasting time.
                </p>

                <h2 id="what-requill-does" className="text-2xl font-bold text-gray-900 mb-4">What Requill Does</h2>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Instant Post Summaries</strong> – See the key takeaways of any LinkedIn post in seconds.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Profile & Article Analysis</strong> – Get deeper context before starting a conversation.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Personalized Replies</strong> – AI-generated responses tailored to the specific post or profile.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Native LinkedIn Integration</strong> – Works inside LinkedIn's side panel — no copy-paste or tab switching.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Data Privacy First</strong> – No LinkedIn data is stored.
                    </div>
                  </li>
                </ul>

                <h2 id="how-to-use" className="text-2xl font-bold text-gray-900 mb-4">How to Use Requill</h2>
                <ol className="list-decimal list-inside space-y-2 mb-6">
                  <li>Install Requill from the Chrome Web Store.</li>
                  <li>Sign in with your account.</li>
                  <li>Open any LinkedIn post, profile, or article.</li>
                  <li>Click "Summarize" in the Requill side panel.</li>
                  <li>Read the summary, then use "Generate Reply" to engage instantly.</li>
                </ol>

                <h2 id="who-should-use" className="text-2xl font-bold text-gray-900 mb-4">Who Should Use Requill</h2>
                <ul className="space-y-2 mb-6">
                  <li><strong>Recruiters</strong> – Quickly screen candidate updates.</li>
                  <li><strong>Sales Professionals</strong> – Stay on top of prospect activity.</li>
                  <li><strong>Executives & Managers</strong> – Keep informed without drowning in feeds.</li>
                  <li><strong>Content Creators</strong> – Spot engagement opportunities faster.</li>
                </ul>

                <h2 id="why-better" className="text-2xl font-bold text-gray-900 mb-4">Why Requill is Better Than Other Tools</h2>
                <p className="mb-4">
                  Unlike most AI tools that force you to copy text into another app, Requill works directly inside LinkedIn.
                </p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span>No interruptions</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span>No extra steps</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span>Better context for summaries & replies</span>
                  </div>
                </div>

                <h2 id="faq" className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Q: Does Requill work on all LinkedIn posts?</h3>
                    <p>Yes. If you can view it, Requill can summarize it.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Q: Is Requill free?</h3>
                    <p>Yes, with core features included. Premium plans offer higher usage limits and deeper personalization.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Q: Can it summarize LinkedIn Pulse articles?</h3>
                    <p>Absolutely. Requill turns long-form articles into quick, actionable insights.</p>
                  </div>
                </div>

                <h2 id="final-recommendation" className="text-2xl font-bold text-gray-900 mb-4">Final Recommendation</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-800 mb-4">
                    If you want to read more, scroll less, and engage smarter, Requill is the best Chrome extension for summarizing LinkedIn posts in 2025.
                  </p>
                  <p className="font-semibold text-blue-900">
                    Install it today and turn LinkedIn into a time-efficient networking powerhouse.
                  </p>
                </div>
              </div>
            </article>
          </main>

          {/* Right Sidebar - Popular Posts */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={index}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}