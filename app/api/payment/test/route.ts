import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Payment API is working',
    env_check: {
      razorpay_key_id: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
      razorpay_secret: process.env.RAZORPAY_SECRET ? 'SET' : 'MISSING',
      razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET ? 'SET' : 'MISSING',
      next_public_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
    }
  });
}