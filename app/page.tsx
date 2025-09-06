"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from "react";
import { 
  Mail, ArrowRight, Play, X, Briefcase, Star, FileText, 
  Bookmark, Globe, Zap, Upload, Shield, Lock, EyeOff, 
  Chrome, CheckCircle, Users, Target, Clock
} from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Waitlist state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [activeStep, setActiveStep] = useState(1);

  const handleInstallClick = () => {
    // Replace with your actual Chrome Web Store URL
    window.open('https://chrome.google.com/webstore/detail/linkedin-job-analyzer', '_blank');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">LinkedIn Job Analyzer</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#security" className="text-gray-600 hover:text-blue-600 transition-colors">Security</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
          </nav>
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Install Extension
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Master the Job Hunt with{' '}
                  <span className="text-blue-600">AI-Powered</span>{' '}
                  ATS Analysis
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Analyze LinkedIn job descriptions instantly and get ATS compatibility scores for your resume. Extract key skills, generate comprehensive job insights, and optimize your applications to beat applicant tracking systems—all powered by OpenAI's latest models.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={handleInstallClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    Install Extension
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all flex items-center justify-center gap-2">
                    <Play className="h-5 w-5" />
                    Watch Demo
                  </button>
                </div>

                <div className="flex items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Free to install
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Works with any LinkedIn account
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Chrome Web Store
                  </div>
                </div>
              </div>
              
              {/* Right Demo */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Senior Software Engineer</span>
                        </div>
                        <p className="text-sm text-gray-600">Google • San Francisco, CA • Full-time</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Star className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-900">ATS Score: 85%</span>
                        </div>
                        <p className="text-sm text-gray-600">Excellent match for your profile</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Key Skills Match</span>
                          <span className="font-semibold text-gray-900">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">🎬 See how AI transforms your job application strategy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Job Seekers</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to analyze jobs and optimize your applications for ATS systems.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-lg transition-all">
                <div className="bg-blue-600 p-3 rounded-lg w-fit mb-6">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Smart Job Description Analysis</h4>
                <p className="text-gray-600 mb-6">
                  Navigate to any LinkedIn job posting and get instant AI-powered analysis including job summary, key requirements, skills breakdown, career insights, and targeted application tips.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Comprehensive Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Application Strategy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Time-Saving Intelligence
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-lg transition-all">
                <div className="bg-green-600 p-3 rounded-lg w-fit mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">AI-Powered ATS Score Analysis</h4>
                <p className="text-gray-600 mb-6">
                  Upload your resume and get a detailed ATS compatibility score (0-100%) against any job description. Understand exactly how your resume matches job requirements and what needs improvement.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Precise Scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Keyword Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Actionable Recommendations
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover:shadow-lg transition-all">
                <div className="bg-purple-600 p-3 rounded-lg w-fit mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Resume Analysis</h4>
                <p className="text-gray-600 mb-6">
                  Get detailed feedback on your resume including strengths, weaknesses, experience match assessment, skills gap analysis, and improvement recommendations tailored to each job.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Strengths & Weaknesses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Skills Gap Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Experience Assessment
                  </li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:shadow-lg transition-all">
                <div className="bg-orange-600 p-3 rounded-lg w-fit mb-6">
                  <Bookmark className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Save & Organize Job Applications</h4>
                <p className="text-gray-600 mb-6">
                  Save analyzed jobs to your personal collection with all the AI-generated insights. Keep track of applications, requirements, and optimization notes in one place.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Organized Job Hunt
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Application Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Cloud Sync
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-16">
              <button
                onClick={handleInstallClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started - Install Extension
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works - Three Simple Steps</h3>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="bg-blue-600 p-6 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center">
                    <Globe className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white border-4 border-blue-600 text-blue-600 font-bold text-sm rounded-full w-8 h-8 flex items-center justify-center">
                    1
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Browse LinkedIn Jobs</h4>
                <p className="text-gray-600">Navigate to any LinkedIn job posting that interests you</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="bg-green-600 p-6 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center">
                    <Zap className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white border-4 border-green-600 text-green-600 font-bold text-sm rounded-full w-8 h-8 flex items-center justify-center">
                    2
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Analyze with AI</h4>
                <p className="text-gray-600">Click "Analyze Job" to extract skills, requirements, and insights instantly</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="bg-purple-600 p-6 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center">
                    <Upload className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white border-4 border-purple-600 text-purple-600 font-bold text-sm rounded-full w-8 h-8 flex items-center justify-center">
                    3
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Check ATS Score</h4>
                <p className="text-gray-600">Upload your resume to get compatibility score and optimization recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-50 p-6 rounded-2xl mb-4">
                  <Clock className="h-12 w-12 text-blue-600 mx-auto" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">15+ Minutes</h4>
                <p className="text-gray-600">Saved per job application with instant analysis</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-50 p-6 rounded-2xl mb-4">
                  <Target className="h-12 w-12 text-green-600 mx-auto" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">70%+ Match</h4>
                <p className="text-gray-600">ATS compatibility increases interview chances by 3x</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-50 p-6 rounded-2xl mb-4">
                  <CheckCircle className="h-12 w-12 text-purple-600 mx-auto" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Better Quality</h4>
                <p className="text-gray-600">Specific, actionable recommendations for each job</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-50 p-6 rounded-2xl mb-4">
                  <Users className="h-12 w-12 text-orange-600 mx-auto" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Career Insights</h4>
                <p className="text-gray-600">Market demands and skill requirements analysis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Security And Data Protection</h3>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all">
                <div className="bg-blue-50 p-4 rounded-xl mb-6 w-fit mx-auto">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Local Processing</h4>
                <p className="text-gray-600">
                  Your resume is processed locally in your browser and securely transmitted to our AI service. No data is stored permanently on our servers.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all">
                <div className="bg-green-50 p-4 rounded-xl mb-6 w-fit mx-auto">
                  <Lock className="h-12 w-12 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Encrypted Analysis</h4>
                <p className="text-gray-600">
                  All communications with our AI service use enterprise-grade encryption. Your personal information never leaves secure channels.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all">
                <div className="bg-purple-50 p-4 rounded-xl mb-6 w-fit mx-auto">
                  <EyeOff className="h-12 w-12 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">No Data Retention</h4>
                <p className="text-gray-600">
                  Resume content is analyzed in real-time and not stored. Only anonymized analysis results are temporarily cached for performance.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all">
                <div className="bg-orange-50 p-4 rounded-xl mb-6 w-fit mx-auto">
                  <Chrome className="h-12 w-12 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Browser Extension Security</h4>
                <p className="text-gray-600">
                  Built with Chrome's Manifest V3 security standards. Limited permissions only for LinkedIn job pages with no access to personal browsing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            </div>
            
            <div className="grid gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">How accurate are the ATS compatibility scores?</h4>
                <p className="text-gray-600">
                  Our AI analyzes over 20 factors including keyword matching, experience relevance, skills coverage, and formatting. Scores are based on real ATS system criteria and have been validated against actual hiring outcomes. While no system is 100% perfect, our analysis provides highly reliable guidance for optimization.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">What file formats are supported for resume upload?</h4>
                <p className="text-gray-600">
                  Currently, we support PDF files only. Your PDF must have selectable text (not scanned images) and be under 10MB. We recommend using "Print to PDF" from your word processor for best results.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Does the extension work on all LinkedIn job postings?</h4>
                <p className="text-gray-600">
                  Yes, our extension works on all LinkedIn job postings. It automatically detects when you're on a job page and enables the analysis features. You can also manually enter job descriptions for analysis if needed.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Is my resume data secure and private?</h4>
                <p className="text-gray-600">
                  Absolutely. Your resume is processed securely and never stored permanently. We use enterprise-grade encryption and follow strict data privacy standards. Your personal information is protected at all times.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Can I save my job analyses for later reference?</h4>
                <p className="text-gray-600">
                  Yes! You can save analyzed jobs to your personal collection. This includes all the AI insights, ATS scores, and your notes. Saved jobs are stored securely and can be accessed anytime through the extension.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">How does the AI analysis compare to human recruiters?</h4>
                <p className="text-gray-600">
                  Our AI is trained on thousands of job descriptions and hiring patterns. It provides consistent, objective analysis that many users find more comprehensive than initial human screening. However, it's designed to complement, not replace, human judgment in the hiring process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Job Hunt?</h3>
            <p className="text-xl mb-4 text-blue-100">
              Join thousands of job seekers using AI to land their dream jobs faster
            </p>
            <p className="text-lg mb-8 text-blue-200">
              Install our Chrome extension and start analyzing LinkedIn jobs with AI-powered insights today. Your next career move is just one click away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Install Extension - It's Free
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-lg text-lg transition-all flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                Watch Demo Video
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 mb-8">
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">LinkedIn Job Description Analyzer</h4>
                </div>
                <p className="text-gray-400">AI-powered job hunting made simple</p>
              </div>

              {/* Product */}
              <div>
                <h5 className="font-bold text-white mb-4">Product</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h5 className="font-bold text-white mb-4">Resources</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Job Search Tips</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ATS Optimization Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Career Advice Blog</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h5 className="font-bold text-white mb-4">Support</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Report Bug</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Feature Request</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Data Protection</a>
              </div>
              <p className="text-gray-500">© {new Date().getFullYear()} LinkedIn Job Description Analyzer. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}