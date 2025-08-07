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
        const { amount, currency = "INR", receipt, notes, customer } = req.body;
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
        const orderData = {
            amount: amount * 100, // Convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {},
        };
        // Add customer data if provided
        if (customer && (customer.name || customer.email || customer.contact)) {
            orderData.customer_id = customer.email || undefined;
        }
        const order = await razorpay.orders.create(orderData);
        // Store order tracking in Firestore for additional safety
        if (notes === null || notes === void 0 ? void 0 : notes.userId) {
            try {
                await db.collection("razorpay_orders").doc(order.id).set({
                    orderId: order.id,
                    userId: notes.userId,
                    userEmail: notes.userEmail,
                    userDisplayName: notes.userDisplayName,
                    planType: notes.type,
                    planName: notes.plan,
                    amount: order.amount,
                    currency: order.currency,
                    receipt: order.receipt,
                    status: 'created',
                    createdAt: new Date(),
                    notes: notes,
                    customer: customer || null
                });
                logger.info("Order tracking stored in Firestore", { orderId: order.id, userId: notes.userId });
            }
            catch (firestoreError) {
                logger.error("Failed to store order tracking:", firestoreError);
                // Don't fail the order creation if Firestore fails
            }
        }
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
    var _a;
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
            logger.info("Webhook verified successfully", { event: (_a = req.body) === null || _a === void 0 ? void 0 : _a.event });
            // Process webhook event
            await processWebhookEvent(req.body);
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
            callback_url: "https://your-domain.com/payment-success",
            callback_method: "get"
        };
        logger.info("Creating payment link", {
            amount: paymentLinkData.amount,
            currency: paymentLinkData.currency,
            description: paymentLinkData.description
        });
        const paymentLink = await razorpay.paymentLink.create(paymentLinkData);
        logger.info("Payment link created successfully", {
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
// Process webhook events
async function processWebhookEvent(event) {
    var _a, _b, _c, _d, _e, _f;
    try {
        logger.info("Processing webhook event", {
            event: event.event,
            paymentId: (_c = (_b = (_a = event.payload) === null || _a === void 0 ? void 0 : _a.payment) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.id,
            orderId: (_f = (_e = (_d = event.payload) === null || _d === void 0 ? void 0 : _d.payment) === null || _e === void 0 ? void 0 : _e.entity) === null || _f === void 0 ? void 0 : _f.order_id
        });
        switch (event.event) {
            case 'payment.captured':
                await handlePaymentCaptured(event.payload.payment.entity);
                break;
            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity);
                break;
            case 'order.paid':
                await handleOrderPaid(event.payload.order.entity);
                break;
            default:
                logger.info("Unhandled webhook event", { event: event.event });
        }
    }
    catch (error) {
        logger.error("Error processing webhook event:", error);
    }
}
// Handle successful payment capture
async function handlePaymentCaptured(payment) {
    var _a, _b, _c;
    try {
        const paymentId = payment.id;
        const orderId = payment.order_id;
        const amount = payment.amount / 100; // Convert from paise to rupees
        logger.info("Processing captured payment", { paymentId, orderId, amount });
        // Fetch order details from Razorpay to get user info
        const razorpay = createRazorpayInstance();
        const order = await razorpay.orders.fetch(orderId);
        const userId = (_a = order.notes) === null || _a === void 0 ? void 0 : _a.userId;
        const userEmail = (_b = order.notes) === null || _b === void 0 ? void 0 : _b.userEmail;
        const planType = ((_c = order.notes) === null || _c === void 0 ? void 0 : _c.type) || 'monthly';
        //const planName = order.notes?.plan || 'Premium'; use this when multiple paid plans are there
        if (!userId) {
            logger.warn("No user ID found in order notes", { orderId, notes: order.notes });
            return;
        }
        logger.info("Found user info in order", { userId, userEmail, planType });
        // Check if this payment has already been processed
        const existingUpgrade = await db.collection("premiumUpgrades")
            .where("paymentId", "==", paymentId)
            .limit(1)
            .get();
        if (!existingUpgrade.empty) {
            logger.info("Payment already processed, skipping upgrade", { paymentId });
            return;
        }
        // Upgrade user to premium
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            logger.error("User not found for upgrade", { userId });
            return;
        }
        // Calculate subscription dates
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
            subscriptionType: planType,
            subscriptionStart: now,
            subscriptionEnd: subscriptionEnd,
            paymentId: paymentId,
            orderId: orderId,
            updatedAt: now,
            lastPaymentMethod: 'razorpay_webhook'
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
            amount: amount,
            currency: order.currency || "INR",
            upgradeSource: 'webhook',
            razorpayData: {
                payment: payment,
                order: order
            }
        });
        logger.info("User upgraded to premium via webhook", {
            userId,
            userEmail,
            paymentId,
            orderId,
            planType,
            amount
        });
    }
    catch (error) {
        logger.error("Error handling payment capture:", error);
    }
}
// Handle failed payment
async function handlePaymentFailed(payment) {
    try {
        const paymentId = payment.id;
        const orderId = payment.order_id;
        logger.info("Processing failed payment", { paymentId, orderId });
        // Log the failed payment for monitoring
        await db.collection("failedPayments").add({
            paymentId: paymentId,
            orderId: orderId,
            failedAt: new Date(),
            errorCode: payment.error_code,
            errorDescription: payment.error_description,
            razorpayData: payment
        });
    }
    catch (error) {
        logger.error("Error handling payment failure:", error);
    }
}
// Handle order paid event
async function handleOrderPaid(order) {
    try {
        logger.info("Order paid event received", { orderId: order.id });
        // This is typically followed by payment.captured, so we don't need to duplicate logic
    }
    catch (error) {
        logger.error("Error handling order paid:", error);
    }
}
//# sourceMappingURL=payment.js.map