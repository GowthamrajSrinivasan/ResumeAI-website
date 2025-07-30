import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";

const db = getFirestore();

// Get dashboard data function
export const getDashboard = onRequest({cors: true}, async (req, res) => {
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

    logger.info("Getting dashboard data", {userId});

    // Get user data
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
    const recentActivity = activitySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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
        displayName: userData.userDetails?.displayName || null,
        photoURL: userData.userDetails?.photoURL || null,
        lastLoginAt: userData.lastLoginAt,
        createdAt: userData.createdAt
      },
      usage: usageData,
      analytics,
      recentActivity,
      summary: {
        totalActions: usageData?.totalUsage || 0,
        featuresUsed: Object.keys(usageData?.features || {}).length,
        lastActive: usageData?.lastUsed || userData?.lastLoginAt
      }
    };

    res.status(200).json({
      success: true,
      dashboard: dashboardData
    });

  } catch (error) {
    logger.error("Error getting dashboard data:", error);
    res.status(500).json({error: "Failed to get dashboard data"});
  }
});