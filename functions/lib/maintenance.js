"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledSubscriptionCheck = exports.checkExpiredSubscriptions = exports.cleanupMetrics = exports.cleanupBehaviorData = exports.healthCheck = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
// Health check function
exports.healthCheck = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        // Check Firestore connection
        const testRef = db.collection("health_check").doc("test");
        await testRef.set({
            timestamp: new Date(),
            status: "healthy"
        });
        // Get system status
        const systemStatus = {
            timestamp: new Date().toISOString(),
            status: "healthy",
            services: {
                firestore: "connected",
                functions: "running",
                authentication: "active"
            },
            version: "1.0.0",
            uptime: process.uptime()
        };
        logger.info("Health check completed", systemStatus);
        res.status(200).json(Object.assign({ success: true }, systemStatus));
    }
    catch (error) {
        logger.error("Health check failed:", error);
        res.status(500).json({
            success: false,
            status: "unhealthy",
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
    }
});
// Cleanup behavior data function
exports.cleanupBehaviorData = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { daysOld = 30, batchSize = 100 } = req.body;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        logger.info("Starting behavior data cleanup", { daysOld, cutoffDate });
        // Clean up old behavior tracking data
        const behaviorRef = db.collection("user_behavior")
            .where("timestamp", "<", cutoffDate)
            .limit(batchSize);
        const snapshot = await behaviorRef.get();
        let deletedCount = 0;
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
            deletedCount++;
        });
        if (deletedCount > 0) {
            await batch.commit();
        }
        // Clean up old session data
        const sessionRef = db.collection("user_sessions")
            .where("endedAt", "<", cutoffDate)
            .limit(batchSize);
        const sessionSnapshot = await sessionRef.get();
        let sessionDeletedCount = 0;
        if (!sessionSnapshot.empty) {
            const sessionBatch = db.batch();
            sessionSnapshot.docs.forEach(doc => {
                sessionBatch.delete(doc.ref);
                sessionDeletedCount++;
            });
            await sessionBatch.commit();
        }
        logger.info("Behavior data cleanup completed", {
            behaviorRecordsDeleted: deletedCount,
            sessionRecordsDeleted: sessionDeletedCount
        });
        res.status(200).json({
            success: true,
            cleanup: {
                behaviorRecordsDeleted: deletedCount,
                sessionRecordsDeleted: sessionDeletedCount,
                cutoffDate: cutoffDate.toISOString()
            }
        });
    }
    catch (error) {
        logger.error("Error during behavior data cleanup:", error);
        res.status(500).json({ error: "Failed to cleanup behavior data" });
    }
});
// Cleanup metrics function
exports.cleanupMetrics = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const { daysOld = 90, batchSize = 100 } = req.body;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        logger.info("Starting metrics cleanup", { daysOld, cutoffDate });
        // Clean up old metrics data
        const metricsRef = db.collection("metrics")
            .where("timestamp", "<", cutoffDate)
            .limit(batchSize);
        const snapshot = await metricsRef.get();
        let deletedCount = 0;
        if (!snapshot.empty) {
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
                deletedCount++;
            });
            await batch.commit();
        }
        // Clean up old analytics data
        const analyticsRef = db.collection("daily_analytics")
            .where("date", "<", cutoffDate)
            .limit(batchSize);
        const analyticsSnapshot = await analyticsRef.get();
        let analyticsDeletedCount = 0;
        if (!analyticsSnapshot.empty) {
            const analyticsBatch = db.batch();
            analyticsSnapshot.docs.forEach(doc => {
                analyticsBatch.delete(doc.ref);
                analyticsDeletedCount++;
            });
            await analyticsBatch.commit();
        }
        logger.info("Metrics cleanup completed", {
            metricsDeleted: deletedCount,
            analyticsDeleted: analyticsDeletedCount
        });
        res.status(200).json({
            success: true,
            cleanup: {
                metricsDeleted: deletedCount,
                analyticsDeleted: analyticsDeletedCount,
                cutoffDate: cutoffDate.toISOString()
            }
        });
    }
    catch (error) {
        logger.error("Error during metrics cleanup:", error);
        res.status(500).json({ error: "Failed to cleanup metrics" });
    }
});
// Check and expire premium subscriptions
exports.checkExpiredSubscriptions = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    try {
        const now = new Date();
        logger.info("Starting subscription expiry check", { timestamp: now.toISOString() });
        // Query users whose subscriptions have expired
        const usersRef = db.collection("users");
        const expiredQuery = usersRef
            .where("isPremium", "==", true)
            .where("subscriptionEnd", "<=", now);
        const snapshot = await expiredQuery.get();
        let expiredCount = 0;
        const expiredUsers = [];
        if (!snapshot.empty) {
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                const userData = doc.data();
                const userRef = doc.ref;
                // Update user to non-premium status
                batch.update(userRef, {
                    isPremium: false,
                    subscriptionStatus: "expired",
                    expiredAt: now,
                    updatedAt: now
                });
                expiredUsers.push({
                    userId: doc.id,
                    userEmail: userData.userEmail,
                    subscriptionType: userData.subscriptionType || 'unknown',
                    subscriptionEnd: userData.subscriptionEnd
                });
                expiredCount++;
            });
            // Commit the batch update
            await batch.commit();
            // Log expired subscriptions for record keeping
            if (expiredUsers.length > 0) {
                const expiredSubscriptionsRef = db.collection("expired_subscriptions");
                const expiryBatch = db.batch();
                expiredUsers.forEach(user => {
                    const docRef = expiredSubscriptionsRef.doc();
                    expiryBatch.set(docRef, Object.assign(Object.assign({}, user), { expiredAt: now, processedAt: now }));
                });
                await expiryBatch.commit();
            }
        }
        logger.info("Subscription expiry check completed", {
            expiredCount,
            processedAt: now.toISOString()
        });
        res.status(200).json({
            success: true,
            expiredSubscriptions: expiredCount,
            processedAt: now.toISOString(),
            expiredUsers: expiredUsers.map(u => ({
                userId: u.userId,
                subscriptionType: u.subscriptionType
            }))
        });
    }
    catch (error) {
        logger.error("Error checking expired subscriptions:", error);
        res.status(500).json({
            error: "Failed to check expired subscriptions",
            timestamp: new Date().toISOString()
        });
    }
});
// Scheduled function to automatically check expired subscriptions daily
exports.scheduledSubscriptionCheck = (0, scheduler_1.onSchedule)({
    schedule: "0 2 * * *", // Run at 2 AM every day
    timeZone: "UTC"
}, async (event) => {
    try {
        logger.info("Running scheduled subscription expiry check");
        const now = new Date();
        // Query users whose subscriptions have expired
        const usersRef = db.collection("users");
        const expiredQuery = usersRef
            .where("isPremium", "==", true)
            .where("subscriptionEnd", "<=", now);
        const snapshot = await expiredQuery.get();
        let expiredCount = 0;
        const expiredUsers = [];
        if (!snapshot.empty) {
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                const userData = doc.data();
                const userRef = doc.ref;
                // Update user to non-premium status
                batch.update(userRef, {
                    isPremium: false,
                    subscriptionStatus: "expired",
                    expiredAt: now,
                    updatedAt: now
                });
                expiredUsers.push({
                    userId: doc.id,
                    userEmail: userData.userEmail,
                    subscriptionType: userData.subscriptionType || 'unknown',
                    subscriptionEnd: userData.subscriptionEnd
                });
                expiredCount++;
            });
            // Commit the batch update
            await batch.commit();
            // Log expired subscriptions for record keeping
            if (expiredUsers.length > 0) {
                const expiredSubscriptionsRef = db.collection("expired_subscriptions");
                const expiryBatch = db.batch();
                expiredUsers.forEach(user => {
                    const docRef = expiredSubscriptionsRef.doc();
                    expiryBatch.set(docRef, Object.assign(Object.assign({}, user), { expiredAt: now, processedAt: now, processedBy: "scheduled_function" }));
                });
                await expiryBatch.commit();
            }
        }
        logger.info("Scheduled subscription expiry check completed", {
            expiredCount,
            processedAt: now.toISOString()
        });
        // Scheduled functions don't return values
        logger.info("Scheduled function completed successfully", {
            expiredSubscriptions: expiredCount,
            processedAt: now.toISOString()
        });
    }
    catch (error) {
        logger.error("Error in scheduled subscription check:", error);
        throw error;
    }
});
//# sourceMappingURL=maintenance.js.map