"use client";

import React, { useState, useEffect } from 'react';
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';
import { useAuth } from '@/hooks/useAuth';
import { getLocalizedPricing, PlanPricing, CurrencyInfo } from '@/lib/currency-service';

interface PaymentButtonProps {
  planName: string;
  planType: 'monthly' | 'annual';
  className?: string;
  children: React.ReactNode;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({ 
  planName, 
  planType, 
  className = "", 
  children 
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pricingData, setPricingData] = useState<PlanPricing | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const { user } = useAuth();
  
  console.log('PaymentButtonWithCurrency loaded - User:', user?.email);

  // Initialize pricing with configuration-based system
  useEffect(() => {
    const initializePricing = async () => {
      try {
        setPriceLoading(true);
        const pricing = await getLocalizedPricing();
        setPricingData(pricing);
        
        console.log('💰 Pricing initialized:', {
          source: pricing.pricingSource,
          currency: pricing.currency.code,
          monthly: pricing.monthly,
          annual: pricing.annual
        });
      } catch (error) {
        console.error('Pricing initialization failed:', error);
        // Fallback pricing
        setPricingData({
          monthly: 999,
          annual: 9999,
          currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
          formattedMonthly: '₹999',
          formattedAnnual: '₹9,999',
          pricingSource: 'manual'
        });
      } finally {
        setPriceLoading(false);
      }
    };

    initializePricing();
  }, []);

  const handlePayment = async () => {
    if (!pricingData) {
      console.error('❌ No pricing data available');
      alert('Pricing not loaded. Please try again.');
      return;
    }

    const amount = planType === 'monthly' ? pricingData.monthly : pricingData.annual;
    
    console.log('Starting payment for user:', user?.email);
    console.log('Payment details:', {
      amount: amount,
      currency: pricingData.currency.code,
      pricingSource: pricingData.pricingSource,
      planType: planType
    });
    
    try {
      setIsLoading(true);

      // Create order on the server with localized amount and currency
      const orderResponse = await fetch(FIREBASE_FUNCTIONS.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: pricingData.currency.code,
          receipt: `receipt_${planName}_${planType}_${Date.now()}`,
          notes: {
            email: user?.email,
            uid: user?.uid,
            name: user?.displayName,
            plan: planName,
            type: planType,
            currency: pricingData.currency.code,
            pricingSource: pricingData.pricingSource,
            localizedAmount: amount
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order creation failed:', {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          body: errorText
        });
        throw new Error(`Failed to create order: ${orderResponse.status} ${orderResponse.statusText}`);
      }

      const orderData = await orderResponse.json();
      const razorpayKeyId = orderData.razorpay_key_id;
      
      if (!razorpayKeyId) {
        throw new Error('Razorpay key not configured in server response');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => { script.onload = resolve; });
      }

      console.log('Using Razorpay key from server:', razorpayKeyId.substring(0, 12) + '...');

      // Configure Razorpay options with localized currency
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Requill',
        description: `${planName} Plan - ${planType} (${pricingData.currency.symbol}${amount})`,
        order_id: orderData.id,
        prefill: {
          name: user?.displayName || user?.email?.split('@')[0] || 'Customer',
          email: user?.email || '',
          contact: ''
        },
        handler: async (response: any) => {
          console.log('✅ Payment successful! Processing...', response);
          
          // IMPORTANT: Don't throw errors in the handler to prevent "Payment Failed" message
          try {
            console.log('🔍 Verifying payment...');
            const verifyResponse = await fetch(FIREBASE_FUNCTIONS.verifyPayment, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              console.error('❌ Payment verification failed:', verifyResponse.status);
              alert('Payment verification failed. Please contact support.');
              return;
            }

            const verifyData = await verifyResponse.json();
            console.log('🔍 Verification result:', verifyData);

            if (verifyData.verified) {
              console.log('✅ Payment verified! Upgrading user...');
              
              if (user) {
                const upgradeResponse = await fetch(FIREBASE_FUNCTIONS.upgradeToPremium, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user.uid,
                    userEmail: user.email,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    planType: planType,
                    // Include pricing details
                    paymentDetails: {
                      amount: amount,
                      currency: pricingData.currency.code,
                      pricingSource: pricingData.pricingSource,
                      formattedAmount: planType === 'monthly' ? pricingData.formattedMonthly : pricingData.formattedAnnual
                    }
                  }),
                });

                if (!upgradeResponse.ok) {
                  console.error('❌ Failed to upgrade user:', upgradeResponse.status);
                  alert('Payment successful but upgrade failed. Please contact support.');
                  return;
                }

                const upgradeData = await upgradeResponse.json();
                console.log('🚀 Upgrade result:', upgradeData);
                
                if (upgradeData.success) {
                  console.log('🎉 User upgraded successfully! Redirecting to success page...');
                  setTimeout(() => {
                    window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&plan_type=${planType}`;
                  }, 1000);
                } else {
                  console.error('❌ Upgrade failed:', upgradeData);
                  alert('Payment successful but upgrade failed. Please contact support.');
                }
              } else {
                console.error('❌ No user logged in');
                alert('Payment successful but no user found. Please contact support.');
              }
            } else {
              console.error('❌ Payment verification failed:', verifyData);
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('❌ Payment processing error:', error);
            alert('Payment processing error. Please contact support.');
          }
        },
        notes: {
          plan: planName,
          type: planType,
          currency: pricingData.currency.code,
          pricingSource: pricingData.pricingSource
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (priceLoading || !pricingData) {
    return (
      <button
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        Loading pricing...
      </button>
    );
  }

  const displayAmount = planType === 'monthly' 
    ? pricingData.formattedMonthly 
    : pricingData.formattedAnnual;

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={`${pricingData.pricingSource === 'manual' ? 'Manual' : 'Auto-converted'} pricing in ${pricingData.currency.name}`}
    >
      {isLoading 
        ? 'Processing...' 
        : `${children} (${displayAmount})`
      }
    </button>
  );
}