"use client";

import { useRouter } from 'next/navigation';
import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ServiceDeliveryPage() {
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
                Service Delivery{' '}
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

        {/* Service Delivery Policy Content */}
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
                  This policy explains how the Requill service is delivered to you after you sign up or purchase a subscription.
                </p>
              </div>
            </div>

            {/* Service Delivery */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Service Delivery</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed mb-4">
                    Requill is a digital product and is delivered electronically. There are no physical goods to be shipped, 
                    and therefore, no shipping charges.
                  </p>
                </div>
              </div>
            </div>

            {/* How to Access the Service */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">How to Access the Service</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Once you have successfully created an account or completed a subscription purchase, you can access the service by:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3 text-lg">1.</span>
                      <div>
                        <p className="font-semibold text-blue-300 mb-2">Installing the Extension:</p>
                        <p className="leading-relaxed">
                          If you haven't already, you can install the Requill browser extension from the official web store 
                          for your browser (e.g., Chrome Web Store, Firefox Add-ons).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3 text-lg">2.</span>
                      <div>
                        <p className="font-semibold text-blue-300 mb-2">Logging In:</p>
                        <p className="leading-relaxed">
                          After installation, log in to the extension with your account credentials.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl backdrop-blur-sm">
                    <p className="text-blue-300 font-medium leading-relaxed">
                      Your access to the premium features will be enabled immediately upon confirmation of your subscription payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Confirmation</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    You will receive an email confirmation shortly after you sign up or subscribe, which will include details 
                    of your subscription and instructions on how to get started.
                  </p>
                </div>
              </div>
            </div>

            {/* Issues with Access */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Issues with Access</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    If you encounter any issues accessing the service after your subscription has been confirmed, please contact 
                    our support team for assistance.
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
                    If you have any questions about accessing or using Requill, please contact us at:
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