"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from "react";

export default function PricingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 h-screen">
        <p className="text-xl text-foreground/80">Loading...</p>
      </div>
    );
  }

  const plans = {
    free: {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "5 AI-generated posts per month",
        "Basic message templates",
        "Profile optimization suggestions",
        "Limited language support",
        "Email support"
      ],
      buttonText: "Get Started Free",
      popular: false
    },
    pro: {
      name: "Pro",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        "Unlimited AI-generated content",
        "Advanced message personalization",
        "Complete profile optimization",
        "25+ language support",
        "Priority customer support",
        "Analytics and insights",
        "Custom templates",
        "Export content history"
      ],
      buttonText: "Start Pro Trial",
      popular: true
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-center">
          Choose Your <span className="bg-white bg-clip-text text-transparent">Perfect Plan</span>
        </h1>
        <p className="text-lg md:text-xl mb-2 text-center">
          Unlock your LinkedIn potential with our AI-powered tools
        </p>
        <button 
          onClick={() => router.push('/')}
          className="mt-1 px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl shadow-md transition duration-300"
        >
          ← Back to Home
        </button>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Pricing Section */}
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Start free and upgrade when you're ready to supercharge your LinkedIn presence
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-12">
                <span className={`text-lg font-medium mr-3 ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAnnual ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-lg font-medium ml-3 ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                  Annual
                </span>
                {isAnnual && (
                  <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    Save 17%
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plans.free.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-extrabold text-white">$0</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    <p className="text-gray-300">Perfect for getting started</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plans.free.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                  >
                    {plans.free.buttonText}
                  </button>
                </div>

                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
                }} />
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl border border-purple-500 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>

                <div className="relative z-10 pt-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plans.pro.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-extrabold text-white">
                        ${isAnnual ? (plans.pro.annualPrice / 12).toFixed(2) : plans.pro.monthlyPrice}
                      </span>
                      <span className="text-gray-400 ml-1">/month</span>
                      {isAnnual && (
                        <div className="text-sm text-gray-400">
                          Billed annually (${plans.pro.annualPrice}/year)
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300">For serious LinkedIn professionals</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plans.pro.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-bold text-purple-400 mr-3">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {plans.pro.buttonText}
                  </button>
                </div>

                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(circle at 60% 30%, #8b5cf622 0%, transparent 75%)"
                }} />
              </div>
            </div>

            {/* FAQ Section for Pricing */}
            <div className="mt-20 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-white mb-8">Pricing FAQ</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-6 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                  <h4 className="text-lg font-semibold mb-3 text-white">
                    Can I change plans anytime?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at your next billing cycle.
                  </p>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                    background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
                  }} />
                </div>

                <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-6 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                  <h4 className="text-lg font-semibold mb-3 text-white">
                    Is there a free trial for Pro?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Yes! We offer a 7-day free trial for the Pro plan. No credit card required to start your trial.
                  </p>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                    background: "radial-gradient(circle at 60% 40%, #7209b722 0%, transparent 75%)"
                  }} />
                </div>

                <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-6 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                  <h4 className="text-lg font-semibold mb-3 text-white">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for your convenience.
                  </p>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                    background: "radial-gradient(circle at 40% 60%, #4cc9f022 0%, transparent 75%)"
                  }} />
                </div>

                <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-6 transition duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                  <h4 className="text-lg font-semibold mb-3 text-white">
                    Do you offer refunds?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                  </p>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                    background: "radial-gradient(circle at 65% 30%, #4361ee22 0%, transparent 75%)"
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-2 md:px-8">
          <div className="relative max-w-5xl mx-auto rounded-2xl bg-[#181c28]/80 backdrop-blur-md border border-blue-900 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-14 py-10 overflow-hidden group">
            {/* Text */}
            <div className="z-10 flex-1">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Ready to transform<br />your LinkedIn game?
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex text-yellow-400 text-xl">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="10,1.5 12.95,7.18 19.21,7.79 14.11,12.15 15.63,18.31 10,15.1 4.37,18.31 5.89,12.15 0.79,7.79 7.05,7.18" />
                    </svg>
                  ))}
                </span>
                <span className="text-gray-300 font-medium ml-2">Trusted by 10,000+ professionals</span>
              </div>
            </div>

            {/* Button */}
            <div className="z-10 flex-1 flex md:justify-end w-full md:w-auto mt-8 md:mt-0">
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300"
              >
                Start Free Today
              </button>
            </div>

            {/* Decorative elements */}
            <div
              className="pointer-events-none absolute top-0 right-0 h-full w-1/2"
              style={{
                background: "linear-gradient(120deg, transparent 60%, #ffffff09 100%)",
                clipPath: "polygon(100% 0, 100% 100%, 0 100%, 40% 0)"
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 80%)"
              }}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#111624]/90 border-t border-blue-900 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand / Logo */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                LinkedIn AI Assistant
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
                  <li><a href="/#features" className="hover:text-blue-400 transition">Features</a></li>
                  <li><a href="/pricing" className="hover:text-blue-400 transition">Pricing</a></li>
                  <li><a href="/#faq" className="hover:text-blue-400 transition">FAQ</a></li>
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
                  <li><a href="#privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                  <li><a href="#terms" className="hover:text-blue-400 transition">Terms of Service</a></li>
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
            © {new Date().getFullYear()} LinkedIn AI Assistant. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}