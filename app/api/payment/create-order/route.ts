import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

function createRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET environment variables.');
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(request: NextRequest) {
  // Early return during build if env vars not set
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    console.error('Razorpay environment variables not set:', {
      key_id: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
      secret: process.env.RAZORPAY_SECRET ? 'SET' : 'MISSING'
    });
    return NextResponse.json(
      { 
        error: {
          code: 'CONFIGURATION_ERROR',
          description: 'Payment service is not properly configured',
          source: 'server',
          step: 'initialization',
          reason: 'environment_variables_missing'
        }
      },
      { status: 503 }
    );
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = await request.json();
    
    console.log('Creating order with:', { amount, currency, receipt, notes });

    // Validate required fields
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Amount is required and must be at least ₹1.00' },
        { status: 400 }
      );
    }

    // Convert amount to smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      offer_id: order.offer_id,
      status: order.status,
      attempts: order.attempts,
      notes: order.notes,
      created_at: order.created_at,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    
    return NextResponse.json(
      {
        error: {
          code: error.error?.code || 'INTERNAL_SERVER_ERROR',
          description: error.error?.description || 'Failed to create order',
          source: error.error?.source || 'server',
          step: error.error?.step || 'payment_initiation',
          reason: error.error?.reason || 'internal_error',
          metadata: error.error?.metadata || {},
          field: error.error?.field || null,
        },
      },
      { status: error.statusCode || 500 }
    );
  }
}