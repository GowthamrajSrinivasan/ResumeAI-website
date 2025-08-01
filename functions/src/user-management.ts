import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";

const db = getFirestore();

// Check user by email function
export const checkUserByEmail = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {email} = req.body;

    if (!email) {
      res.status(400).json({error: "Email is required"});
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
    } else {
      const userData = snapshot.docs[0].data();
      res.status(200).json({
        exists: true,
        user: {
          uid: userData.uid,
          email: userData.userEmail,
          displayName: userData.userDetails?.displayName || null,
          lastLoginAt: userData.lastLoginAt,
          createdAt: userData.createdAt
        }
      });
    }

    logger.info("User check completed", {email, exists: !snapshot.empty});
  } catch (error) {
    logger.error("Error checking user:", error);
    res.status(500).json({error: "Failed to check user"});
  }
});

// Get user usage data function
export const getUserUsageData = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({error: "User ID is required"});
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
    } else {
      const usageData = usageDoc.data();
      res.status(200).json({
        userId,
        ...usageData
      });
    }

    logger.info("Usage data retrieved", {userId});
  } catch (error) {
    logger.error("Error getting usage data:", error);
    res.status(500).json({error: "Failed to get usage data"});
  }
});

// Update usage count function
export const updateUsageCount = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, feature, increment = 1} = req.body;

    if (!userId || !feature) {
      res.status(400).json({error: "User ID and feature are required"});
      return;
    }

    const usageRef = db.collection("usage").doc(userId);
    const usageDoc = await usageRef.get();

    if (usageDoc.exists) {
      const currentData = usageDoc.data() || {};
      const currentFeatureCount = currentData.features?.[feature] || 0;
      const currentTotal = currentData.totalUsage || 0;

      await usageRef.update({
        totalUsage: currentTotal + increment,
        [`features.${feature}`]: currentFeatureCount + increment,
        lastUsed: new Date(),
        updatedAt: new Date()
      });
    } else {
      await usageRef.set({
        userId,
        totalUsage: increment,
        features: {[feature]: increment},
        lastUsed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    logger.info("Usage count updated", {userId, feature, increment});
    res.status(200).json({
      success: true,
      message: "Usage count updated"
    });
  } catch (error) {
    logger.error("Error updating usage count:", error);
    res.status(500).json({error: "Failed to update usage count"});
  }
});

// Upgrade user to premium function
export const upgradeToPremium = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, userEmail, paymentId, orderId, planType} = req.body;

    if (!userId || !userEmail) {
      res.status(400).json({error: "User ID and email are required"});
      return;
    }

    logger.info("Upgrading user to premium", {userId, userEmail, paymentId, orderId, planType});

    // Update user document in Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({error: "User not found"});
      return;
    }

    // Calculate subscription end date
    const now = new Date();
    const subscriptionEnd = new Date();
    if (planType === 'annual') {
      subscriptionEnd.setFullYear(now.getFullYear() + 1);
    } else {
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
      createdAt: now
    });

    logger.info("User upgraded to premium successfully", {userId, userEmail, planType});
    res.status(200).json({
      success: true,
      message: "User upgraded to premium successfully",
      subscriptionEnd: subscriptionEnd.toISOString()
    });
  } catch (error) {
    logger.error("Error upgrading user to premium:", error);
    res.status(500).json({error: "Failed to upgrade user to premium"});
  }
});