import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// Export payment functions
export {createOrder, verifyPayment, webhook, paymentTest} from "./payment";

// Export analytics functions
export {analyzePost, analyzeProfile} from "./analytics";

// Export user management functions
export {checkUserByEmail, getUserUsageData, updateUsageCount} from "./user-management";

// Export AI services functions
export {generateReply, processQueue} from "./ai-services";

// Export dashboard functions
export {getDashboard} from "./dashboard";

// Export maintenance functions
export {healthCheck, cleanupBehaviorData, cleanupMetrics} from "./maintenance";

// Contact form handler
export const contact = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {name, email, phone, message, userId} = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({error: "Name, email, and message are required"});
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({error: "Invalid email format"});
      return;
    }

    // Prepare feedback data for storage
    const feedbackData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      userId: userId || null,
      submittedAt: new Date(),
      timestamp: Date.now(),
      status: 'new',
      source: 'contact_form',
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || req.connection?.remoteAddress || null
    };

    // Store feedback in Firestore
    const feedbackRef = await db.collection('contact_submissions').add(feedbackData);
    
    logger.info("Contact form submitted and stored", {
      feedbackId: feedbackRef.id,
      name,
      email,
      phone,
      userId: userId || 'anonymous'
    });
    
    res.status(200).json({
      message: "Contact form submitted successfully",
      submissionId: feedbackRef.id
    });
  } catch (error) {
    logger.error("Error in contact function:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

// Waitlist handler
export const waitlist = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {email, source = "api", userAgent, referrer} = req.body;

    if (!email) {
      res.status(400).json({error: "Email is required"});
      return;
    }

    // Add to Firestore
    await db.collection("waitlist").add({
      email,
      source,
      userAgent,
      referrer,
      timestamp: new Date(),
    });

    logger.info("User added to waitlist", {email, source});
    res.status(200).json({message: "Successfully added to waitlist"});
  } catch (error) {
    logger.error("Error adding to waitlist:", error);
    res.status(500).json({error: "Failed to add to waitlist"});
  }
});

// Send welcome email handler
export const sendWelcomeEmail = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userEmail, userName} = req.body;

    if (!userEmail) {
      res.status(400).json({error: "User email is required"});
      return;
    }

    // Send welcome email using ZeptoMail API
    const success = await sendWelcomeEmailViaZepto(userEmail, userName);
    
    if (success) {
      logger.info("Welcome email sent successfully", {userEmail, userName});
      res.status(200).json({message: "Welcome email sent successfully"});
    } else {
      logger.error("Failed to send welcome email", {userEmail, userName});
      res.status(500).json({error: "Failed to send welcome email"});
    }
  } catch (error) {
    logger.error("Error sending welcome email:", error);
    res.status(500).json({error: "Failed to send welcome email"});
  }
});

// Helper function to send welcome email via ZeptoMail
async function sendWelcomeEmailViaZepto(userEmail: string, userName?: string): Promise<boolean> {
  try {
    const apiKey = process.env.ZEPTO_MAIL_API_KEY;
    const fromEmail = process.env.ZEPTO_MAIL_FROM_EMAIL || 'noreply@requill.executivesai.pro';
    const fromName = process.env.ZEPTO_MAIL_FROM_NAME || 'Requill Team';
    
    if (!apiKey) {
      console.error('ZEPTO_MAIL_API_KEY is not configured');
      return false;
    }

    const displayName = userName || 'there';
    const htmlBody = getWelcomeEmailHTML(displayName, userEmail);

    const payload = {
      "from": {
        "address": fromEmail,
        "name": fromName
      },
      "to": [
        {
          "email_address": {
            "address": userEmail,
            "name": userEmail.split('@')[0]
          }
        }
      ],
      "subject": "Welcome to Requill - Your AI-Powered Study Companion!",
      "htmlbody": htmlBody,
      "track_clicks": true,
      "track_opens": true
    };

    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ZeptoMail API error:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('Welcome email sent successfully via ZeptoMail:', result);
    return true;
  } catch (error) {
    console.error('Error sending welcome email via ZeptoMail:', error);
    return false;
  }
}

// HTML template for welcome email
function getWelcomeEmailHTML(displayName: string, userEmail: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Requill</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 30px 20px; }
            .welcome-text { font-size: 18px; margin-bottom: 20px; }
            .features { background: #f8fafc; border-radius: 6px; padding: 20px; margin: 20px 0; }
            .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
            .cta { text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 Welcome to Requill!</h1>
            </div>
            <div class="content">
                <div class="welcome-text">
                    Hi ${displayName},
                </div>
                <p>Welcome to Requill, your AI-powered study companion! We're excited to have you join our community of learners who are transforming the way they study and retain information.</p>
                
                <div class="features">
                    <h3 style="margin-top: 0; color: #2563eb;">What you can do with Requill:</h3>
                    <div class="feature-item">AI-powered content analysis and summarization</div>
                    <div class="feature-item">Intelligent study session planning</div>
                    <div class="feature-item">Personalized learning recommendations</div>
                    <div class="feature-item">Progress tracking and analytics</div>
                    <div class="feature-item">Seamless integration with your workflow</div>
                </div>

                <p>Your account is now active and ready to use. Start by exploring our features and see how Requill can enhance your learning experience.</p>

                <div class="cta">
                    <a href="https://requill.executivesai.pro/dashboard" class="cta-button">Get Started →</a>
                </div>

                <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>

                <p>Happy studying!<br>The Requill Team</p>
            </div>
            <div class="footer">
                <p>© 2025 Requill - Powered by ExecutivesAI. All rights reserved.</p>
                <p>This email was sent to ${userEmail}</p>
            </div>
        </div>
    </body>
    </html>
  `;
}