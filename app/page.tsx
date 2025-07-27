"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from "react";
import { Squirrel, Mail, ArrowRight } from "lucide-react";
// Using API route only for waitlist submissions

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resetTime, setResetTime] = useState(getNextResetTime());
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(resetTime));
  
  // Waitlist state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function getNextResetTime() {
    const now = new Date();
    const reset = new Date(now);
    reset.setHours(24, 0, 0, 0);
    return reset;
  }
  function getTimeRemaining(resetTime:any) {
    const total = resetTime.getTime() - new Date().getTime();
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { total, hours, minutes, seconds };
  }

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

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(resetTime);
      if (remaining.total <= 0) {
        const newReset = getNextResetTime();
        setResetTime(newReset);
        setTimeLeft(getTimeRemaining(newReset));
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [resetTime]);
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
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Sticky Header */}
      {/* <header className="sticky top-0 z-30 w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-center">
          Hurry! Grab Today <span className="bg-white bg-clip-text text-transparent">Limited Time Offer</span>
        </h1>
        <p className="text-lg md:text-xl mb-2 text-center">
          Offer resets in:
          <span className="ml-2 font-mono font-bold bg-black bg-opacity-30 px-3 py-1 rounded-xl">
            {`${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
          </span>
        </p>
        {!isSubmitted ? (
          <form onSubmit={submitToWaitlist} className="mt-2 flex flex-col sm:flex-row gap-2 items-center">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10 pr-4 py-2 rounded-lg text-black font-medium w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow-md transition duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        ) : (
          <div className="mt-2 px-6 py-2 bg-green-400 text-black font-bold rounded-lg shadow-md">
            ✅ You're on the waitlist!
          </div>
        )}
        {submitError && (
          <p className="mt-1 text-red-300 text-sm">{submitError}</p>
        )}
      </header> */}

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section (smaller) */}
        <section id="header" className="py-20 md:py-28 flex items-center justify-center">
  <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-10 md:p-14 w-full max-w-5xl mx-auto transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
    {/* Subtle radial glow for depth */}
    <div
      className="pointer-events-none absolute inset-0 rounded-2xl"
      style={{
        background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
      }}
    />
    <div className="relative z-10">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
        Supercharge Your{' '}
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          LinkedIn Presence with AI
        </span>
      </h2>
      <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300">
        Stop guessing what works and let AI do the heavy lifting. Create engaging posts, write personalized messages, and optimize your profile in seconds. Unlock your true networking potential and land your next opportunity faster.
      </p>
      {!isSubmitted ? (
        <form onSubmit={submitToWaitlist} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="pl-12 pr-4 py-3 rounded-full text-black font-medium w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              disabled={isSubmitting}
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            {!isSubmitting && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>
      ) : (
        <div className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl flex items-center gap-2">
          ✅ You're on the waitlist! We'll notify you soon.
        </div>
      )}
      {submitError && (
        <p className="mt-4 text-red-400 text-lg">{submitError}</p>
      )}
    </div>
  </div>
</section>



        {/* Benefits & Features Section */}
        <section id="features" className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold drop-shadow-md">Features & Benefits</h3>
              <p className="text-gray-400 mt-2">Unlock your LinkedIn potential with these powerful AI-driven features.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {/* Benefit 1 */}
              <div className="group bg-[#181c28]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl transition transform hover:-translate-y-4 hover:scale-105 duration-300 border border-blue-900
                before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-blue-500/20 before:to-transparent before:z-0 relative overflow-hidden">
                <div className="text-blue-400 mb-5 z-10 relative drop-shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3 z-10 relative">Effortless LinkedIn Engagement</h4>
                <p className="text-gray-400 mb-6 z-10 relative">Busy executive, marketing lead, or job seeker? Our extension helps you stay consistently active on LinkedIn by summarizing posts and crafting personalized replies—so you can maintain your presence without spending hours online.</p>
                <ul className="space-y-4 z-10 relative">
                  <li className="flex items-start">
                    <span className="font-bold text-blue-400 mr-2">&#10003;</span>
                    <div>
                      <h5 className="font-semibold">Stay Consistently Active</h5>
                      <p className="text-gray-500 text-sm">Maintain your LinkedIn presence without spending hours online.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-blue-400 mr-2">&#10003;</span>
                    <div>
                      <h5 className="font-semibold">Personalized Replies</h5>
                      <p className="text-gray-500 text-sm">Craft authentic responses that reflect your professional voice.</p>
                    </div>
                  </li>
                </ul>
                {/* 3D/Glass Glow */}
                <div className="absolute -inset-1 bg-blue-400/30 blur-2xl opacity-0 group-hover:opacity-60 transition pointer-events-none rounded-3xl z-0"></div>
              </div>

              {/* Benefit 2 */}
              <div className="group bg-[#181c28]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl transition transform hover:-translate-y-4 hover:scale-105 duration-300 border border-indigo-900
                before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-500/20 before:to-transparent before:z-0 relative overflow-hidden">
                <div className="text-indigo-400 mb-5 z-10 relative drop-shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3 z-10 relative">Others Are Leveling Up—Why Not You?</h4>
                <p className="text-gray-400 mb-6 z-10 relative">Many professionals are automating their content interactions. With our free tool, you can do it faster, better, and more authentically, freeing you to focus on the creative, complex, and high-impact work that matters most.</p>
                <ul className="space-y-4 z-10 relative">
                  <li className="flex items-start">
                    <span className="font-bold text-indigo-400 mr-2">&#10003;</span>
                    <div>
                    <h5 className="font-semibold">Faster & Better Automation</h5>
                    <p className="text-gray-500 text-sm">Outperform competitors with superior AI-powered interactions.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-indigo-400 mr-2">&#10003;</span>
                    <div>
                      <h5 className="font-semibold">Focus on High-Impact Work</h5>
                      <p className="text-gray-500 text-sm">Free up time for creative and strategic initiatives.</p>
                    </div>
                  </li>
                </ul>
                <div className="absolute -inset-1 bg-indigo-400/30 blur-2xl opacity-0 group-hover:opacity-60 transition pointer-events-none rounded-3xl z-0"></div>
              </div>

              {/* Benefit 3 */}
              <div className="group bg-[#181c28]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl transition transform hover:-translate-y-4 hover:scale-105 duration-300 border border-purple-900
                before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-purple-500/20 before:to-transparent before:z-0 relative overflow-hidden">
                <div className="text-purple-400 mb-5 z-10 relative drop-shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3 z-10 relative">Boost Your LinkedIn Presence, Effortlessly</h4>
                <p className="text-gray-400 mb-6 z-10 relative">Whether you're job hunting or building your personal brand, the extension helps you increase visibility, engagement, and consistency—with minimal effort and maximum impact.</p>
                <ul className="space-y-4 z-10 relative">
                  <li className="flex items-start">
                    <span className="font-bold text-purple-400 mr-2">&#10003;</span>
                    <div>
                      <h5 className="font-semibold">Increase Visibility & Engagement</h5>
                      <p className="text-gray-500 text-sm">Get noticed by recruiters and build your professional brand.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-400 mr-2">&#10003;</span>
                    <div>
                      <h5 className="font-semibold">Minimal Effort, Maximum Impact</h5>
                      <p className="text-gray-500 text-sm">Achieve better results with less time and energy invested.</p>
                    </div>
                  </li>
                </ul>
                <div className="absolute -inset-1 bg-purple-400/30 blur-2xl opacity-0 group-hover:opacity-60 transition pointer-events-none rounded-3xl z-0"></div>
              </div>
            </div>
            
            {/* Pricing CTA */}
            <div className="text-center mt-16">
              <button
                onClick={() => window.location.href = '/pricing'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105"
              >
                View Pricing Plans
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
  <div className="text-center mb-14">
    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent mb-4">
      Security And Data <br /> Protection
    </h2>
  </div>
  <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
    {/* Card 1 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <div className="mb-6">
        <div className="bg-white/10 rounded-xl p-4 shadow-md flex items-center justify-center">
          {/* Lock Icon */}
          <svg className="h-10 w-10 text-blue-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect width="18" height="14" x="3" y="7" rx="4" stroke="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V5a5 5 0 1110 0v2" />
            <circle cx="12" cy="15" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>
      <h4 className="text-xl font-semibold mb-2 text-white">Data ownership</h4>
      <p className="text-gray-300 text-center text-base">
        Your data is yours and you have full control over it. We do not use your data for any other purpose than providing a service to you.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
      }} />
    </div>
    {/* Card 2 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <div className="mb-6">
        <div className="bg-white/10 rounded-xl p-4 shadow-md flex items-center justify-center">
          {/* Download Icon */}
          <svg className="h-10 w-10 text-blue-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5" />
            <rect width="18" height="14" x="3" y="7" rx="4" stroke="currentColor" />
          </svg>
        </div>
      </div>
      <h4 className="text-xl font-semibold mb-2 text-white">Data portability</h4>
      <p className="text-gray-300 text-center text-base">
        You can export all your data anytime in Markdown format, putting the power of portability and accessibility directly in your hands.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
      }} />
    </div>
    {/* Card 3 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <div className="mb-6">
        <div className="bg-white/10 rounded-xl p-4 shadow-md flex items-center justify-center">
          {/* Database Icon */}
          <svg className="h-10 w-10 text-blue-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
          </svg>
        </div>
      </div>
      <h4 className="text-xl font-semibold mb-2 text-white">Privacy Focused</h4>
      <p className="text-gray-300 text-center text-base">
        Augmented Browsing is local first, your knowledge base is stored securely in the cloud.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
      }} />
    </div>
  </div>
