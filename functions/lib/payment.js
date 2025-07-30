"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTest = exports.webhook = exports.verifyPayment = exports.createOrder = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const crypto = require("crypto");
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
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET"]
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
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        });
        logger.info("Order created successfully", { orderId: order.id, amount });
        res.status(200).json(order);
    }
    catch (error) {
        logger.error("Error creating order:", error);
        res.status(500).json({
            error: "Failed to create order",
            details: error instanceof Error ? error.message : String(error)
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
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const body = JSON.stringify(req.body);
        const signature = req.headers["x-razorpay-signature"];
        if (!signature) {
            res.status(400).json({ error: "Missing signature" });
            return;
        }
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Webhook secret not configured");
        }
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");
        if (expectedSignature === signature) {
            logger.info("Webhook verified", { event: req.body.event });
            // Process webhook event here
            res.status(200).json({ status: "ok" });
        }
        else {
            logger.warn("Webhook verification failed");
            res.status(400).json({ error: "Invalid signature" });
        }
    }
    catch (error) {
        logger.error("Error processing webhook:", error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
});
// Test handler
exports.paymentTest = (0, https_1.onRequest)({
    cors: true,
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_SECRET", "RAZORPAY_WEBHOOK_SECRET", "NEXT_PUBLIC_RAZORPAY_KEY_ID"]
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
                razorpayError = apiError instanceof Error ? apiError.message : String(apiError);
            }
        }
        catch (initError) {
            razorpayError = initError instanceof Error ? initError.message : String(initError);
        }
        res.status(200).json({
            status: "ok",
            message: "Payment API is working",
            env_check: {
                razorpay_key_id: process.env.RAZORPAY_KEY_ID ? "SET" : "MISSING",
                razorpay_secret: process.env.RAZORPAY_SECRET ? "SET" : "MISSING",
                razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET ? "SET" : "MISSING",
                next_public_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "SET" : "MISSING",
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
//# sourceMappingURL=payment.js.map