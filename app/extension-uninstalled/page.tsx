'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ExtensionUninstalled() {
  const [countdown, setCountdown] = useState(5);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Log the uninstall event
    console.log('📊 User reached extension uninstall page');
    
    // Log page visit to Firestore
    addDoc(collection(db, 'extension_uninstalls'), {
      event: 'extension_uninstall_page_visit',
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      source: 'uninstall_redirect_page'
    }).catch(error => {
      console.error('Failed to track uninstall page visit:', error);
    });

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const submitFeedback = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'extension_feedback'), {
        feedback: feedback.trim(),
        type: 'uninstall',
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        source: 'extension_uninstall_page'
      });
      
      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
      console.log('✅ Feedback submitted to Firestore');
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Extension Uninstalled
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          We noticed you've uninstalled the Requill extension. We're sorry to see you go!
        </p>

        {/* Feedback Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Help us improve
          </h3>
          
          {feedbackSubmitted ? (
            <div className="text-green-600 text-sm">
              ✅ Thank you for your feedback!
            </div>
          ) : !showFeedbackForm ? (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Your feedback helps us make Requill better for everyone.
              </p>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Give Feedback
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us why you uninstalled the extension..."
                className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={submitFeedback}
                  disabled={isSubmitting || !feedback.trim()}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reinstall Option */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Changed your mind? You can reinstall the extension anytime.
          </p>
          <button
            onClick={() => window.open('https://chrome.google.com/webstore/detail/requill', '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Reinstall Extension
          </button>
        </div>

        {/* Auto redirect notice */}
        <div className="text-xs text-gray-500">
          Redirecting to homepage in {countdown} seconds...
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 ExecutivesAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}