</section>

<section  id="faq" className="py-16 px-4">
  <div className="text-center mb-14">
    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent mb-4">
      Frequently Asked Questions
    </h2>
  </div>
  <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
    {/* FAQ 1 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <h4 className="text-lg md:text-xl font-semibold mb-3 text-white">
        Is Requill safe to use with my LinkedIn account?
      </h4>
      <p className="text-gray-300 text-base">
        Yes, Requill is completely safe. It works as a browser extension that assists you with content creation and messaging without compromising your account security. We follow all LinkedIn's terms of service and best practices.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
      }} />
    </div>
    {/* FAQ 2 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <h4 className="text-lg md:text-xl font-semibold mb-3 text-white">
        How does the AI generate personalized content?
      </h4>
      <p className="text-gray-300 text-base">
        Our AI analyzes your industry, role, and professional interests to create content that matches your unique voice and expertise. It learns from your preferences to deliver increasingly relevant suggestions.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
      }} />
    </div>
    {/* FAQ 3 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <h4 className="text-lg md:text-xl font-semibold mb-3 text-white">
        Will my generated content be unique?
      </h4>
      <p className="text-gray-300 text-base">
        Absolutely! Every piece of content is uniquely generated based on your input, professional background, and current trends. No two users will receive identical suggestions.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
      }} />
    </div>
    {/* FAQ 4 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <h4 className="text-lg md:text-xl font-semibold mb-3 text-white">
        Do I need a LinkedIn Premium account?
      </h4>
      <p className="text-gray-300 text-base">
        No, Requill works with any LinkedIn account. However, some advanced features may work better with LinkedIn Premium due to increased messaging and connection limits.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
      }} />
    </div>
    {/* FAQ 5 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <h4 className="text-lg md:text-xl font-semibold mb-3 text-white">
        What languages does Requill support?
      </h4>
      <p className="text-gray-300 text-base">
        Requill supports content generation in over 25 languages, automatically adapting to your LinkedIn profile's primary language and regional preferences.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
      }} />
    </div>
    {/* FAQ 6 */}
    <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
      <h4 className="text-lg md:text-xl font-semibold mb-3 text-white">
        How much does Requill cost?
      </h4>
      <p className="text-gray-300 text-base">
        We offer a free version with basic features and premium plans starting at $9.99/month for unlimited content generation, advanced templates, and priority support.
      </p>
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
        background: "radial-gradient(circle at 65% 70%, #7209b722 0%, transparent 75%)"
      }} />
    </div>
  </div>
