"use client";

import React from 'react';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="relative rounded-2xl border border-red-500 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Payment Failed
          </h1>
          
          <p className="text-gray-300 mb-6">
            We couldn't process your payment. Please try again or contact support if the issue persists.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/contact'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Contact Support
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}