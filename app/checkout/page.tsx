"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from "react";
import { Sparkles, Check, Crown, ArrowLeft, CreditCard } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'annual'>('pro');
  const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'stripe'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const plans = {
    pro: {
      name: "Pro Monthly",
      price: 999, // in paise (₹9.99)
      displayPrice: "₹9.99",
      period: "month",
      features: [
        "Unlimited AI-generated content",
        "Advanced message personalization", 
        "Complete profile optimization",
        "25+ language support",
        "Priority customer support",
        "Analytics and insights",
        "Custom templates",
        "Export content history"
      ]
    },
    annual: {
      name: "Pro Annual",
      price: 9999, // in paise (₹99.99)
      displayPrice: "₹99.99",
      period: "year", 
      originalPrice: "₹119.88",
      savings: "Save 17%",
      features: [
        "Unlimited AI-generated content",
        "Advanced message personalization",
        "Complete profile optimization", 
        "25+ language support",
        "Priority customer support",
        "Analytics and insights",
        "Custom templates",
        "Export content history",
        "Annual billing discount"
      ]
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) return;
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert('Razorpay is not configured yet. Please contact support.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plans[selectedPlan].price,
          currency: 'INR',
          plan: selectedPlan,
          userId: user.uid,
          userEmail: user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plans[selectedPlan].price,
        currency: 'INR',
        name: 'LinkedIn AI Assistant',
        description: `${plans[selectedPlan].name} Subscription`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.uid,
              plan: selectedPlan
            }),
          });

          if (verifyResponse.ok) {
            router.push('/dashboard?payment=success');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      alert('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    if (!user) return;
    
    if (!stripePromise) {
      alert('Stripe is not configured yet. Please contact support.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          userId: user.uid,
          userEmail: user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (selectedGateway === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleStripePayment();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-xl font-extrabold">LinkedIn AI Assistant - Checkout</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/pricing')}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Pricing</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
              
              {/* Payment Gateway Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedGateway === 'razorpay' 
                        ? 'border-blue-500 bg-blue-500/10 backdrop-blur-md' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedGateway('razorpay')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedGateway === 'razorpay' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                      }`}>
                        {selectedGateway === 'razorpay' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <p className="text-white font-medium">Razorpay</p>
                        <p className="text-xs text-gray-400">Cards, UPI, Net Banking</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedGateway === 'stripe' 
                        ? 'border-purple-500 bg-purple-500/10 backdrop-blur-md' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedGateway('stripe')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedGateway === 'stripe' ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                      }`}>
                        {selectedGateway === 'stripe' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <p className="text-white font-medium">Stripe</p>
                        <p className="text-xs text-gray-400">Cards, Apple Pay, Google Pay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Monthly Plan */}
              <div 
                className={`relative rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan === 'pro' 
                    ? 'border-blue-500 bg-blue-500/10 backdrop-blur-md' 
                    : 'border-blue-900 bg-[#181c28]/80 backdrop-blur-md hover:border-blue-700'
                }`}
                onClick={() => setSelectedPlan('pro')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{plans.pro.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">{plans.pro.displayPrice}</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'pro' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                  }`}>
                    {selectedPlan === 'pro' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              </div>

              {/* Annual Plan */}
              <div 
                className={`relative rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan === 'annual' 
                    ? 'border-purple-500 bg-purple-500/10 backdrop-blur-md' 
                    : 'border-purple-900 bg-[#181c28]/80 backdrop-blur-md hover:border-purple-700'
                }`}
                onClick={() => setSelectedPlan('annual')}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {plans.annual.savings}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4 pt-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{plans.annual.name}</h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-white">{plans.annual.displayPrice}</span>
                      <span className="text-gray-400 ml-1">/year</span>
                      <span className="text-sm text-gray-500 line-through">{plans.annual.originalPrice}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'annual' ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                  }`}>
                    {selectedPlan === 'annual' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Plan:</span>
                  <span className="text-white font-medium">{plans[selectedPlan].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Billing:</span>
                  <span className="text-white font-medium">
                    {selectedPlan === 'annual' ? 'Annual' : 'Monthly'}
                  </span>
                </div>
                {selectedPlan === 'annual' && (
                  <div className="flex justify-between text-green-400">
                    <span>Savings:</span>
                    <span className="font-medium">₹19.89</span>
                  </div>
                )}
                <hr className="border-gray-600" />
                <div className="flex justify-between text-lg">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-white font-bold">{plans[selectedPlan].displayPrice}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-white">Included Features:</h4>
                <ul className="space-y-2">
                  {plans[selectedPlan].features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-4 text-white rounded-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  selectedGateway === 'razorpay' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with {selectedGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  🔒 Secure payment powered by {selectedGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>🔒 Your payment information is encrypted and secure</p>
            <p className="mt-2">
              By proceeding, you agree to our{' '}
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </button>
              {' '}and{' '}
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}