</section>

<section className="py-12 px-2 md:px-8">
  <div className="relative max-w-5xl mx-auto rounded-2xl bg-[#181c28]/80 backdrop-blur-md border border-blue-900 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-14 py-10 overflow-hidden group">
    {/* Text */}
    <div className="z-10 flex-1">
      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
        Supercharge your LinkedIn<br />grow your network
      </h2>
      <div className="flex items-center gap-2 mt-2">
        {/* 5 stars */}
        <span className="flex text-yellow-400 text-xl">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <polygon points="10,1.5 12.95,7.18 19.21,7.79 14.11,12.15 15.63,18.31 10,15.1 4.37,18.31 5.89,12.15 0.79,7.79 7.05,7.18" />
            </svg>
          ))}
        </span>
        <span className="text-gray-300 font-medium ml-2">Rated 4.9 on Product Hunt</span>
      </div>
    </div>

    {/* Button */}
    <div className="z-10 flex-1 flex md:justify-end w-full md:w-auto mt-8 md:mt-0">
      <button
        onClick={() => document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' })}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300"
      >
        Get Started
      </button>
    </div>

    {/* Decorative glass angle */}
    <div
      className="pointer-events-none absolute top-0 right-0 h-full w-1/2"
      style={{
        background: "linear-gradient(120deg, transparent 60%, #ffffff09 100%)",
        clipPath: "polygon(100% 0, 100% 100%, 0 100%, 40% 0)"
      }}
    />

    {/* Subtle radial glow */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl"
      style={{
        background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 80%)"
      }}
    />
  </div>
</section>
<footer className="bg-[#111624]/90 border-t border-blue-900 py-10 mt-16">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
    {/* Brand / Logo */}
    <div className="flex flex-col items-center md:items-start gap-2">
      <span className="text-2xl font-bold text-white tracking-tight">
        Requill
      </span>
      <span className="text-gray-400 text-sm">
        Your AI-powered LinkedIn companion
      </span>
    </div>
    {/* Links */}
    <div className="flex flex-wrap gap-8 text-center md:text-left">
      <div>
        <h4 className="font-semibold text-gray-300 mb-2">Product</h4>
        <ul className="space-y-1 text-gray-400 text-sm">
          <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
          <li><a href="/pricing" className="hover:text-blue-400 transition">Pricing</a></li>
          <li><a href="#faq" className="hover:text-blue-400 transition">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-gray-300 mb-2">Company</h4>
        <ul className="space-y-1 text-gray-400 text-sm">
          <li><a href="#about" className="hover:text-blue-400 transition">About</a></li>
          <li><a href="#blog" className="hover:text-blue-400 transition">Blog</a></li>
          <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-gray-300 mb-2">Legal</h4>
        <ul className="space-y-1 text-gray-400 text-sm">
          <li><a href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
          <li><a href="/delivery" className="hover:text-blue-400 transition">Service Delivery</a></li>
          <li><a href="/terms" className="hover:text-blue-400 transition">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    {/* Social Icons */}
    <div className="flex items-center gap-5 mt-6 md:mt-0">
      <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.46 5.9c-.8.36-1.67.61-2.58.72a4.37 4.37 0 0 0 1.92-2.42c-.85.5-1.8.87-2.81 1.07A4.34 4.34 0 0 0 12.06 8c0 .34.04.66.1.97-3.61-.19-6.81-1.91-8.95-4.53a4.44 4.44 0 0 0-.59 2.17c0 1.5.76 2.82 1.92 3.6-.7 0-1.36-.2-1.93-.53v.06c0 2.09 1.48 3.83 3.45 4.23-.36.1-.73.16-1.11.16-.27 0-.53-.03-.78-.07.53 1.64 2.09 2.83 3.92 2.86a8.73 8.73 0 0 1-5.43 1.87c-.35 0-.7-.02-1.04-.06a12.37 12.37 0 0 0 6.69 1.96c8.04 0 12.45-6.66 12.45-12.44 0-.19-.01-.38-.02-.57A8.6 8.6 0 0 0 24 4.56a8.74 8.74 0 0 1-2.54.7z"/>
        </svg>
      </a>
      <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-blue-400 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.67-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.47 9.47 0 0 1 12 6.84c.85.004 1.71.115 2.51.337 1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.58 1.03 2.67 0 3.85-2.34 4.7-4.57 4.95.36.31.68.93.68 1.87 0 1.35-.01 2.44-.01 2.77 0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>
        </svg>
      </a>
      <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.097-.02-2.508-1.529-2.508-1.529 0-1.764 1.193-1.764 2.427v4.685h-3v-9h2.887v1.233h.041c.402-.762 1.379-1.563 2.841-1.563 3.042 0 3.604 2.003 3.604 4.605v4.725z"/>
        </svg>
      </a>
    </div>
  </div>
  <div className="mt-8 text-center text-gray-500 text-sm">
    © {new Date().getFullYear()} Requill. All rights reserved.
  </div>
</footer>

      </main>
    </div>
  );
}