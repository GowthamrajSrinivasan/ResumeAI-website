"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsageCount = exports.getUserUsageData = exports.checkUserByEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
// Check user by email function
exports.checkUserByEmail = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a;
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }
        // Check if user exists in Firestore
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("userEmail", "==", email).get();
        if (snapshot.empty) {
            res.status(200).json({
                exists: false,
                message: "User not found"
            });
        }
        else {
            const userData = snapshot.docs[0].data();
            res.status(200).json({
                exists: true,
                user: {
                    uid: userData.uid,
                    email: userData.userEmail,
                    displayName: ((_a = userData.userDetails) === null || _a === void 0 ? void 0 : _a.displayName) || null,
                    lastLoginAt: userData.lastLoginAt,
                    createdAt: userData.createdAt
                }
            });
        }
        logger.info("User check completed", { email, exists: !snapshot.empty });
    }
    catch (error) {
        logger.error("Error checking user:", error);
        res.status(500).json({ error: "Failed to check user" });
    }
});
// Get user usage data function
exports.getUserUsageData = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        // Get usage data from Firestore
        const usageRef = db.collection("usage").doc(userId);
        const usageDoc = await usageRef.get();
        if (!usageDoc.exists) {
            res.status(200).json({
                userId,
                totalUsage: 0,
                monthlyUsage: 0,
                lastUsed: null,
                features: {}
            });
        }
        else {
            const usageData = usageDoc.data();
            res.status(200).json(Object.assign({ userId }, usageData));
        }
        logger.info("Usage data retrieved", { userId });
    }
    catch (error) {
        logger.error("Error getting usage data:", error);
        res.status(500).json({ error: "Failed to get usage data" });
    }
});
// Update usage count function
exports.updateUsageCount = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a;
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { userId, feature, increment = 1 } = req.body;
        if (!userId || !feature) {
            res.status(400).json({ error: "User ID and feature are required" });
            return;
        }
        const usageRef = db.collection("usage").doc(userId);
        const usageDoc = await usageRef.get();
        if (usageDoc.exists) {
            const currentData = usageDoc.data() || {};
            const currentFeatureCount = ((_a = currentData.features) === null || _a === void 0 ? void 0 : _a[feature]) || 0;
            const currentTotal = currentData.totalUsage || 0;
            await usageRef.update({
                totalUsage: currentTotal + increment,
                [`features.${feature}`]: currentFeatureCount + increment,
                lastUsed: new Date(),
                updatedAt: new Date()
            });
        }
        else {
            await usageRef.set({
                userId,
                totalUsage: increment,
                features: { [feature]: increment },
                lastUsed: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        logger.info("Usage count updated", { userId, feature, increment });
        res.status(200).json({
            success: true,
            message: "Usage count updated"
        });
    }
    catch (error) {
        logger.error("Error updating usage count:", error);
        res.status(500).json({ error: "Failed to update usage count" });
    }
});
//# sourceMappingURL=user-management.js.map