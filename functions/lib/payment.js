"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTest = exports.createPaymentLink = exports.getConfig = exports.webhook = exports.verifyPayment = exports.createOrder = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const crypto = require("crypto");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
// Initialize Razorpay
const Razorpay = require("razorpay");
function createRazorpayInstance() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET;
    if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials not configured");
    }
    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
}
// Create order handler
exports.createOrder = (0, https_1.onRequest)({
    cors: true,
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET", "NEXT_PUBLIC_RAZORPAY_KEY_ID"]
}, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { amount, currency = "INR", receipt } = req.body;
        if (!amount) {
            res.status(400).json({ error: "Amount is required" });
            return;
        }
        // Log detailed secret information for debugging
        logger.info("CreateOrder - Secret details", {
            keyId: process.env.RAZORPAY_KEY_ID ? {
                exists: true,
                prefix: process.env.RAZORPAY_KEY_ID.substring(0, 12),
                length: process.env.RAZORPAY_KEY_ID.length,
                type: process.env.RAZORPAY_KEY_ID.startsWith('rzp_live_') ? 'LIVE' :
                    process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_') ? 'TEST' : 'UNKNOWN'
            } : "MISSING",
            keySecret: process.env.RAZORPAY_SECRET ? {
                exists: true,
                prefix: process.env.RAZORPAY_SECRET.substring(0, 8),
                length: process.env.RAZORPAY_SECRET.length
            } : "MISSING"
        });
        const razorpay = createRazorpayInstance();
        logger.info("Razorpay instance created, attempting order creation", {
            amount: amount,
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`
        });
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: {
                userId: req.body.userId,
                email: req.body.email,
                userEmail: req.body.email,
                name: req.body.name,
                plan: req.body.plan,
                planType: req.body.plan,
                type: req.body.type
            }
        });
        logger.info("Order created successfully", { orderId: order.id, amount });
        res.status(200).json(Object.assign(Object.assign({}, order), { razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID }));
    }
    catch (error) {
        logger.error("Error creating order:", error);
        res.status(500).json({
            error: "Failed to create order",
            details: error instanceof Error ? error.message : JSON.stringify(error)
        });
    }
});
// Verify payment handler
exports.verifyPayment = (0, https_1.onRequest)({
    cors: true,
    secrets: ["RAZORPAY_SECRET"]
}, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const keySecret = process.env.RAZORPAY_SECRET;
        if (!keySecret) {
            throw new Error("Razorpay secret not configured");
        }
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(body.toString())
            .digest("hex");
        const isAuthentic = expectedSignature === razorpay_signature;
        if (isAuthentic) {
            logger.info("Payment verified successfully", {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });
            // Get user details from request body for upgrade
            const { userId, userEmail, planType } = req.body;
            if (userId && userEmail) {
                try {
                    // Automatically upgrade user to premium
                    await upgradeUserToPremium(userId, userEmail, razorpay_payment_id, razorpay_order_id, planType || 'premium');
                    logger.info("User automatically upgraded to premium after payment verification", {
                        userId,
                        paymentId: razorpay_payment_id
                    });
                }
                catch (upgradeError) {
                    logger.error("Failed to upgrade user to premium:", upgradeError);
                    // Still return success for payment verification, but log the upgrade failure
                }
            }
            res.status(200).json({ verified: true });
        }
        else {
            logger.warn("Payment verification failed", {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });
            res.status(400).json({ verified: false, error: "Invalid signature" });
        }
    }
    catch (error) {
        logger.error("Error verifying payment:", error);
        res.status(500).json({ error: "Failed to verify payment" });
    }
});
// Webhook handler
exports.webhook = (0, https_1.onRequest)({
    cors: true,
    secrets: ["RAZORPAY_WEBHOOK_SECRET"]
}, async (req, res) => {
    var _a, _b;
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        // Get raw body for signature verification
        const body = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const signature = req.headers["x-razorpay-signature"];
        logger.info("Webhook received", {
            hasRawBody: !!req.rawBody,
            bodyLength: body.length,
            signaturePresent: !!signature,
            bodyPreview: body.substring(0, 100)
        });
        if (!signature) {
            logger.warn("Missing webhook signature");
            res.status(400).json({ error: "Missing signature" });
            return;
        }
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            logger.error("Webhook secret not configured");
            throw new Error("Webhook secret not configured");
        }
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");
        logger.info("Signature verification", {
            expected: expectedSignature,
            received: signature,
            match: expectedSignature === signature
        });
        if (expectedSignature === signature) {
            const event = (_a = req.body) === null || _a === void 0 ? void 0 : _a.event;
            const payload = (_b = req.body) === null || _b === void 0 ? void 0 : _b.payload;
            logger.info("Webhook verified successfully", { event, payload });
            // Process payment.captured events
            if (event === 'payment.captured' && (payload === null || payload === void 0 ? void 0 : payload.payment)) {
                try {
                    const payment = payload.payment.entity;
                    const orderId = payment.order_id;
                    const paymentId = payment.id;
                    const amount = payment.amount / 100; // Convert from paise to rupees
                    // Get order details to find user information
                    if (payment.notes) {
                        const userId = payment.notes.userId;
                        const userEmail = payment.notes.email || payment.notes.userEmail;
                        const planType = payment.notes.plan || payment.notes.planType || 'premium';
                        if (userId && userEmail) {
                            await upgradeUserToPremium(userId, userEmail, paymentId, orderId, planType);
                            logger.info("User automatically upgraded via webhook", {
                                userId,
                                paymentId,
                                orderId,
                                amount
                            });
                        }
                        else {
                            logger.warn("Missing user information in payment notes", {
                                notes: payment.notes,
                                paymentId
                            });
                        }
                    }
                }
                catch (webhookError) {
                    logger.error("Error processing payment webhook:", webhookError);
                    // Don't fail the webhook response, just log the error
                }
            }
            res.status(200).json({ status: "ok" });
        }
        else {
            logger.warn("Webhook verification failed - signature mismatch");
            res.status(400).json({ error: "Invalid signature" });
        }
    }
    catch (error) {
        logger.error("Error processing webhook:", error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
});
// Config handler - serves public configuration
exports.getConfig = (0, https_1.onRequest)({
    cors: true,
    secrets: ["NEXT_PUBLIC_RAZORPAY_KEY_ID"]
}, async (req, res) => {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
            logger.error("NEXT_PUBLIC_RAZORPAY_KEY_ID not configured");
            res.status(500).json({ error: "Configuration not available" });
            return;
        }
        res.status(200).json({
            razorpay_key_id: razorpayKeyId
        });
    }
    catch (error) {
        logger.error("Error getting config:", error);
        res.status(500).json({ error: "Failed to get configuration" });
    }
});
// Create payment link handler
exports.createPaymentLink = (0, https_1.onRequest)({
    cors: true,
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET"]
}, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { amount, currency = "INR", description, customer_email, customer_name, plan_name } = req.body;
        if (!amount) {
            res.status(400).json({ error: "Amount is required" });
            return;
        }
        const razorpay = createRazorpayInstance();
        const paymentLinkData = {
            amount: amount * 100, // Convert to paise
            currency,
            accept_partial: false,
            description: description || `Payment for ${plan_name || 'Requill'} Plan`,
            customer: {
                name: customer_name || "Customer",
                email: customer_email || "",
            },
            notify: {
                sms: false,
                email: true
            },
            reminder_enable: true,
            notes: {
                plan: plan_name || "unknown",
                created_via: "executivesAI_checkout"
            },
            callback_url: "https://requill.executivesai.pro/account/subscriptions",
            callback_method: "get"
        };
        logger.info("Creating payment link", {
            amount: paymentLinkData.amount,
            currency: paymentLinkData.currency,
            description: paymentLinkData.description,
            customer: paymentLinkData.customer,
            notify: paymentLinkData.notify,
            reminder_enable: paymentLinkData.reminder_enable,
            notes: paymentLinkData.notes,
            callback_url: paymentLinkData.callback_url,
            callback_method: paymentLinkData.callback_method
        });
        const paymentLink = await razorpay.paymentLink.create(paymentLinkData);
        logger.info("Payment link created successfully", {
            payment_link: paymentLink,
            id: paymentLink.id,
            short_url: paymentLink.short_url
        });
        res.status(200).json({
            id: paymentLink.id,
            short_url: paymentLink.short_url,
            payment_link: paymentLink
        });
    }
    catch (error) {
        logger.error("Error creating payment link:", error);
        res.status(500).json({
            error: "Failed to create payment link",
            details: error instanceof Error ? error.message : JSON.stringify(error)
        });
    }
});
// Test handler
exports.paymentTest = (0, https_1.onRequest)({
    cors: true,
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET", "RAZORPAY_WEBHOOK_SECRET"]
}, async (req, res) => {
    var _a, _b;
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        // Test Razorpay instance creation
        let razorpayInitialized = false;
        let razorpayError = null;
        try {
            const razorpay = createRazorpayInstance();
            razorpayInitialized = true;
            // Try to make a simple API call to test credentials
            try {
                const payments = await razorpay.payments.all({ count: 1 });
                logger.info("Razorpay API test successful", { paymentsCount: ((_a = payments.items) === null || _a === void 0 ? void 0 : _a.length) || 0 });
            }
            catch (apiError) {
                logger.error("Razorpay API test failed:", apiError);
                razorpayError = apiError instanceof Error ? apiError.message : JSON.stringify(apiError);
            }
        }
        catch (initError) {
            razorpayError = initError instanceof Error ? initError.message : JSON.stringify(initError);
        }
        res.status(200).json({
            status: "ok",
            message: "Payment API is working",
            env_check: {
                razorpay_key_id: process.env.RAZORPAY_KEY_ID ? "SET" : "MISSING",
                razorpay_secret: process.env.RAZORPAY_SECRET ? "SET" : "MISSING",
                razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET ? "SET" : "MISSING",
            },
            razorpay_test: {
                initialized: razorpayInitialized,
                error: razorpayError,
                key_id_prefix: ((_b = process.env.RAZORPAY_KEY_ID) === null || _b === void 0 ? void 0 : _b.substring(0, 8)) || "N/A"
            }
        });
    }
    catch (error) {
        logger.error("Error in payment test:", error);
        res.status(500).json({ error: "Test failed" });
    }
});
// Helper function to upgrade user to premium
async function upgradeUserToPremium(userId, userEmail, paymentId, orderId, planType = 'premium') {
    try {
        logger.info("Upgrading user to premium", { userId, userEmail, paymentId, orderId, planType });
        // Update user document in Firestore
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("User not found");
        }
        // Calculate subscription end date
        const now = new Date();
        const subscriptionEnd = new Date();
        if (planType === 'annual') {
            subscriptionEnd.setFullYear(now.getFullYear() + 1);
        }
        else {
            subscriptionEnd.setMonth(now.getMonth() + 1);
        }
        // Update user to premium
        await userRef.update({
            isPremium: true,
            planType: planType,
            subscriptionType: planType,
            subscriptionStatus: 'active',
            premiumStartDate: now,
            premiumEndDate: subscriptionEnd,
            subscriptionStart: now,
            subscriptionEnd: subscriptionEnd,
            lastPaymentId: paymentId,
            lastOrderId: orderId,
            updatedAt: now
        });
        // Log the premium upgrade
        await db.collection("premiumUpgrades").add({
            userId: userId,
            userEmail: userEmail,
            paymentId: paymentId,
            orderId: orderId,
            planType: planType,
            subscriptionStart: now,
            subscriptionEnd: subscriptionEnd,
            upgradedAt: now,
            createdAt: now,
            source: 'payment_verification'
        });
        logger.info("User upgraded to premium successfully", { userId, userEmail, planType });
        return true;
    }
    catch (error) {
        logger.error("Error upgrading user to premium:", error);
        throw error;
    }
}
//# sourceMappingURL=payment.js.map