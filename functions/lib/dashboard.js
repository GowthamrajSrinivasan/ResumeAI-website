"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
// Get dashboard data function
exports.getDashboard = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a, _b;
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
        logger.info("Getting dashboard data", { userId });
        // Get user data
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const userData = userDoc.data();
        if (!userData) {
            res.status(404).json({ error: "User data not found" });
            return;
        }
        // Get usage data
        const usageRef = db.collection("usage").doc(userId);
        const usageDoc = await usageRef.get();
        const usageData = usageDoc.exists ? usageDoc.data() : {
            totalUsage: 0,
            features: {},
            lastUsed: null
        };
        // Get recent activity
        const activityRef = db.collection("user_activity")
            .where("userId", "==", userId)
            .orderBy("timestamp", "desc")
            .limit(10);
        const activitySnapshot = await activityRef.get();
        const recentActivity = activitySnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Get analytics summary
        const analyticsRef = db.collection("user_analytics").doc(userId);
        const analyticsDoc = await analyticsRef.get();
        const analytics = analyticsDoc.exists ? analyticsDoc.data() : {
            postsAnalyzed: 0,
            repliesGenerated: 0,
            profileScore: 0,
            engagementRate: 0
        };
        const dashboardData = {
            user: {
                uid: userData.uid,
                email: userData.userEmail,
                displayName: ((_a = userData.userDetails) === null || _a === void 0 ? void 0 : _a.displayName) || null,
                photoURL: ((_b = userData.userDetails) === null || _b === void 0 ? void 0 : _b.photoURL) || null,
                lastLoginAt: userData.lastLoginAt,
                createdAt: userData.createdAt
            },
            usage: usageData,
            analytics,
            recentActivity,
            summary: {
                totalActions: (usageData === null || usageData === void 0 ? void 0 : usageData.totalUsage) || 0,
                featuresUsed: Object.keys((usageData === null || usageData === void 0 ? void 0 : usageData.features) || {}).length,
                lastActive: (usageData === null || usageData === void 0 ? void 0 : usageData.lastUsed) || (userData === null || userData === void 0 ? void 0 : userData.lastLoginAt)
            }
        };
        res.status(200).json({
            success: true,
            dashboard: dashboardData
        });
    }
    catch (error) {
        logger.error("Error getting dashboard data:", error);
        res.status(500).json({ error: "Failed to get dashboard data" });
    }
});
//# sourceMappingURL=dashboard.js.map