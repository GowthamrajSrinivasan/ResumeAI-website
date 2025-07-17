"use client";

import { useRouter } from 'next/navigation';
import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
                Terms of{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Service
                </span>
              </h2>
              
              <div className="text-center mb-8">
                <p className="text-lg text-gray-300">
                  Last updated: July 17, 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms of Service Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Introduction</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Requill browser 
                    extension (the "Service") operated by ExecutivesAI ("us", "we", or "our").
                  </p>
                  <p className="leading-relaxed">
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
                    These Terms apply to all visitors, users and others who access or use the Service.
                  </p>
                  <p className="leading-relaxed">
                    By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of 
                    the terms then you may not access the Service.
                  </p>
                </div>
              </div>
            </div>

            {/* 1. License */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">1. License</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    We grant you a revocable, non-exclusive, non-transferable, limited license to download, install and use the 
                    extension solely for your personal, non-commercial purposes strictly in accordance with the terms of this Agreement.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Restrictions */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">2. Restrictions</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    You agree not to, and you will not permit others to:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">a)</span>
                      <p className="leading-relaxed">
                        license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise 
                        commercially exploit the extension or make the extension available to any third party.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">b)</span>
                      <p className="leading-relaxed">
                        modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any 
                        part of the extension.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">c)</span>
                      <p className="leading-relaxed">
                        remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) 
                        of ours or our affiliates, partners, suppliers or the licensors of the extension.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Your Suggestions */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">3. Your Suggestions</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    Any feedback, comments, ideas, improvements or suggestions (collectively, "Suggestions") provided by you to us 
                    with respect to the extension shall remain our sole and exclusive property. We shall be free to use, copy, modify, 
                    publish, or redistribute the Suggestions for any purpose and in any way without any credit or any compensation to you.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Modifications to Extension */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">4. Modifications to Extension</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    We reserve the right to modify, suspend or discontinue, temporarily or permanently, the extension or any service 
                    to which it connects, with or without notice and without liability to you.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Term and Termination */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 70%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">5. Term and Termination</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    These Terms of Service shall remain in effect until terminated by you or us. We may, in our sole discretion, 
                    at any time and for any or no reason, suspend or terminate these Terms of Service with or without prior notice.
                  </p>
                  <p className="leading-relaxed">
                    These Terms of Service will terminate immediately, without prior notice from us, in the event that you fail to 
                    comply with any provision of these Terms of Service. You may also terminate these Terms of Service by deleting 
                    the extension and all copies thereof from your computer.
                  </p>
                  <p className="leading-relaxed">
                    Upon termination of these Terms of Service, you shall cease all use of the extension and delete all copies of 
                    the extension from your computer.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Disclaimer of Warranties */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">6. Disclaimer of Warranties</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    The extension is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty 
                    of any kind. To the maximum extent permitted under applicable law, we, on our own behalf and on behalf of our 
                    affiliates and our and their respective licensors and service providers, expressly disclaim all warranties, whether 
                    express, implied, statutory or otherwise, with respect to the extension, including all implied warranties of 
                    merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out 
                    of course of dealing, course of performance, usage or trade practice.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Limitation of Liability */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    To the maximum extent permitted by applicable law, in no event shall we or our suppliers be liable for any special, 
                    incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, 
                    for loss of data or other information, for business interruption, for personal injury, for loss of privacy arising out 
                    of or in any way related to the use of or inability to use the extension, third-party software and/or third-party 
                    hardware used with the extension, or otherwise in connection with any provision of this Agreement), even if we or any 
                    supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
                  </p>
                </div>
              </div>
            </div>

            {/* 8. Governing Law */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">8. Governing Law</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    The laws of the United States, excluding its conflicts of law rules, shall govern this Agreement and your use of 
                    the extension. Your use of the extension may also be subject to other local, state, national, or international laws.
                  </p>
                </div>
              </div>
            </div>

            {/* 9. Changes to This Agreement */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">9. Changes to This Agreement</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    We reserve the right, at our sole discretion, to modify or replace this Agreement at any time. If a revision is 
                    material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material 
                    change will be determined at our sole discretion.
                  </p>
                  <p className="leading-relaxed">
                    By continuing to access or use our extension after any revisions become effective, you agree to be bound by the 
                    revised terms. If you do not agree to the new terms, you are no longer authorized to use the extension.
                  </p>
                </div>
              </div>
            </div>

            {/* 10. Contact Us */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 50%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">10. Contact Us</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed mb-4">
                    If you have any questions about these Terms of Service, you can contact us:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p>By email: <strong className="text-blue-300">support@executivesai.com</strong></p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p>By visiting our website contact page</p>
                    </div>
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
                  <li><a href="/service-delivery" className="hover:text-blue-400 transition">Service Delivery</a></li>
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