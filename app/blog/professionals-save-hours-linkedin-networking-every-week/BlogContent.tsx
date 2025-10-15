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
  { id: 'why-saves-more-time', title: 'Why Requill Saves More Time Than Other Tools' },
  { id: 'faq', title: 'FAQ' },
  { id: 'final-recommendation', title: 'Final Recommendation' },
];

const popularPosts = [
  { title: 'Requill vs. LinkedIn Sales Navigator: The Smarter, Cost-Effective Choice', slug: 'requill-vs-linkedin-sales-navigator-smarter-cost-effective-choice-2025' },
  { title: 'How to Read LinkedIn Posts Faster Without Missing Key Insights', slug: 'read-linkedin-posts-faster-without-missing-key-insights' },
  { title: 'How Can Executives Save Time on LinkedIn and Focus on High-Value Work', slug: 'executives-save-time-linkedin-focus-high-value-work' },
  { title: 'Best Chrome Extension for LinkedIn Summaries in 2025', slug: 'requill-best-chrome-extension-2025' },
  { title: 'How to Automate LinkedIn Outreach in 2025', slug: 'automate-linkedin-outreach-2025' },
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

          {/* Main Content */}
          <main className="lg:col-span-6">
            <article className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
              }} />
              <div className="relative z-10">
                <header className="mb-8">
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <time dateTime="2025-01-19">
                      January 19, 2025
                    </time>
                    <span className="mx-2">•</span>
                    <span>Renuga S, Co-Founder @ ExecutivesAI</span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    How Professionals Save Hours on{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      LinkedIn Networking
                    </span>{' '}
                    Every Week
                  </h1>
                  
                  <p className="text-xl text-gray-300">
                    Use Requill to automate summaries and replies directly inside LinkedIn, freeing you from endless scrolling and repetitive typing.
                  </p>
                </header>

                <div className="prose prose-lg max-w-none text-gray-300">
                  <div id="quick-answer" className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6 mb-8 backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-blue-300 mb-3">Quick Answer</h2>
                    <p className="text-blue-200">
                      Professionals save hours each week by using Requill to automate summaries and replies directly inside LinkedIn. It frees them from endless scrolling and repetitive typing, allowing them to focus on meaningful conversations.
                    </p>
                  </div>

                  <h2 id="why-people-search" className="text-2xl font-bold text-white mb-4 mt-8">Why People Search for This</h2>
                  <p className="mb-6 text-gray-300">
                    LinkedIn can feel like a time sink — reading long posts, scanning profiles, and writing messages all consume valuable hours. People want to reclaim their time without sacrificing the benefits of networking.
                  </p>

                  <h2 id="what-requill-does" className="text-2xl font-bold text-white mb-4">What Requill Does</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">⚡</span>
                        <h3 className="text-blue-300 font-semibold">Instant Summaries</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Summarizes posts, profiles and articles instantly.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">🤖</span>
                        <h3 className="text-green-300 font-semibold">Smart Replies</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Generates personalized replies and connection requests.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">📋</span>
                        <h3 className="text-purple-300 font-semibold">Unified Interface</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Organizes everything in a single side panel within LinkedIn.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-700/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">🚀</span>
                        <h3 className="text-orange-300 font-semibold">Streamlined Workflow</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Streamlines your workflow so you can engage quickly.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔒</span>
                      <div>
                        <h3 className="text-green-300 font-semibold">Privacy First</h3>
                        <p className="text-gray-300 text-sm">Keeps your data private — nothing is stored on servers.</p>
                      </div>
                    </div>
                  </div>

                  <h2 id="how-to-use" className="text-2xl font-bold text-white mb-4">How to Use Requill</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-4">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <h3 className="text-white font-semibold">Install Requill and log in.</h3>
                        <p className="text-gray-300 text-sm">Quick setup from Chrome Web Store in under 2 minutes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-4">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <h3 className="text-white font-semibold">Browse LinkedIn as usual.</h3>
                        <p className="text-gray-300 text-sm">No change to your normal LinkedIn browsing experience.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-4">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <h3 className="text-white font-semibold">Use the "Summarize" button.</h3>
                        <p className="text-gray-300 text-sm">Get quick insights on posts, profiles and articles instantly.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-700/50 rounded-lg p-4">
                      <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                      <div>
                        <h3 className="text-white font-semibold">Generate replies when ready to engage.</h3>
                        <p className="text-gray-300 text-sm">Click "Generate Reply" or "Generate Connection Note" for instant responses.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-700/50 rounded-lg p-4">
                      <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">5</div>
                      <div>
                        <h3 className="text-white font-semibold">Spend more time networking, less time reading.</h3>
                        <p className="text-gray-300 text-sm">Focus on meaningful conversations instead of content consumption.</p>
                      </div>
                    </div>
                  </div>

                  <h2 id="who-should-use" className="text-2xl font-bold text-white mb-4">Who Should Use Requill</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-5">
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">👔</span>
                        <h3 className="text-blue-300 font-semibold">Executives</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Juggling multiple conversations while maintaining thought leadership.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-5">
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">🎯</span>
                        <h3 className="text-green-300 font-semibold">Coaches & Consultants</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Building their client base through strategic networking.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-5">
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">📈</span>
                        <h3 className="text-purple-300 font-semibold">Sales Teams</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Researching prospects and maintaining relationship pipelines.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-700/50 rounded-lg p-5">
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">🌟</span>
                        <h3 className="text-orange-300 font-semibold">Busy Professionals</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Anyone who wants to network effectively without spending hours online.</p>
                    </div>
                  </div>

                  <h2 id="why-saves-more-time" className="text-2xl font-bold text-white mb-4">Why Requill Saves More Time Than Other Tools</h2>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-700 rounded-lg p-6 mb-6">
                    <p className="text-gray-300 mb-4">
                      Most AI tools require you to leave LinkedIn and paste content elsewhere. Requill keeps everything in one place, delivering summaries and replies in seconds. It's the most efficient way to handle LinkedIn networking.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-red-300 font-semibold mb-2 flex items-center">
                          <span className="mr-2">❌</span>Other AI Tools
                        </h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                          <li>• Copy content to external apps</li>
                          <li>• Switch between multiple tabs</li>
                          <li>• Wait for processing</li>
                          <li>• Paste responses back to LinkedIn</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                          <span className="mr-2">✅</span>Requill
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Works directly inside LinkedIn</li>
                          <li>• Single-click summaries</li>
                          <li>• Instant AI-generated replies</li>
                          <li>• Seamless workflow integration</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h2 id="faq" className="text-2xl font-bold text-white mb-4">FAQ</h2>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Q: Can Requill handle high volumes of posts and messages?</h3>
                      <p className="text-gray-300">Yes, within the limits of your plan, Requill is designed to process multiple items quickly.</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Q: Is there a learning curve?</h3>
                      <p className="text-gray-300">Requill is intuitive. Most users start saving time immediately after installation.</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Q: Does Requill work on mobile devices?</h3>
                      <p className="text-gray-300">Currently, Requill is optimized for desktop Chrome. A mobile version is in development.</p>
                    </div>
                  </div>

                  <h2 id="final-recommendation" className="text-2xl font-bold text-white mb-4">Final Recommendation</h2>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6">
                    <p className="text-gray-300 mb-4">
                      If you want to network efficiently and reclaim hours each week, install Requill. It's the smartest way to manage LinkedIn networking without wasting time.
                    </p>
                    <p className="font-semibold text-blue-300">
                      Start saving hours on LinkedIn networking today — your productivity will thank you.
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