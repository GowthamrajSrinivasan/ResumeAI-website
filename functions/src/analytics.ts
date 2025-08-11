import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";

const db = getFirestore();

// Track event function for extension usage
export const trackEvent = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, eventName, eventData, timestamp} = req.body;

    if (!userId || !eventName) {
      res.status(400).json({error: "userId and eventName are required"});
      return;
    }

    logger.info("Tracking event", {userId, eventName, eventData});

    // Store event in user_activity collection
    await db.collection("user_activity").add({
      userId,
      eventName,
      eventData: eventData || {},
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date(),
      source: "extension"
    });

    // Update usage count for specific features
    if (eventName.includes("usage") || eventName.includes("feature")) {
      const usageRef = db.collection("usage").doc(userId);
      const usageDoc = await usageRef.get();

      if (usageDoc.exists) {
        const currentData = usageDoc.data() || {};
        const currentTotal = currentData.totalUsage || 0;
        const featureName = eventData?.feature || eventName;
        const currentFeatureCount = currentData.features?.[featureName] || 0;

        await usageRef.update({
          totalUsage: currentTotal + 1,
          [`features.${featureName}`]: currentFeatureCount + 1,
          lastUsed: new Date(),
          updatedAt: new Date()
        });
      } else {
        const featureName = eventData?.feature || eventName;
        await usageRef.set({
          userId,
          totalUsage: 1,
          features: {[featureName]: 1},
          lastUsed: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Event tracked successfully"
    });
  } catch (error) {
    logger.error("Error tracking event:", error);
    res.status(500).json({error: "Failed to track event"});
  }
});

// Track page view function for extension
export const trackPageView = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userId, page, url, timestamp} = req.body;

    if (!userId || !page) {
      res.status(400).json({error: "userId and page are required"});
      return;
    }

    logger.info("Tracking page view", {userId, page, url});

    // Store page view in user_activity collection
    await db.collection("user_activity").add({
      userId,
      eventName: "page_view",
      eventData: {
        page,
        url: url || null
      },
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date(),
      source: "extension"
    });

    res.status(200).json({
      success: true,
      message: "Page view tracked successfully"
    });
  } catch (error) {
    logger.error("Error tracking page view:", error);
    res.status(500).json({error: "Failed to track page view"});
  }
});

// Analyze post function
export const analyzePost = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {postContent, userId} = req.body;

    if (!postContent || !userId) {
      res.status(400).json({error: "Missing required fields"});
      return;
    }

    // Post analysis logic would go here
    logger.info("Analyzing post", {userId, contentLength: postContent.length});
    
    // Placeholder analysis result
    const analysisResult = {
      sentiment: "positive",
      engagement_score: 0.8,
      topics: ["professional", "networking"],
      suggestions: ["Add more hashtags", "Include call to action"]
    };

    res.status(200).json({
      success: true,
      analysis: analysisResult
    });
  } catch (error) {
    logger.error("Error analyzing post:", error);
    res.status(500).json({error: "Failed to analyze post"});
  }
});

// Analyze profile function
export const analyzeProfile = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {profileData, userId} = req.body;

    if (!profileData || !userId) {
      res.status(400).json({error: "Missing required fields"});
      return;
    }

    logger.info("Analyzing profile", {userId});
    
    // Placeholder profile analysis
    const profileAnalysis = {
      completeness_score: 0.85,
      keyword_optimization: 0.7,
      suggestions: [
        "Add more skills to your profile",
        "Update your headline to be more specific",
        "Add recent work experience"
      ]
    };

    res.status(200).json({
      success: true,
      analysis: profileAnalysis
    });
  } catch (error) {
    logger.error("Error analyzing profile:", error);
    res.status(500).json({error: "Failed to analyze profile"});
  }
});