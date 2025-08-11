"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.waitlist = exports.contact = exports.cleanupMetrics = exports.cleanupBehaviorData = exports.healthCheck = exports.getDashboard = exports.processQueue = exports.generateReply = exports.getUserProfile = exports.updateSubscriptionPlan = exports.getBillingHistory = exports.cancelSubscription = exports.upgradeToPremium = exports.updateUsageCount = exports.getUserUsageData = exports.checkUserByEmail = exports.analyzeProfile = exports.analyzePost = exports.trackPageView = exports.trackEvent = exports.paymentTest = exports.webhook = exports.verifyPayment = exports.createOrder = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
// Export payment functions
var payment_1 = require("./payment");
Object.defineProperty(exports, "createOrder", { enumerable: true, get: function () { return payment_1.createOrder; } });
Object.defineProperty(exports, "verifyPayment", { enumerable: true, get: function () { return payment_1.verifyPayment; } });
Object.defineProperty(exports, "webhook", { enumerable: true, get: function () { return payment_1.webhook; } });
Object.defineProperty(exports, "paymentTest", { enumerable: true, get: function () { return payment_1.paymentTest; } });
// Export analytics functions
var analytics_1 = require("./analytics");
Object.defineProperty(exports, "trackEvent", { enumerable: true, get: function () { return analytics_1.trackEvent; } });
Object.defineProperty(exports, "trackPageView", { enumerable: true, get: function () { return analytics_1.trackPageView; } });
Object.defineProperty(exports, "analyzePost", { enumerable: true, get: function () { return analytics_1.analyzePost; } });
Object.defineProperty(exports, "analyzeProfile", { enumerable: true, get: function () { return analytics_1.analyzeProfile; } });
// Export user management functions
var user_management_1 = require("./user-management");
Object.defineProperty(exports, "checkUserByEmail", { enumerable: true, get: function () { return user_management_1.checkUserByEmail; } });
Object.defineProperty(exports, "getUserUsageData", { enumerable: true, get: function () { return user_management_1.getUserUsageData; } });
Object.defineProperty(exports, "updateUsageCount", { enumerable: true, get: function () { return user_management_1.updateUsageCount; } });
Object.defineProperty(exports, "upgradeToPremium", { enumerable: true, get: function () { return user_management_1.upgradeToPremium; } });
Object.defineProperty(exports, "cancelSubscription", { enumerable: true, get: function () { return user_management_1.cancelSubscription; } });
Object.defineProperty(exports, "getBillingHistory", { enumerable: true, get: function () { return user_management_1.getBillingHistory; } });
Object.defineProperty(exports, "updateSubscriptionPlan", { enumerable: true, get: function () { return user_management_1.updateSubscriptionPlan; } });
Object.defineProperty(exports, "getUserProfile", { enumerable: true, get: function () { return user_management_1.getUserProfile; } });
// Export AI services functions
var ai_services_1 = require("./ai-services");
Object.defineProperty(exports, "generateReply", { enumerable: true, get: function () { return ai_services_1.generateReply; } });
Object.defineProperty(exports, "processQueue", { enumerable: true, get: function () { return ai_services_1.processQueue; } });
// Export dashboard functions
var dashboard_1 = require("./dashboard");
Object.defineProperty(exports, "getDashboard", { enumerable: true, get: function () { return dashboard_1.getDashboard; } });
// Export maintenance functions
var maintenance_1 = require("./maintenance");
Object.defineProperty(exports, "healthCheck", { enumerable: true, get: function () { return maintenance_1.healthCheck; } });
Object.defineProperty(exports, "cleanupBehaviorData", { enumerable: true, get: function () { return maintenance_1.cleanupBehaviorData; } });
Object.defineProperty(exports, "cleanupMetrics", { enumerable: true, get: function () { return maintenance_1.cleanupMetrics; } });
// Contact form handler
exports.contact = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a;
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { name, email, phone, message, userId } = req.body;
        // Validate required fields
        if (!name || !email || !message) {
            res.status(400).json({ error: "Name, email, and message are required" });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid email format" });
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
            ipAddress: req.ip || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) || null
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
    }
    catch (error) {
        logger.error("Error in contact function:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Waitlist handler
exports.waitlist = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { email, source = "api", userAgent, referrer } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required" });
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
        logger.info("User added to waitlist", { email, source });
        res.status(200).json({ message: "Successfully added to waitlist" });
    }
    catch (error) {
        logger.error("Error adding to waitlist:", error);
        res.status(500).json({ error: "Failed to add to waitlist" });
    }
});
// Send welcome email handler
exports.sendWelcomeEmail = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { userEmail, userName } = req.body;
        if (!userEmail) {
            res.status(400).json({ error: "User email is required" });
            return;
        }
        // Send welcome email using ZeptoMail API
        const success = await sendWelcomeEmailViaZepto(userEmail, userName);
        if (success) {
            logger.info("Welcome email sent successfully", { userEmail, userName });
            res.status(200).json({ message: "Welcome email sent successfully" });
        }
        else {
            logger.error("Failed to send welcome email", { userEmail, userName });
            res.status(500).json({ error: "Failed to send welcome email" });
        }
    }
    catch (error) {
        logger.error("Error sending welcome email:", error);
        res.status(500).json({ error: "Failed to send welcome email" });
    }
});
// Helper function to send welcome email via ZeptoMail
async function sendWelcomeEmailViaZepto(userEmail, userName) {
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
    }
    catch (error) {
        console.error('Error sending welcome email via ZeptoMail:', error);
        return false;
    }
}
// HTML template for welcome email
function getWelcomeEmailHTML(displayName, userEmail) {
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
//# sourceMappingURL=index.js.map