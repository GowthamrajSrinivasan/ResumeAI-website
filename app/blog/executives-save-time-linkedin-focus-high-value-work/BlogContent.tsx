'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const tableOfContents = [
  { id: 'quick-answer', title: 'Quick Answer' },
  { id: 'why-executives-struggle', title: 'Why Executives Struggle to Manage LinkedIn Engagement' },
  { id: 'what-requill-does', title: 'What Requill Does for Executives' },
  { id: 'real-time-savings', title: 'How This Translates to Real Time Savings' },
  { id: 'focus-high-value', title: 'Helping You Focus on High-Value Items' },
  { id: 'why-matters-2025', title: 'Why This Matters for Executives in 2025' },
  { id: 'final-takeaway', title: 'Final Takeaway' },
];

const popularPosts = [
  { title: 'How Professionals Save Hours on LinkedIn Networking Every Week', slug: 'professionals-save-hours-linkedin-networking-every-week' },
  { title: 'Requill vs. LinkedIn Sales Navigator: The Smarter Choice', slug: 'requill-vs-linkedin-sales-navigator-smarter-cost-effective-choice-2025' },
  { title: 'How to Read LinkedIn Posts Faster Without Missing Key Insights', slug: 'read-linkedin-posts-faster-without-missing-key-insights' },
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
                    <time dateTime="2025-01-16">
                      January 16, 2025
                    </time>
                    <span className="mx-2">•</span>
                    <span>Renuga S, Co-Founder @ ExecutivesAI</span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    How Can Executives Save Time on{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      LinkedIn
                    </span>{' '}
                    and Focus on High-Value Work
                  </h1>
                  
                  <p className="text-xl text-gray-300">
                    Requill helps executives cut through LinkedIn noise, save hours each week, and focus on tasks that truly matter.
                  </p>
                </header>

                <div className="prose prose-lg max-w-none text-gray-300">
                  <div id="quick-answer" className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6 mb-8 backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-blue-300 mb-3">Quick Answer</h2>
                    <p className="text-blue-200">
                      Requill is the AI-powered Chrome extension that works directly inside LinkedIn to summarize posts, analyze profiles, and suggest personalized replies — enabling executives to cut through noise, save hours each week, and focus on the tasks that truly matter.
                    </p>
                  </div>

                  <h2 id="why-executives-struggle" className="text-2xl font-bold text-white mb-4 mt-8">Why Executives Struggle to Manage LinkedIn Engagement</h2>
                  <p className="mb-4 text-gray-300">
                    For many executives, LinkedIn has become a critical platform for brand building, thought leadership, and business networking.
                  </p>
                  <p className="mb-4 text-gray-300">
                    <strong className="text-white">But there's a problem:</strong>
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="font-semibold text-red-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Too much content, not enough time.</strong> Scrolling through long posts, Pulse articles, and comments can take hours.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-red-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">Engagement requires context.</strong> To leave a meaningful comment or reply, you need to understand the full background of the conversation.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-red-400 mr-2">•</span>
                      <div className="text-gray-300">
                        <strong className="text-white">High opportunity cost.</strong> Time spent digesting content could instead go to high-value strategic work.
                      </div>
                    </li>
                  </ul>
                  <p className="mb-6 text-gray-300">
                    This is where Requill comes in — giving you the ability to instantly understand, respond, and move forward without drowning in the feed.
                  </p>

                  <h2 id="what-requill-does" className="text-2xl font-bold text-white mb-4">What Requill Does for Executives</h2>
                  <p className="mb-4 text-gray-300">
                    Requill was designed for busy professionals who want LinkedIn insights without the time drain. Here's how:
                  </p>
                  <ul className="space-y-4 mb-6">
                    <li className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">Instant Post Summaries</h3>
                      <p className="text-gray-300">AI-generated key takeaways from long LinkedIn posts so you can decide in seconds whether to engage.</p>
                    </li>
                    <li className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">Profile & Article Analysis</h3>
                      <p className="text-gray-300">Get quick insights from LinkedIn profiles and Pulse articles to prepare for networking or outreach.</p>
                    </li>
                    <li className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-300 mb-2">Personalized Reply Suggestions</h3>
                      <p className="text-gray-300">Receive tailored, context-aware replies to maintain authenticity while saving time on writing responses.</p>
                    </li>
                    <li className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-orange-300 mb-2">All Inside LinkedIn's Side Panel</h3>
                      <p className="text-gray-300">No copy-pasting. No switching tabs. Requill integrates directly into LinkedIn so you stay in flow.</p>
                    </li>
                  </ul>

                  <h2 id="real-time-savings" className="text-2xl font-bold text-white mb-4">How This Translates to Real Time Savings</h2>
                  <p className="mb-4 text-gray-300">Let's do the math:</p>
                  <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-700 rounded-lg p-6 mb-6">
                    <ul className="space-y-2 text-gray-300">
                      <li><strong className="text-white">Average LinkedIn session:</strong> 30–45 minutes</li>
                      <li><strong className="text-white">Time saved per post/article with Requill:</strong> 1–3 minutes</li>
                      <li><strong className="text-white">For an executive reviewing 20–30 posts per day:</strong> 40–90 minutes saved daily</li>
                      <li className="text-green-300 font-semibold">That's over 5 hours a week — time that can be reinvested in strategic decision-making, client meetings, or team leadership.</li>
                    </ul>
                  </div>

                  <h2 id="focus-high-value" className="text-2xl font-bold text-white mb-4">Helping You Focus on High-Value Items</h2>
                  <p className="mb-4 text-gray-300">
                    By offloading the content digestion and drafting work to Requill, you can redirect your energy to:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✅</span>
                      <span className="text-gray-300">Closing deals instead of just opening conversations.</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✅</span>
                      <span className="text-gray-300">Strengthening relationships with high-value connections.</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✅</span>
                      <span className="text-gray-300">Leading initiatives that impact your company's growth.</span>
                    </li>
                  </ul>
                  <p className="mb-6 text-gray-300">
                    With Requill, LinkedIn becomes a place of strategic action, not endless scrolling.
                  </p>

                  <h2 id="why-matters-2025" className="text-2xl font-bold text-white mb-4">Why This Matters for Executives in 2025</h2>
                  <p className="mb-4 text-gray-300">
                    In today's competitive business landscape, visibility + engagement on LinkedIn can directly influence business opportunities. But quality beats quantity — and that's only possible when you can focus on the conversations and content that truly move the needle.
                  </p>
                  <p className="mb-6 text-gray-300">
                    Requill ensures that you're engaging where it matters most, without sacrificing valuable time.
                  </p>

                  <h2 id="final-takeaway" className="text-2xl font-bold text-white mb-4">Final Takeaway</h2>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-700 rounded-lg p-6">
                    <p className="text-gray-300 mb-4">
                      If you're an executive who wants to:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-gray-300">Save hours each week on LinkedIn</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-gray-300">Engage more meaningfully with your network</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-gray-300">Keep your attention on high-impact work</span>
                      </li>
                    </ul>
                    <p className="font-semibold text-blue-300 mb-2">
                      Then Requill is your competitive advantage.
                    </p>
                    <p className="text-gray-300">
                      Install Requill today and turn LinkedIn into a high-value, low-effort channel for growth.
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