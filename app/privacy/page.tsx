"use client";

import { useRouter } from 'next/navigation';
import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-xl font-extrabold">Requill</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="py-20 md:py-28 flex items-center justify-center px-4">
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-10 md:p-14 w-full max-w-4xl mx-auto transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
            {/* Subtle radial glow for depth */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
              }}
            />
            <div className="relative z-10">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-lg text-center">
                Privacy{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Policy
                </span>
              </h2>
              
              <div className="text-center mb-8">
                <p className="text-lg text-gray-300">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Introduction</h3>
                <p className="text-gray-300 leading-relaxed">
                  At Requill, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                  AI-powered LinkedIn companion service.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Information We Collect</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Account Information</h4>
                    <p className="leading-relaxed">
                      When you create an account, we collect your email address, name, and authentication credentials 
                      through Firebase Authentication.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Usage Data</h4>
                    <p className="leading-relaxed">
                      We collect information about how you interact with our service, including features used, 
                      content generated, and usage patterns to improve our AI algorithms.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Browser Extension Data</h4>
                    <p className="leading-relaxed">
                      Our Chrome extension stores authentication tokens locally to provide seamless LinkedIn integration. 
                      This data remains on your device and is used only for authentication purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <span className="font-bold text-blue-400 mr-3">•</span>
                    <p>Provide and maintain our AI-powered content generation service</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-blue-400 mr-3">•</span>
                    <p>Personalize content suggestions based on your professional profile</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-blue-400 mr-3">•</span>
                    <p>Improve our AI algorithms and service quality</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-blue-400 mr-3">•</span>
                    <p>Communicate with you about service updates and support</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-blue-400 mr-3">•</span>
                    <p>Ensure security and prevent fraudulent activity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Data Security & Storage</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    We implement industry-standard security measures to protect your data:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">🔒</span>
                      <div>
                        <p className="font-semibold">Encryption</p>
                        <p className="text-gray-400">All data is encrypted in transit and at rest using Firebase security</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">🏠</span>
                      <div>
                        <p className="font-semibold">Local-First Approach</p>
                        <p className="text-gray-400">Authentication tokens are stored locally on your device</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">⏰</span>
                      <div>
                        <p className="font-semibold">Token Expiry</p>
                        <p className="text-gray-400">Authentication tokens expire automatically after 1 hour</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Your Rights</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start">
                    <span className="font-bold text-green-400 mr-3">✓</span>
                    <p><strong>Data Ownership:</strong> Your data belongs to you and you have full control over it</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-green-400 mr-3">✓</span>
                    <p><strong>Data Portability:</strong> Export all your data anytime in Markdown format</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-green-400 mr-3">✓</span>
                    <p><strong>Account Deletion:</strong> Delete your account and all associated data at any time</p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-green-400 mr-3">✓</span>
                    <p><strong>Data Access:</strong> Request a copy of all data we have about you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LinkedIn Integration */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 70%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">LinkedIn Integration</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Requill operates as a browser extension that assists with LinkedIn content creation. We want to be 
                    transparent about our LinkedIn integration:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p>We do not access your LinkedIn credentials or login information</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p>We do not store or read your LinkedIn messages or connections</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p>We follow all LinkedIn terms of service and best practices</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p>All content generation happens locally in your browser</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 50%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@requill.com</p>
                    <p><strong>Support:</strong> support@requill.com</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    We will respond to all privacy-related inquiries within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
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
                  <li><a href="/#features" className="hover:text-blue-400 transition">Features</a></li>
                  <li><a href="/pricing" className="hover:text-blue-400 transition">Pricing</a></li>
                  <li><a href="/#faq" className="hover:text-blue-400 transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Legal</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><a href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
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