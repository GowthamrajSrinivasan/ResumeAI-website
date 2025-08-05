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

// Get comprehensive user profile function
export const getUserProfile = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId} = req.body;

    if (!userId) {
      res.status(400).json({error: "User ID is required"});
      return;
    }

    logger.info("Getting user profile", {userId});

    // Get user document from Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({error: "User not found"});
      return;
    }

    const userData = userDoc.data();
    
    // Get usage data
    const usageRef = db.collection("usage").doc(userId);
    const usageDoc = await usageRef.get();
    const usageData = usageDoc.exists ? usageDoc.data() : null;

    // Get recent activity
    const activityRef = db.collection("user_activity")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .limit(5);
    const activitySnapshot = await activityRef.get();
    const recentActivity = activitySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    }));

    // Get premium upgrade history
    const upgradesRef = db.collection("premiumUpgrades")
      .where("userId", "==", userId)
      .orderBy("upgradedAt", "desc")
      .limit(3);
    const upgradesSnapshot = await upgradesRef.get();
    const upgradeHistory = upgradesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      upgradedAt: (doc.data().upgradedAt || doc.data().createdAt).toDate()
    }));

    const userProfile = {
      // Basic user info
      uid: userData?.uid,
      userEmail: userData?.userEmail,
      userDetails: userData?.userDetails,
      displayName: userData?.userDetails?.displayName || userData?.displayName,
      photoURL: userData?.userDetails?.photoURL || userData?.photoURL,
      emailVerified: userData?.userDetails?.emailVerified || userData?.emailVerified,
      
      // Account timestamps
      createdAt: userData?.createdAt?.toDate(),
      updatedAt: userData?.updatedAt?.toDate(),
      lastLoginAt: userData?.lastLoginAt?.toDate(),
      
      // Premium status
      isPremium: userData?.isPremium || false,
      planType: userData?.planType || 'free',
      premiumStartDate: userData?.premiumStartDate?.toDate(),
      premiumEndDate: userData?.premiumEndDate?.toDate(),
      subscriptionStatus: userData?.subscriptionStatus || 'active',
      
      // Payment info
      lastPaymentId: userData?.lastPaymentId,
      lastOrderId: userData?.lastOrderId,
      
      // Usage data
      usage: {
        totalUsage: usageData?.totalUsage || 0,
        monthlyUsage: usageData?.monthlyUsage || 0,
        lastUsed: usageData?.lastUsed?.toDate(),
        quotaLimit: usageData?.quotaLimit || (userData?.isPremium ? -1 : 5),
        quotaReset: usageData?.quotaReset?.toDate()
      },
      
      // Activity and history
      recentActivity: recentActivity,
      upgradeHistory: upgradeHistory,
      
      // Provider data
      providerData: userData?.providerData || [],
      
      // Extension data (if available)
      extensionInstalled: userData?.extensionInstalled || false,
      lastExtensionSync: userData?.lastExtensionSync?.toDate()
    };

    logger.info("User profile retrieved successfully", {userId, isPremium: userProfile.isPremium});
    res.status(200).json({
      success: true,
      userProfile: userProfile
    });
  } catch (error) {
    logger.error("Error getting user profile:", error);
    res.status(500).json({error: "Failed to get user profile"});
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
    const {userId, userEmail, paymentId, orderId, planType, paymentDetails} = req.body;

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
      upgradedAt: now,
      createdAt: now,
      // Include payment details for billing history
      amount: paymentDetails?.amount || 999,
      currency: paymentDetails?.currency || "INR",
      formattedAmount: paymentDetails?.formattedAmount,
      pricingSource: paymentDetails?.pricingSource
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

// Cancel subscription handler
export const cancelSubscription = onRequest({
  cors: true
}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, reason} = req.body;

    if (!userId) {
      res.status(400).json({error: "User ID is required"});
      return;
    }

    logger.info("Cancelling subscription", {userId, reason});

    // Update user document to mark subscription as cancelled
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({error: "User not found"});
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      res.status(404).json({error: "User data not found"});
      return;
    }

    const now = new Date();
    const premiumEndDate = userData.premiumEndDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await userRef.update({
      subscriptionStatus: "cancelled",
      cancelledAt: now,
      cancellationReason: reason || "User requested",
      // Keep premium access until end of billing period
      premiumEndDate: premiumEndDate,
      updatedAt: now
    });

    // Log the cancellation
    await db.collection("subscriptionCancellations").add({
      userId: userId,
      userEmail: userData.userEmail,
      cancelledAt: now,
      reason: reason || "User requested",
      planType: userData.planType || "premium",
      originalStartDate: userData.premiumStartDate,
      accessEndsAt: premiumEndDate
    });

    logger.info("Subscription cancelled successfully", {userId});
    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      accessEndsAt: premiumEndDate
    });
  } catch (error) {
    logger.error("Error cancelling subscription:", error);
    res.status(500).json({error: "Failed to cancel subscription"});
  }
});

// Get billing history handler
export const getBillingHistory = onRequest({
  cors: true
}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, limit = 10} = req.body;

    if (!userId) {
      res.status(400).json({error: "User ID is required"});
      return;
    }

    logger.info("Getting billing history", {userId, limit});

    // Get premium upgrades (payments) for this user
    const upgradesRef = db.collection("premiumUpgrades")
      .where("userId", "==", userId)
      .orderBy("upgradedAt", "desc")
      .limit(limit);

    const upgradesSnapshot = await upgradesRef.get();
    const billingHistory = upgradesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: (data.upgradedAt || data.createdAt).toDate(),
        amount: data.amount || 999, // Default amount if not stored
        currency: data.currency || "INR",
        status: "paid",
        description: `${data.planType || "Premium"} Plan`,
        paymentId: data.paymentId,
        orderId: data.orderId,
        formattedAmount: data.formattedAmount
      };
    });

    logger.info("Retrieved billing history", {userId, count: billingHistory.length});
    res.status(200).json({
      success: true,
      billingHistory: billingHistory
    });
  } catch (error) {
    logger.error("Error getting billing history:", error);
    res.status(500).json({error: "Failed to get billing history"});
  }
});

// Update subscription plan handler
export const updateSubscriptionPlan = onRequest({
  cors: true
}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, newPlanType, paymentId, orderId} = req.body;

    if (!userId || !newPlanType) {
      res.status(400).json({error: "User ID and new plan type are required"});
      return;
    }

    logger.info("Updating subscription plan", {userId, newPlanType});

    // Update user document
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({error: "User not found"});
      return;
    }

    const now = new Date();
    await userRef.update({
      planType: newPlanType,
      lastPlanChange: now,
      lastPaymentId: paymentId,
      lastOrderId: orderId,
      updatedAt: now
    });

    // Log the plan change
    await db.collection("planChanges").add({
      userId: userId,
      userEmail: userDoc.data()?.userEmail,
      oldPlan: userDoc.data()?.planType,
      newPlan: newPlanType,
      changedAt: now,
      paymentId: paymentId,
      orderId: orderId
    });

    logger.info("Subscription plan updated successfully", {userId, newPlanType});
    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully"
    });
  } catch (error) {
    logger.error("Error updating subscription plan:", error);
    res.status(500).json({error: "Failed to update subscription plan"});
  }
});