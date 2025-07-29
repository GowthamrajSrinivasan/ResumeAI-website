import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        // Payment was successful
        console.log('Payment captured:', event.payload.payment.entity);
        // Update your database, send confirmation emails, etc.
        break;

      case 'payment.failed':
        // Payment failed
        console.log('Payment failed:', event.payload.payment.entity);
        // Handle failed payment, notify user, etc.
        break;

      case 'order.paid':
        // Order was fully paid
        console.log('Order paid:', event.payload.order.entity);
        break;

      case 'payment.authorized':
        // Payment was authorized (for cards)
        console.log('Payment authorized:', event.payload.payment.entity);
        break;

      case 'refund.created':
        // Refund was created
        console.log('Refund created:', event.payload.refund.entity);
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}