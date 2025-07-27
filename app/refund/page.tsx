"use client";

import { useRouter } from 'next/navigation';
import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
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
                Cancellation &{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Refund Policy
                </span>
              </h2>
              
              <div className="text-center mb-8">
                <p className="text-lg text-gray-300">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
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
                  At Requill, we want you to be completely satisfied with your subscription. This Cancellation and Refund Policy 
                  explains your rights regarding cancellations, refunds, and how we handle subscription management to ensure 
                  a transparent and fair experience.
                </p>
              </div>
            </div>

            {/* Subscription Plans Overview */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Subscription Plans Overview</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Requill operates on a usage-based model with the following plans:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Free Usage:</strong> 10 AI generations per account - No payment required</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Pro Plan:</strong> $9.99/month - Unlimited AI generations with performance cap of 1,000 usages per month</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Enterprise Plan:</strong> $29.99/month - Higher performance limits for teams and educational institutions</p>
                    </div>
                  </div>
                  <p className="leading-relaxed">
                    Once you exhaust your 10 free usages, you must upgrade to a paid plan to continue using the service. 
                    All paid subscriptions automatically renew unless cancelled before the next billing cycle.
                  </p>
                </div>
              </div>
            </div>

            {/* Free Usage Period */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Free Usage Allowance</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Every new user receives 10 free AI generations to try our service:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>10 Free Generations:</strong> Complete access to AI features for your first 10 uses</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>No Time Limit:</strong> Use your 10 free generations at your own pace</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Usage Tracking:</strong> Your remaining free usages are displayed in your dashboard</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Upgrade Required:</strong> Must subscribe to Pro Plan after exhausting free usages</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-600">
                    <p className="text-sm text-yellow-200">
                      <strong>Note:</strong> Free usages are per account and cannot be reset or extended.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Cancellation Policy</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">How to Cancel</h4>
                    <p className="leading-relaxed mb-3">
                      You can cancel your subscription at any time through your account dashboard or by contacting our support team:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">1.</span>
                        <p><strong>Dashboard:</strong> Go to Account Settings → Subscription → Cancel Subscription</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">2.</span>
                        <p><strong>Email:</strong> Send cancellation request to support@executivesai.pro</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">3.</span>
                        <p><strong>Contact Form:</strong> Submit cancellation request through our contact page</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">When Cancellation Takes Effect</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-bold text-purple-400 mr-3">•</span>
                        <p><strong>End of Billing Cycle:</strong> Access continues until current subscription period ends</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-purple-400 mr-3">•</span>
                        <p><strong>No Partial Refunds:</strong> Full month's payment applies regardless of usage or cancellation date</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-purple-400 mr-3">•</span>
                        <p><strong>Data Retention:</strong> Your data is preserved for 30 days after cancellation</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-purple-400 mr-3">•</span>
                        <p><strong>Free Plan Return:</strong> Account reverts to free plan (no additional usages) after cancellation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Refund Policy</h3>
                <div className="space-y-4 text-gray-300">
                  <div className="p-4 bg-red-900/30 rounded-lg border border-red-600 mb-6">
                    <h4 className="text-lg font-semibold text-red-300 mb-2">No Refunds Policy</h4>
                    <p className="leading-relaxed text-red-200">
                      <strong>All payments are final and non-refundable.</strong> Since we provide 10 free AI generations 
                      for every user to test our service before payment, all purchases are considered final once completed.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-orange-300 mb-2">Exceptional Circumstances</h4>
                    <p className="leading-relaxed mb-3">
                      We may consider refunds only in exceptional circumstances at our sole discretion:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-bold text-orange-400 mr-3">•</span>
                        <p><strong>Technical Issues:</strong> Service completely unavailable for more than 7 consecutive days</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-orange-400 mr-3">•</span>
                        <p><strong>Billing Errors:</strong> Duplicate charges or incorrect billing amounts</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-orange-400 mr-3">•</span>
                        <p><strong>Account Compromise:</strong> Unauthorized access resulting in unwanted charges</p>
                      </div>
                    </div>
                    <p className="leading-relaxed mt-3 text-sm text-gray-400">
                      All refund requests for exceptional circumstances are evaluated case-by-case and require supporting documentation.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Why No Refunds?</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">•</span>
                        <p><strong>Free Trial Period:</strong> 10 free AI generations allow full service evaluation</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">•</span>
                        <p><strong>Immediate Value:</strong> Service is consumed immediately upon use</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">•</span>
                        <p><strong>Clear Pricing:</strong> All costs and limitations are clearly displayed before purchase</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-blue-400 mr-3">•</span>
                        <p><strong>Digital Service:</strong> Cannot be "returned" once AI processing is completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage-Based Billing */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 70%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Usage-Based Billing & Performance Limits</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Our Pro Plan operates on a usage-based model with performance caps to ensure fair usage:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Monthly Usage Cap:</strong> 1,000 AI generations per month for Pro Plan subscribers</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Reset Schedule:</strong> Usage counter resets on the first day of each billing cycle</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Over-Usage:</strong> Service temporarily unavailable if monthly limit is exceeded</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Enterprise Options:</strong> Contact us for higher limits or custom enterprise plans</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600">
                    <p className="text-sm text-blue-200">
                      <strong>Fair Usage:</strong> Performance caps ensure reliable service for all users and prevent system abuse.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Downgrade Policy */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Downgrade Policy</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    You can downgrade your subscription, but note our no-refund policy:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Pro to Free:</strong> Downgrade takes effect at the end of current billing cycle (no refund)</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Enterprise to Pro:</strong> Billing adjusts at next cycle, no partial refunds</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Usage Reset:</strong> After downgrade to free, no additional free usages are provided</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Data Preservation:</strong> All data retained for 30 days, then permanently deleted</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Re-upgrade:</strong> Can upgrade again at any time with immediate access</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-600">
                    <p className="text-sm text-yellow-200">
                      <strong>Important:</strong> Downgrading to free plan after exhausting initial 10 free usages means no additional free usage will be available.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Issues */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Payment Issues & Failed Payments</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Failed Payment Process</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="font-bold text-yellow-400 mr-3">1.</span>
                        <p><strong>Day 1:</strong> First failed payment attempt, email notification sent</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-yellow-400 mr-3">2.</span>
                        <p><strong>Day 3:</strong> Second attempt, access to paid features suspended</p>
                      </div>
                      <div className="flex items-start">
                        <span className="font-bold text-yellow-400 mr-3">3.</span>
                        <p><strong>Day 7:</strong> Final attempt, account downgraded to free plan if unsuccessful</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Resolving Payment Issues</h4>
                    <p className="leading-relaxed">
                      Update your payment method in your account dashboard or contact support for assistance. 
                      Access is restored immediately upon successful payment.
                    </p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Contact Us for Cancellations & Refunds</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed mb-4">
                    If you need assistance with cancellations, refunds, or have questions about this policy, please contact us:
                  </p>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-300 mb-2">
                      <strong>Email:</strong> support@executivesai.pro
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      <strong>Subject Line:</strong> Include "Cancellation" or "Refund Request" for faster processing
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Response Time:</strong> We respond to all cancellation and refund requests within 24 hours
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-600">
                    <p className="text-sm text-blue-200 text-center">
                      <strong>Required Information:</strong> Please include your email address, subscription plan, 
                      and reason for cancellation/refund to expedite processing.
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
                Your AI-powered study companion
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