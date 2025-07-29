import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'api', userAgent, referrer } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Add to Firestore with server credentials
    const docRef = await addDoc(collection(db, 'waitlist'), {
      email: email.trim().toLowerCase(),
      timestamp: serverTimestamp(),
      userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      source: source,
      ipAddress: ip,
      referrer: referrer || request.headers.get('referer') || null,
      isAnonymous: true,
      submittedAt: new Date().toISOString()
    });

    console.log('✅ Waitlist email added via API:', email, 'Doc ID:', docRef.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist',
        id: docRef.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ API Error adding to waitlist:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to add to waitlist',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}