import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as crypto from "crypto";

// Initialize Razorpay
const Razorpay = require("razorpay");

function createRazorpayInstance() {
  const config = functions.config();
  // Try Firebase config first, then fall back to environment variables
  const keyId = config.razorpay?.key_id || process.env.RAZORPAY_KEY_ID;
  const keySecret = config.razorpay?.secret || process.env.RAZORPAY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Create order handler
export const createOrder = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {amount, currency = "INR", receipt} = req.body;

    if (!amount) {
      res.status(400).json({error: "Amount is required"});
      return;
    }

    const razorpay = createRazorpayInstance();
    
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    logger.info("Order created", {orderId: order.id, amount});
    res.status(200).json(order);
  } catch (error) {
    logger.error("Error creating order:", error);
    res.status(500).json({error: "Failed to create order"});
  }
});

// Verify payment handler
export const verifyPayment = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({error: "Missing required fields"});
      return;
    }

    const config = functions.config();
    const keySecret = config.razorpay?.secret || process.env.RAZORPAY_SECRET;
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
      res.status(200).json({verified: true});
    } else {
      logger.warn("Payment verification failed", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      res.status(400).json({verified: false, error: "Invalid signature"});
    }
  } catch (error) {
    logger.error("Error verifying payment:", error);
    res.status(500).json({error: "Failed to verify payment"});
  }
});

// Webhook handler
export const webhook = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"] as string;
    
    if (!signature) {
      res.status(400).json({error: "Missing signature"});
      return;
    }

    const config = functions.config();
    const webhookSecret = config.razorpay?.webhook_secret || process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      logger.info("Webhook verified", {event: req.body.event});
      // Process webhook event here
      res.status(200).json({status: "ok"});
    } else {
      logger.warn("Webhook verification failed");
      res.status(400).json({error: "Invalid signature"});
    }
  } catch (error) {
    logger.error("Error processing webhook:", error);
    res.status(500).json({error: "Webhook processing failed"});
  }
});

// Test handler
export const paymentTest = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const config = functions.config();
    res.status(200).json({
      status: "ok",
      message: "Payment API is working",
      env_check: {
        razorpay_key_id: (config.razorpay?.key_id || process.env.RAZORPAY_KEY_ID) ? "SET" : "MISSING",
        razorpay_secret: (config.razorpay?.secret || process.env.RAZORPAY_SECRET) ? "SET" : "MISSING",
        razorpay_webhook_secret: (config.razorpay?.webhook_secret || process.env.RAZORPAY_WEBHOOK_SECRET) ? "SET" : "MISSING",
        next_public_key_id: (config.razorpay?.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) ? "SET" : "MISSING",
      },
    });
  } catch (error) {
    logger.error("Error in payment test:", error);
    res.status(500).json({error: "Test failed"});
  }
});