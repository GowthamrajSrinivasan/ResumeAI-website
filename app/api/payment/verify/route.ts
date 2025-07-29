import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters' },
        { status: 400 }
      );
    }

    // Create the expected signature
    const razorpaySecret = process.env.RAZORPAY_SECRET;
    if (!razorpaySecret) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment verification failed',
          error: 'Razorpay secret not configured',
        },
        { status: 500 }
      );
    }
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(body.toString())
      .digest('hex');

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified successfully
      // Here you can:
      // 1. Update your database with payment status
      // 2. Send confirmation emails
      // 3. Grant access to paid features
      
      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        {
          status: 'failed',
          message: 'Payment verification failed',
          error: 'Invalid signature',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Payment verification failed',
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}