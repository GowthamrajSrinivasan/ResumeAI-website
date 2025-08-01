"use client";

import React, { useState } from 'react';
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';
import { useAuth } from '@/hooks/useAuth';

interface PaymentButtonProps {
  amount: number;
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
  amount, 
  planName, 
  planType, 
  className = "", 
  children 
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Debug logs
  console.log('PaymentButton loaded - User:', user?.email);

  const handlePayment = async () => {
    console.log('Starting payment for user:', user?.email);
    
    try {
      setIsLoading(true);

      // Create order on the server
      const orderResponse = await fetch(FIREBASE_FUNCTIONS.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${planName}_${Date.now()}`,
          notes: {
            plan: planName,
            type: planType,
          },
        }),
      });

      // Check if response is OK before parsing JSON
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order creation failed:', {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          body: errorText
        });
        throw new Error(`Failed to create order: ${orderResponse.status} ${orderResponse.statusText}`);
      }

      let orderData;
      try {
        orderData = await orderResponse.json();
      } catch (parseError) {
        console.error('Failed to parse order response as JSON:', parseError);
        const responseText = await orderResponse.text();
        console.error('Response text:', responseText);
        throw new Error('Invalid response from payment service');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Get Razorpay key from order response
      const razorpayKeyId = orderData.razorpay_key_id;
      
      if (!razorpayKeyId) {
        throw new Error('Razorpay key not configured in server response');
      }

      console.log('Using Razorpay key from server:', razorpayKeyId.substring(0, 12) + '...');

      // Configure Razorpay options with user prefill
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Requill',
        description: `${planName} Plan - ${planType}`,
        order_id: orderData.id,
        prefill: {
          name: user?.displayName || user?.email?.split('@')[0] || 'Customer',
          email: user?.email || '',
          contact: '' // Phone number if available
        },
        handler: async (response: any) => {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch(FIREBASE_FUNCTIONS.verifyPayment, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              console.error('Payment verification failed:', verifyResponse.status, verifyResponse.statusText);
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.status === 'success') {
              // Redirect to success page with payment details
              window.location.href = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
            } else {
              // Redirect to failure page
              window.location.href = '/payment/failed';
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        notes: {
          plan: planName,
          type: planType,
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

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}