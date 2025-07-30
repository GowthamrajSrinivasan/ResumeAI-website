"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.waitlist = exports.contact = exports.paymentTest = exports.webhook = exports.verifyPayment = exports.createOrder = void 0;
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
// Contact form handler
exports.contact = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { name, email, phone, message } = req.body;
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
        // Store in Firestore or send email
        logger.info("Contact form submitted", { name, email, phone, message });
        res.status(200).json({ message: "Contact form submitted successfully" });
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
        // Implement email sending logic here
        logger.info("Welcome email sent", { userEmail, userName });
        res.status(200).json({ message: "Welcome email sent successfully" });
    }
    catch (error) {
        logger.error("Error sending welcome email:", error);
        res.status(500).json({ error: "Failed to send welcome email" });
    }
});
//# sourceMappingURL=index.js.map