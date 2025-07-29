import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/emailService';

export const dynamic = 'force-dynamic';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: ContactFormData = await request.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email notification to support team
    const emailSent = await sendContactNotification(formData);

    if (emailSent) {
      // Optionally send a confirmation email to the user
      await sendConfirmationEmail(formData.email, formData.name);

      return NextResponse.json(
        { message: 'Contact form submitted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send contact form' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendContactNotification(formData: ContactFormData): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: 600; color: #2563eb; margin-bottom: 5px; }
            .field-value { background: #f8fafc; padding: 10px; border-radius: 4px; border-left: 4px solid #2563eb; }
            .footer { background: #f8fafc; padding: 15px 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 New Contact Form Submission</h1>
            </div>
            <div class="content">
                <p>A new contact form has been submitted on the Requill website:</p>
                
                <div class="field">
                    <div class="field-label">Name:</div>
                    <div class="field-value">${formData.name}</div>
                </div>

                <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value">${formData.email}</div>
                </div>

                ${formData.phone ? `
                <div class="field">
                    <div class="field-label">Phone:</div>
                    <div class="field-value">${formData.phone}</div>
                </div>
                ` : ''}

                <div class="field">
                    <div class="field-label">Message:</div>
                    <div class="field-value">${formData.message.replace(/\n/g, '<br>')}</div>
                </div>

                <p><strong>Please respond to this inquiry within 24 hours.</strong></p>
            </div>
            <div class="footer">
                <p>This email was generated automatically from the Requill contact form.</p>
                <p>Submitted on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await emailService.sendEmail({
    to: 'support@executivesai.pro',
    subject: `New Contact Form Submission from ${formData.name}`,
    html: htmlContent,
    text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}

Message:
${formData.message}

Submitted on ${new Date().toLocaleString()}
    `
  });
}

async function sendConfirmationEmail(userEmail: string, userName: string): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>We received your message</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; text-align: center; }
            .footer { background: #f8fafc; padding: 15px 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Message Received</h1>
            </div>
            <div class="content">
                <h2>Thank you, ${userName}!</h2>
                <p>We've received your message and will get back to you within 24 hours during business days.</p>
                <p>If you have an urgent matter, please don't hesitate to email us directly at <strong>support@executivesai.pro</strong></p>
                <p>Best regards,<br>The Requill Team</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Requill - Powered by ExecutivesAI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await emailService.sendEmail({
    to: userEmail,
    subject: 'We received your message - Requill Support',
    html: htmlContent,
    text: `
Thank you, ${userName}!

We've received your message and will get back to you within 24 hours during business days.

If you have an urgent matter, please don't hesitate to email us directly at support@executivesai.pro

Best regards,
The Requill Team

© ${new Date().getFullYear()} Requill - Powered by ExecutivesAI. All rights reserved.
    `
  });
}