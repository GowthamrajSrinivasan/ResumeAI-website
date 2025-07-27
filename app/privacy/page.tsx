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
                  Last updated: July 13, 2025
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
                  We believe your data should always be secure, private, and fully under your control. This Privacy Policy 
                  outlines how we safeguard your information when you use our Service.
                </p>
              </div>
            </div>

            {/* Information Collection and Use */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Information Collection and Use</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Requill is designed to help you interact with content on LinkedIn in new ways. Our goal is to provide 
                    a useful service, not to extract value from your data. We do not use your data for advertising, profiling, 
                    or training any third-party AI models beyond what is necessary to provide the service.
                  </p>
                  <p className="leading-relaxed">
                    When you use the extension, we collect the text content from LinkedIn posts that you choose to process. 
                    This data is sent to our secure cloud service to be analyzed by an AI model (powered by OpenAI) to generate 
                    the results displayed to you in the side panel.
                  </p>
                  <p className="leading-relaxed">
                    We may collect personally identifiable information such as your email address only if you voluntarily 
                    provide it for account access or support and to communicate important updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Log Data */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Log Data</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    When you use the Service, we may collect standard diagnostic information—called Log Data. This can include 
                    details like your IP address, browser type, and version to help us diagnose and fix issues with the service.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Cookies</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    Our service does not use cookies, as it operates as a browser extension. However, we do use the browser's 
                    local storage to save your settings and preferences to improve your experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Providers */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Service Providers</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    We use trusted third-party services to support our operations:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Google Cloud Platform:</strong> Hosts our backend services that process the data.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>OpenAI:</strong> Provides the AI models used for analyzing the text content.</p>
                    </div>
                  </div>
                  <p className="leading-relaxed">
                    We may also use services for analytics and error tracking to improve our product.
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Security</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    We take data security seriously. We use industry-standard security practices to protect your Personal Information, 
                    both in transit and at rest. However, no system is 100% secure, so we encourage users to also take steps to 
                    safeguard their credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Ownership & Portability */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 70%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Data Ownership & Portability</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Data Ownership</h4>
                    <p className="leading-relaxed">
                      You own your data. Full stop. We do not access or use your content for any reason other than delivering 
                      the features of the Service. You can access or delete your data at any time.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Data Portability</h4>
                    <p className="leading-relaxed">
                      Your data should move with you. We support exporting your saved content so you always retain control.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights (GDPR, CCPA, and similar laws) */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Your Rights (GDPR, CCPA, and similar laws)</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Depending on your location, you may have rights under applicable data protection laws, such as:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right to access</strong> – You can request a copy of the personal data we hold about you.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right to rectification</strong> – You can ask us to correct inaccurate or incomplete data.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right to erasure ("Right to be forgotten")</strong> – You can request that we delete your data.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right to data portability</strong> – You can export your data in a machine-readable format.</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right to object</strong> – You can object to certain types of processing, like marketing or profiling (we don't do this anyway).</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right not to be subject to automated decision-making</strong> (we don't do this anyway).</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Right to opt-out of the sale of personal data</strong> (we don't sell data).</p>
                    </div>
                  </div>
                  <p className="leading-relaxed">
                    To exercise any of these rights, email us at <strong>support@executivesai.com</strong>. We'll respond within 30 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Links to Other Sites */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 70%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Links to Other Sites</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    Our Service operates on LinkedIn and may interact with links to external sites. We do not control and are not 
                    responsible for the privacy practices or content of those other sites. We encourage you to review their privacy 
                    policies if you visit them.
                  </p>
                </div>
              </div>
            </div>

            {/* Changes to This Privacy Policy */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    We may update this Privacy Policy periodically. We will notify users of any significant changes by posting 
                    the new policy within the extension or on our website. Changes are effective immediately once published.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Us */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 50%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed mb-4">
                    If you have any questions, concerns, or requests related to your data or this Privacy Policy, please contact us at:
                  </p>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-300">
                      <strong>support@executivesai.com</strong>
                    </p>
                  </div>
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
                  <li><a href="/refund" className="hover:text-blue-400 transition">Refund Policy</a></li>
                  <li><a href="/contact" className="hover:text-blue-400 transition">Contact Us</a></li>
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