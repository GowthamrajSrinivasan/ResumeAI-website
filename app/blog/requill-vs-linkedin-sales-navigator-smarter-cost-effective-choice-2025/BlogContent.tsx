'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const tableOfContents = [
  { id: 'quick-answer', title: 'Quick Answer' },
  { id: 'why-people-compare', title: 'Why People Compare Requill and Sales Navigator' },
  { id: 'cost-value-comparison', title: 'Cost-to-Value Comparison' },
  { id: 'comparison-table', title: 'Side-by-Side Comparison' },
  { id: 'who-should-choose', title: 'Who Should Choose What?' },
  { id: 'final-thoughts', title: 'Final Thoughts' },
];

const popularPosts = [
  { title: 'How to Read LinkedIn Posts Faster Without Missing Key Insights', slug: 'read-linkedin-posts-faster-without-missing-key-insights' },
  { title: 'How Can Executives Save Time on LinkedIn and Focus on High-Value Work', slug: 'executives-save-time-linkedin-focus-high-value-work' },
  { title: 'Best Chrome Extension for LinkedIn Summaries in 2025', slug: 'requill-best-chrome-extension-2025' },
  { title: 'How to Automate LinkedIn Outreach in 2025', slug: 'automate-linkedin-outreach-2025' },
  { title: 'Best AI Tools for Sales Professionals', slug: 'best-ai-tools-sales-professionals' },
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
                    <time dateTime="2025-01-18">
                      January 18, 2025
                    </time>
                    <span className="mx-2">•</span>
                    <span>Renuga S, Co-Founder @ ExecutivesAI</span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    Requill vs.{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      LinkedIn Sales Navigator
                    </span>: The Smarter, Cost-Effective Choice for Professionals in 2025
                  </h1>
                  
                  <p className="text-xl text-gray-300">
                    Requill delivers much of the value people seek in Sales Navigator, but at a fraction of the cost.
                  </p>
                </header>

                <div className="prose prose-lg max-w-none text-gray-300">
                  <div id="quick-answer" className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6 mb-8 backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-blue-300 mb-3">Quick Answer</h2>
                    <p className="text-blue-200">
                      If you're spending on LinkedIn Sales Navigator just to get insights and improve engagement, you might be overpaying. Requill — a lightweight Chrome extension — gives professionals instant summaries of posts, profile analysis, and personalized reply suggestions inside LinkedIn. It delivers much of the value people seek in Sales Navigator, but at a fraction of the cost.
                    </p>
                  </div>

                  <h2 id="why-people-compare" className="text-2xl font-bold text-white mb-4 mt-8">Why People Compare Requill and Sales Navigator</h2>
                  <p className="mb-4 text-gray-300">
                    LinkedIn Sales Navigator has long been marketed as the ultimate tool for prospecting, networking, and sales intelligence. But most professionals, freelancers, and executives don't use its advanced search filters to their full potential. Instead, they want:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Quick understanding</strong> of posts and articles without wasting time.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Profile insights</strong> to engage with the right people.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Personalized replies/messages</strong> that help them build stronger connections.
                      </div>
                    </li>
                  </ul>
                  <p className="mb-6 text-gray-300">
                    That's exactly what Requill delivers — without the hefty monthly subscription.
                  </p>

                  <h2 id="cost-value-comparison" className="text-2xl font-bold text-white mb-4">Cost-to-Value Comparison</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-300 mb-4">1. Price Point</h3>
                      <p className="text-gray-300">
                        Requill costs a fraction of Sales Navigator, yet covers the core needs of professionals who want efficiency, not complex sales funnels.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">2. Learning Curve</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-red-300 font-semibold">Sales Navigator:</p>
                          <p className="text-gray-300">Requires learning advanced filters, Boolean searches, and manual lead management.</p>
                        </div>
                        <div>
                          <p className="text-green-300 font-semibold">Requill:</p>
                          <p className="text-gray-300">Zero learning curve. Just install, log in, and use the side panel on LinkedIn posts, profiles, and articles.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-orange-300 mb-4">3. Value Delivery</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-red-300 font-semibold">Sales Navigator:</p>
                          <p className="text-gray-300">Built for sales teams managing large pipelines. Overkill for executives, consultants, and solo professionals.</p>
                        </div>
                        <div>
                          <p className="text-green-300 font-semibold">Requill:</p>
                          <p className="text-gray-300">Built for time savings — summarize content, analyze profiles, and generate context-aware replies instantly.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-300 mb-4">4. Privacy & Simplicity</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-red-300 font-semibold">Sales Navigator:</p>
                          <p className="text-gray-300">Deep integration with LinkedIn's backend, tracking searches and activity.</p>
                        </div>
                        <div>
                          <p className="text-green-300 font-semibold">Requill:</p>
                          <p className="text-gray-300">Keeps data private — no LinkedIn data is stored. It works only with what's visible on your screen.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="comparison-table" className="text-2xl font-bold text-white mb-4">Side-by-Side Comparison</h2>
                  <div className="overflow-x-auto mb-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-md">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-3 px-4 text-white font-semibold">Feature</th>
                            <th className="text-center py-3 px-4 text-blue-300 font-semibold">Requill</th>
                            <th className="text-center py-3 px-4 text-orange-300 font-semibold">Sales Navigator</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Monthly Cost</td>
                            <td className="py-3 px-4 text-center text-green-400">$3.99</td>
                            <td className="py-3 px-4 text-center text-red-400">$99+</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Post Summaries</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ Instant AI summaries</td>
                            <td className="py-3 px-4 text-center text-red-400">❌ Manual reading</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Profile Analysis</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ AI-powered insights</td>
                            <td className="py-3 px-4 text-center text-orange-400">⚠️ Manual analysis</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Reply Suggestions</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ Context-aware AI replies</td>
                            <td className="py-3 px-4 text-center text-red-400">❌ Write manually</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Advanced Search</td>
                            <td className="py-3 px-4 text-center text-orange-400">⚠️ Basic LinkedIn search</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ Advanced filters</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Lead Management</td>
                            <td className="py-3 px-4 text-center text-red-400">❌ Not included</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ CRM integration</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Learning Curve</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ Zero learning</td>
                            <td className="py-3 px-4 text-center text-red-400">❌ Steep learning</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Privacy</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ Data stays private</td>
                            <td className="py-3 px-4 text-center text-orange-400">⚠️ LinkedIn tracking</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-300 font-medium">Setup Time</td>
                            <td className="py-3 px-4 text-center text-green-400">✅ 2 minutes</td>
                            <td className="py-3 px-4 text-center text-red-400">❌ Hours to master</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <h2 id="who-should-choose" className="text-2xl font-bold text-white mb-4">Who Should Choose What?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-300 mb-4">🎯 Choose Sales Navigator If:</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>• You're a sales manager running a 10+ member team</li>
                        <li>• You need complex Boolean search filters</li>
                        <li>• You manage large sales pipelines</li>
                        <li>• You have budget for $99+/month tools</li>
                        <li>• You need CRM integrations</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-700 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-300 mb-4">🚀 Choose Requill If:</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>• You're an executive, consultant, or freelancer</li>
                        <li>• You want to save time on LinkedIn engagement</li>
                        <li>• You need better content understanding</li>
                        <li>• You want cost-effective LinkedIn efficiency</li>
                        <li>• You prefer simple, privacy-focused tools</li>
                      </ul>
                    </div>
                  </div>

                  <h2 id="final-thoughts" className="text-2xl font-bold text-white mb-4">Final Thoughts</h2>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6 mb-6">
                    <p className="text-gray-300 mb-4">
                      In 2025, professionals are cutting unnecessary costs and focusing on ROI-driven tools. Paying $99/month for Sales Navigator when your main goal is better engagement doesn't add up.
                    </p>
                    <p className="text-gray-300 mb-4">
                      Requill bridges the gap — it delivers instant AI-powered insights and responses directly inside LinkedIn for less than the cost of two coffees a month.
                    </p>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-700 rounded-lg p-4 mt-4">
                      <p className="font-semibold text-yellow-300 flex items-center">
                        💡 <span className="ml-2">If you're looking for cost-to-value, Requill is the clear winner.</span>
                      </p>
                    </div>
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