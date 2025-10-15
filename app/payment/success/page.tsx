"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [upgradeStatus, setUpgradeStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [upgradeMessage, setUpgradeMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const planType = searchParams.get('plan_type') || 'premium';
    
    if (paymentId && orderId) {
      setPaymentDetails({
        payment_id: paymentId,
        order_id: orderId,
        plan_type: planType,
      });
    }
  }, [searchParams]);

  // Automatically upgrade user to premium when payment details and user are available
  useEffect(() => {
    const upgradeUserToPremium = async () => {
      // Skip if already processed or if missing required data
      if (!paymentDetails || !user || upgradeStatus !== null) {
        return;
      }

      // Add additional validation
      if (!paymentDetails.payment_id || !paymentDetails.order_id) {
        setUpgradeStatus('error');
        setUpgradeMessage('Invalid payment details. Please contact support.');
        return;
      }

      setUpgradeStatus('pending');
      setUpgradeMessage('Activating your premium subscription...');

      try {
        const response = await fetch(FIREBASE_FUNCTIONS.upgradeToPremium, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            paymentId: paymentDetails.payment_id,
            orderId: paymentDetails.order_id,
            planType: paymentDetails.plan_type,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUpgradeStatus('success');
            setUpgradeMessage('Premium subscription activated successfully!');
          } else {
            setUpgradeStatus('error');
            setUpgradeMessage(`Activation failed: ${result.message || 'Unknown error'}`);
          }
        } else {
          let errorMessage = 'Failed to activate subscription';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            errorMessage = `Server error (${response.status})`;
          }
          
          // Auto-retry for server errors up to 2 times
          if (response.status >= 500 && retryCount < 2) {
            console.log(`Retrying upgrade (attempt ${retryCount + 1})...`);
            setRetryCount(prev => prev + 1);
            setUpgradeMessage(`Activation attempt ${retryCount + 1} failed. Retrying...`);
            setTimeout(() => {
              setUpgradeStatus(null); // Reset to trigger retry
            }, 2000);
            return;
          }
          
          setUpgradeStatus('error');
          setUpgradeMessage(`${errorMessage}. Please contact support.`);
        }
      } catch (error) {
        console.error('Error upgrading to premium:', error);
        
        // Auto-retry for network errors up to 2 times
        if (retryCount < 2) {
          console.log(`Retrying upgrade due to network error (attempt ${retryCount + 1})...`);
          setRetryCount(prev => prev + 1);
          setUpgradeMessage(`Network error. Retrying activation (attempt ${retryCount + 1})...`);
          setTimeout(() => {
            setUpgradeStatus(null); // Reset to trigger retry
          }, 2000);
          return;
        }
        
        setUpgradeStatus('error');
        setUpgradeMessage('Network error occurred. Please contact support.');
      }
    };

    upgradeUserToPremium();
  }, [paymentDetails, user, upgradeStatus, retryCount]);

  // Manual retry function
  const handleRetry = () => {
    setUpgradeStatus(null);
    setRetryCount(0);
    setUpgradeMessage('');
  };

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
          
          {upgradeStatus === 'pending' && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
              <p className="text-blue-400">{upgradeMessage}</p>
            </div>
          )}
          
          {upgradeStatus === 'success' && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-4">
              <p className="text-green-400 text-sm">{upgradeMessage}</p>
            </div>
          )}
          
          {upgradeStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm mb-2">{upgradeMessage}</p>
              <button
                onClick={handleRetry}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Try Again
              </button>
            </div>
          )}
          
          <p className="text-gray-300 mb-6">
            {upgradeStatus === 'success' 
              ? 'Your premium subscription is now active!'
              : 'Thank you for your purchase. Your subscription is being activated.'}
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="relative rounded-2xl border border-blue-500 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-300">Loading payment details...</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}