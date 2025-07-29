"use client";

import React, { useState } from 'react';

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

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Create order on the server
      const orderResponse = await fetch('/api/payment/create-order', {
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

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxxxx', // Use your test key here
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Requill',
        description: `${planName} Plan - ${planType}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch('/api/payment/verify', {
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
        prefill: {
          name: '',
          email: '',
          contact: '',
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