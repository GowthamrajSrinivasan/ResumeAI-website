"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Mail, User, Phone, MessageSquare, Send } from "lucide-react";
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactUsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [firestoreUserData, setFirestoreUserData] = useState<any>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Fetch user data from Firestore and auto-fill form
  useEffect(() => {
    const fetchUserDataAndFillForm = async () => {
      if (user?.uid) {
        setIsLoadingUserData(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirestoreUserData(userData);
            
            // Auto-fill form with Firestore data
            setFormData(prev => ({
              ...prev,
              email: userData.userEmail || user.email || prev.email,
              name: userData.userDetails?.displayName || user.displayName || prev.name
            }));
            
            console.log('✅ User data loaded from Firestore:', {
              email: userData.userEmail,
              displayName: userData.userDetails?.displayName
            });
          } else {
            console.log('ℹ️ No user document found in Firestore, using Firebase Auth data');
            // Fallback to Firebase Auth data
            setFormData(prev => ({
              ...prev,
              email: user.email || prev.email,
              name: user.displayName || prev.name
            }));
          }
        } catch (error) {
          console.error('❌ Error fetching user data from Firestore:', error);
          // Fallback to Firebase Auth data on error
          setFormData(prev => ({
            ...prev,
            email: user.email || prev.email,
            name: user.displayName || prev.name
          }));
        } finally {
          setIsLoadingUserData(false);
        }
      }
    };

    fetchUserDataAndFillForm();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare submission data with user ID if authenticated
      const submissionData = {
        ...formData,
        userId: user?.uid || null
      };

      const response = await fetch(FIREBASE_FUNCTIONS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Contact form submitted successfully:', result.submissionId);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const errorData = await response.json();
        console.error('❌ Contact form submission failed:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Contact{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Us
                </span>
              </h2>
              
              <div className="text-center mb-8">
                <p className="text-lg text-gray-300 mb-2">
                  We'd love to hear from you
                </p>
                <p className="text-sm text-gray-400">
                  Email us directly at: <span className="text-blue-400 font-semibold">support@executivesai.pro</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Contact Form */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Send us a message</h3>
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded-lg text-green-300">
                    <p className="text-center">Thank you for your message! We'll get back to you soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-300">
                    <p className="text-center">Sorry, there was an error sending your message. Please try again or email us directly.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name * {isLoadingUserData ? (
                        <span className="text-xs text-gray-400 ml-2">(loading...)</span>
                      ) : (firestoreUserData?.userDetails?.displayName || (user && user.displayName)) ? (
                        <span className="text-xs text-green-400 ml-2">(from your profile)</span>
                      ) : null}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoadingUserData}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 ${
                          isLoadingUserData ? 'bg-[#141824] opacity-70' : 'bg-[#1a1f2e]'
                        }`}
                        placeholder={isLoadingUserData ? "Loading..." : "Enter your full name"}
                      />
                      {isLoadingUserData && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Sparkles className="h-4 w-4 text-blue-400 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address * {isLoadingUserData ? (
                        <span className="text-xs text-gray-400 ml-2">(loading...)</span>
                      ) : (firestoreUserData?.userEmail || (user && user.email)) ? (
                        <span className="text-xs text-green-400 ml-2">(from your profile)</span>
                      ) : null}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        readOnly={!!(firestoreUserData?.userEmail || (user && user.email))}
                        disabled={isLoadingUserData}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 ${
                          isLoadingUserData 
                            ? 'bg-[#141824] opacity-70'
                            : (firestoreUserData?.userEmail || (user && user.email))
                              ? 'bg-[#141824] cursor-not-allowed opacity-90' 
                              : 'bg-[#1a1f2e]'
                        }`}
                        placeholder={isLoadingUserData ? "Loading..." : "Enter your email address"}
                        title={
                          isLoadingUserData 
                            ? "Loading user data..." 
                            : (firestoreUserData?.userEmail || (user && user.email))
                              ? "Email address from your profile (read-only)" 
                              : "Enter your email address"
                        }
                      />
                      {isLoadingUserData ? (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Sparkles className="h-4 w-4 text-blue-400 animate-spin" />
                        </div>
                      ) : (firestoreUserData?.userEmail || (user && user.email)) ? (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Phone Field (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="h-5 w-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mt-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 70%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Get in Touch</h3>
                <div className="text-center space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Email Support</h4>
                    <p className="text-gray-300">
                      For general inquiries, support, or feedback, reach out to us at:
                    </p>
                    <p className="text-xl font-semibold text-blue-400 mt-2">
                      support@executivesai.pro
                    </p>
                  </div>
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Response Time</h4>
                    <p className="text-gray-300">
                      We typically respond to all inquiries within 24 hours during business days.
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