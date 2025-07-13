import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment successful:', session);
      
      // Here you would typically:
      // 1. Update user subscription in your database
      // 2. Send confirmation email
      // 3. Update user permissions
      
      const { userId, plan } = session.metadata || {};
      console.log('User:', userId, 'Plan:', plan);
      
      break;
    
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription);
      break;
    
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log('Subscription canceled:', deletedSubscription);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}