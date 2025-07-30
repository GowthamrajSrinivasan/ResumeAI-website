"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupMetrics = exports.cleanupBehaviorData = exports.healthCheck = void 0;
const https_1 = require("firebase-functions/v2/https");
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
//# sourceMappingURL=maintenance.js.map