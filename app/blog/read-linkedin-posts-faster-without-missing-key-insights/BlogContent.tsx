'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const tableOfContents = [
  { id: 'quick-answer', title: 'Quick Answer' },
  { id: 'why-people-search', title: 'Why People Search for This' },
  { id: 'what-requill-does', title: 'What Requill Does' },
  { id: 'how-to-use', title: 'How to Use Requill' },
  { id: 'who-should-use', title: 'Who Should Use Requill' },
  { id: 'why-better-than-skimming', title: 'Why Requill is Better Than Skimming Manually' },
  { id: 'faq', title: 'FAQ' },
  { id: 'final-recommendation', title: 'Final Recommendation' },
];

const popularPosts = [
  { title: 'How Professionals Save Hours on LinkedIn Networking Every Week', slug: 'professionals-save-hours-linkedin-networking-every-week' },
  { title: 'Requill vs. LinkedIn Sales Navigator: The Smarter Choice', slug: 'requill-vs-linkedin-sales-navigator-smarter-cost-effective-choice-2025' },
  { title: 'How Can Executives Save Time on LinkedIn and Focus on High-Value Work', slug: 'executives-save-time-linkedin-focus-high-value-work' },
  { title: 'Best Chrome Extension for LinkedIn Summaries in 2025', slug: 'requill-best-chrome-extension-2025' },
];

export default function BlogContent() {
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
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
          {/* Left Sidebar - Table of Contents and Popular Posts */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-6 transition hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                  background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
                }} />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-4">ON THIS PAGE</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-gray-300 hover:text-blue-400 transition-colors py-1"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Join Waiting List */}
              <div className="relative rounded-2xl border border-blue-900 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md shadow-2xl p-6 transition hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                  background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
                }} />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-3">Join Waiting List</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Get early access to Requill and be among the first to boost your LinkedIn presence using AI.
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

          {/* Main Content */}
          <main className="lg:col-span-6">
            <article className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
              }} />
              <div className="relative z-10">
                <header className="mb-8">
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <time dateTime="2025-01-17">
                      January 17, 2025
                    </time>
                    <span className="mx-2">•</span>
                    <span>Renuga S, Co-Founder @ ExecutivesAI</span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    How to Read{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      LinkedIn Posts Faster
                    </span>{' '}
                    Without Missing Key Insights
                  </h1>
                  
                  <p className="text-xl text-gray-300">
                    Use Requill to instantly summarize LinkedIn posts while preserving key context and critical details.
                  </p>
                </header>

                <div className="prose prose-lg max-w-none text-gray-300">
                  <div id="quick-answer" className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6 mb-8 backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-blue-300 mb-3">Quick Answer</h2>
                    <p className="text-blue-200">
                      To read LinkedIn posts faster without missing important details, use Requill — an AI-powered Chrome extension that instantly summarizes posts while preserving key context.
                    </p>
                  </div>

                  <h2 id="why-people-search" className="text-2xl font-bold text-white mb-4 mt-8">Why People Search for This</h2>
                  <p className="mb-6 text-gray-300">
                    LinkedIn is full of valuable insights, but posts can be long, repetitive, or filled with fluff. Professionals want a way to scan content quickly without losing the meaning — especially when managing multiple conversations and networking opportunities.
                  </p>

                  <h2 id="what-requill-does" className="text-2xl font-bold text-white mb-4">What Requill Does</h2>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Extracts main points</strong> from any LinkedIn post instantly.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Keeps critical details intact</strong>, so you understand the full message.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Works directly inside your LinkedIn feed</strong> via a side panel.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Lets you engage immediately</strong> with AI-generated comment suggestions.
                      </div>
                    </li>
                  </ul>

                  <h2 id="how-to-use" className="text-2xl font-bold text-white mb-4">How to Use Requill</h2>
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300">
                    <li>Install Requill from the Chrome Web Store.</li>
                    <li>Log in to your account.</li>
                    <li>While browsing LinkedIn, click the Requill icon in the side panel.</li>
                    <li>Select "Summarize Post" to get key points instantly.</li>
                    <li>Optionally, click "Generate Reply" to respond on the spot.</li>
                  </ol>

                  <h2 id="who-should-use" className="text-2xl font-bold text-white mb-4">Who Should Use Requill</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-4">
                      <h3 className="text-blue-300 font-semibold mb-2">Busy Professionals</h3>
                      <p className="text-gray-300 text-sm">Who need quick updates without spending hours scrolling.</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-4">
                      <h3 className="text-green-300 font-semibold mb-2">Recruiters & HR Teams</h3>
                      <p className="text-gray-300 text-sm">Scanning multiple posts daily for talent insights.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-4">
                      <h3 className="text-purple-300 font-semibold mb-2">Sales Teams</h3>
                      <p className="text-gray-300 text-sm">Monitoring prospect activity and engagement opportunities.</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-700/50 rounded-lg p-4">
                      <h3 className="text-orange-300 font-semibold mb-2">Thought Leaders</h3>
                      <p className="text-gray-300 text-sm">Engaging in trending discussions efficiently.</p>
                    </div>
                  </div>

                  <h2 id="why-better-than-skimming" className="text-2xl font-bold text-white mb-4">Why Requill is Better Than Skimming Manually</h2>
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-700 rounded-lg p-6 mb-6">
                    <p className="text-gray-300 mb-4">
                      Skimming risks missing details, especially in posts with mixed personal and professional content. Requill gives you the essentials without the guesswork, and you can engage right away.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-red-300 font-semibold mb-2">❌ Manual Skimming</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                          <li>• Risk missing key details</li>
                          <li>• Time-consuming process</li>
                          <li>• Inconsistent comprehension</li>
                          <li>• No engagement assistance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-green-300 font-semibold mb-2">✅ Requill AI</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Captures all important points</li>
                          <li>• Instant summarization</li>
                          <li>• Consistent quality</li>
                          <li>• Ready-to-use replies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h2 id="faq" className="text-2xl font-bold text-white mb-4">FAQ</h2>
                  <div className="space-y-6 mb-6">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Q: Does it change the tone of the post?</h3>
                      <p className="text-gray-300">No — Requill preserves the author's intent while shortening the content.</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Q: Can I use it on private group posts?</h3>
                      <p className="text-gray-300">Yes, as long as you have access to view them.</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Q: Does it work in other languages?</h3>
                      <p className="text-gray-300">Yes, Requill supports multiple languages for summaries.</p>
                    </div>
                  </div>

                  <h2 id="final-recommendation" className="text-2xl font-bold text-white mb-4">Final Recommendation</h2>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6">
                    <p className="text-gray-300 mb-4">
                      If you value your time but still want to stay informed, Requill is the easiest way to read LinkedIn posts faster without losing the insights that matter.
                    </p>
                    <p className="font-semibold text-blue-300">
                      Install Requill today and transform how you consume LinkedIn content.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}