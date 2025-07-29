"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    
    if (paymentId && orderId) {
      setPaymentDetails({
        payment_id: paymentId,
        order_id: orderId,
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="relative rounded-2xl border border-green-500 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-300 mb-6">
            Thank you for your purchase. Your subscription has been activated.
          </p>

          {paymentDetails && (
            <div className="bg-[#111624]/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Payment Details:</h3>
              <p className="text-xs text-gray-400">
                <span className="font-medium">Payment ID:</span> {paymentDetails.payment_id}
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-medium">Order ID:</span> {paymentDetails.order_id}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Go to Dashboard
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