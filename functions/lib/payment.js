"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTest = exports.webhook = exports.verifyPayment = exports.createOrder = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const crypto = require("crypto");
// Initialize Razorpay
const Razorpay = require("razorpay");
function createRazorpayInstance() {
    var _a, _b;
    const config = functions.config();
    // Try Firebase config first, then fall back to environment variables
    const keyId = ((_a = config.razorpay) === null || _a === void 0 ? void 0 : _a.key_id) || process.env.RAZORPAY_KEY_ID;
    const keySecret = ((_b = config.razorpay) === null || _b === void 0 ? void 0 : _b.secret) || process.env.RAZORPAY_SECRET;
    if (!keyId || !keySecret) {
        throw new Error("Razorpay credentials not configured");
    }
    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
}
// Create order handler
exports.createOrder = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
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
        const razorpay = createRazorpayInstance();
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        });
        logger.info("Order created", { orderId: order.id, amount });
        res.status(200).json(order);
    }
    catch (error) {
        logger.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});
// Verify payment handler
exports.verifyPayment = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a;
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
        const config = functions.config();
        const keySecret = ((_a = config.razorpay) === null || _a === void 0 ? void 0 : _a.secret) || process.env.RAZORPAY_SECRET;
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
exports.webhook = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a;
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
        const config = functions.config();
        const webhookSecret = ((_a = config.razorpay) === null || _a === void 0 ? void 0 : _a.webhook_secret) || process.env.RAZORPAY_WEBHOOK_SECRET;
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
exports.paymentTest = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a, _b, _c, _d;
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const config = functions.config();
        res.status(200).json({
            status: "ok",
            message: "Payment API is working",
            env_check: {
                razorpay_key_id: (((_a = config.razorpay) === null || _a === void 0 ? void 0 : _a.key_id) || process.env.RAZORPAY_KEY_ID) ? "SET" : "MISSING",
                razorpay_secret: (((_b = config.razorpay) === null || _b === void 0 ? void 0 : _b.secret) || process.env.RAZORPAY_SECRET) ? "SET" : "MISSING",
                razorpay_webhook_secret: (((_c = config.razorpay) === null || _c === void 0 ? void 0 : _c.webhook_secret) || process.env.RAZORPAY_WEBHOOK_SECRET) ? "SET" : "MISSING",
                next_public_key_id: (((_d = config.razorpay) === null || _d === void 0 ? void 0 : _d.key_id) || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) ? "SET" : "MISSING",
            },
        });
    }
    catch (error) {
        logger.error("Error in payment test:", error);
        res.status(500).json({ error: "Test failed" });
    }
});
//# sourceMappingURL=payment.js.map