"use client";

import { useRouter } from 'next/navigation';
import React from "react";
import { Briefcase, ArrowLeft, Target, BarChart, Search, ShieldCheck, Zap, Lightbulb, TrendingUp, Lock, Award } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-white" />
          <h1 className="text-xl font-extrabold">Fit2Hire</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="py-20 md:py-28 flex items-center justify-center px-4">
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-10 md:p-14 w-full max-w-4xl mx-auto transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
              }}
            />
            <div className="relative z-10">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-lg text-center">
                About{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Fit2Hire
                </span>
              </h2>

              <div className="text-center mb-8">
                <p className="text-xl text-gray-300">
                  Your AI-Powered Job Application Assistant
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Fit2Hire Does */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">What Fit2Hire Does</h3>
                <p className="text-gray-300 leading-relaxed text-center mb-6">
                  Fit2Hire is a Chrome extension that transforms how you approach job applications by providing AI-powered analysis of job postings across major job platforms.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Instant Job Analysis */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
                }} />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-blue-400 mr-3" />
                    <h4 className="text-xl font-bold text-white">🎯 Instant Job Analysis</h4>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>Smart Extraction:</strong> Automatically detects and extracts complete job information (title, company, location, requirements, skills) from LinkedIn, Indeed, Glassdoor, Naukri, and 10+ other job sites</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>AI-Powered Insights:</strong> Uses OpenAI's latest models to analyze job descriptions and provide comprehensive breakdowns</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-blue-400 mr-3">•</span>
                      <p><strong>One-Click Analysis:</strong> Simply navigate to any job posting and click "Analyze Job" for instant insights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATS Compatibility Scoring */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
                }} />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <BarChart className="h-8 w-8 text-purple-400 mr-3" />
                    <h4 className="text-xl font-bold text-white">📊 ATS Compatibility Scoring</h4>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Resume Matching:</strong> Upload your resume to get a precise ATS compatibility score (0-100%) against any job description</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Keyword Analysis:</strong> Identifies which keywords you have, which are missing, and their importance</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-purple-400 mr-3">•</span>
                      <p><strong>Optimization Recommendations:</strong> Provides specific, actionable suggestions to improve your resume's ATS performance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Resume Analysis */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
                }} />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <Search className="h-8 w-8 text-green-400 mr-3" />
                    <h4 className="text-xl font-bold text-white">🔍 Comprehensive Resume Analysis</h4>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Strengths & Weaknesses:</strong> Detailed feedback on what's working and what needs improvement</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Skills Gap Analysis:</strong> Shows which skills to highlight or develop for better job fit</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-green-400 mr-3">•</span>
                      <p><strong>Experience Assessment:</strong> Evaluates how well your background aligns with job requirements</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Collection & Management */}
              <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
                }} />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <ShieldCheck className="h-8 w-8 text-pink-400 mr-3" />
                    <h4 className="text-xl font-bold text-white">💾 Job Collection & Management</h4>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start">
                      <span className="font-bold text-pink-400 mr-3">•</span>
                      <p><strong>Smart Saving:</strong> Save analyzed jobs with all AI-generated insights for future reference</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-pink-400 mr-3">•</span>
                      <p><strong>Application Tracking:</strong> Keep track of your applications and optimization notes</p>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-pink-400 mr-3">•</span>
                      <p><strong>Cross-Platform Support:</strong> Works on LinkedIn, Indeed, Glassdoor, Monster, Naukri, and more</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Users Should Install It */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Users Should Install It</h3>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Save Time & Effort */}
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <Zap className="h-6 w-6 text-yellow-400 mr-3" />
                      <h4 className="text-lg font-semibold text-yellow-300">⚡ Save Time & Effort</h4>
                    </div>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• <strong>Instant Analysis:</strong> Get comprehensive job insights in seconds instead of spending minutes manually analyzing</p>
                      <p>• <strong>Automated Extraction:</strong> No more copy-pasting job descriptions or manually identifying requirements</p>
                      <p>• <strong>Batch Processing:</strong> Analyze multiple jobs quickly during your job search</p>
                    </div>
                  </div>

                  {/* Beat the ATS System */}
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <Target className="h-6 w-6 text-red-400 mr-3" />
                      <h4 className="text-lg font-semibold text-red-300">🎯 Beat the ATS System</h4>
                    </div>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• <strong>ATS Optimization:</strong> 75% of resumes are filtered out by ATS systems - this extension helps you get through</p>
                      <p>• <strong>Keyword Intelligence:</strong> Know exactly which keywords to include for better ATS ranking</p>
                      <p>• <strong>Score-Based Improvements:</strong> Get measurable feedback (0-100%) on your resume's compatibility</p>
                    </div>
                  </div>

                  {/* Make Smarter Applications */}
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <Lightbulb className="h-6 w-6 text-blue-400 mr-3" />
                      <h4 className="text-lg font-semibold text-blue-300">💡 Make Smarter Applications</h4>
                    </div>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• <strong>Strategic Insights:</strong> Understand job requirements beyond surface-level descriptions</p>
                      <p>• <strong>Tailored Applications:</strong> Get specific tips for customizing your resume and cover letter</p>
                      <p>• <strong>Career Intelligence:</strong> Discover skills and qualifications that boost your profile</p>
                    </div>
                  </div>

                  {/* Competitive Advantage */}
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="h-6 w-6 text-green-400 mr-3" />
                      <h4 className="text-lg font-semibold text-green-300">🚀 Competitive Advantage</h4>
                    </div>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• <strong>AI-Powered Edge:</strong> Use the same technology that top recruiters and hiring managers rely on</p>
                      <p>• <strong>Data-Driven Decisions:</strong> Make informed choices about which jobs to pursue</p>
                      <p>• <strong>Professional Growth:</strong> Learn what skills and experiences are most valued in your field</p>
                    </div>
                  </div>

                  {/* Secure & Private */}
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <Lock className="h-6 w-6 text-purple-400 mr-3" />
                      <h4 className="text-lg font-semibold text-purple-300">🔒 Secure & Private</h4>
                    </div>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• <strong>Privacy-First:</strong> Your resume and data are processed securely with enterprise-grade encryption</p>
                      <p>• <strong>No Data Storage:</strong> Personal information isn't permanently stored or shared</p>
                      <p>• <strong>Open Source:</strong> Transparent about how your data is handled</p>
                    </div>
                  </div>

                  {/* Proven Results */}
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <Award className="h-6 w-6 text-orange-400 mr-3" />
                      <h4 className="text-lg font-semibold text-orange-300">📈 Proven Results</h4>
                    </div>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>Perfect for job seekers who want to:</p>
                      <p>• Increase their interview callback rate</p>
                      <p>• Optimize resumes for specific job postings</p>
                      <p>• Save time during job search</p>
                      <p>• Understand market requirements better</p>
                      <p>• Get past ATS filters more effectively</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 50%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Bottom Line</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Fit2Hire turns job hunting from guesswork into a data-driven strategy, helping you land interviews faster by understanding exactly what employers want and how well you match their requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#111624]/90 border-t border-blue-900 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                Fit2Hire
              </span>
              <span className="text-gray-400 text-sm">
                Your AI-powered job application assistant
              </span>
            </div>
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
            © {new Date().getFullYear()} Fit2Hire. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}