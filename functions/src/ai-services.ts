import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";

const db = getFirestore();

// Generate reply function
export const generateReply = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {prompt, context, userId, tone = "professional"} = req.body;

    if (!prompt || !userId) {
      res.status(400).json({error: "Prompt and user ID are required"});
      return;
    }

    logger.info("Generating reply", {userId, tone, promptLength: prompt.length});

    // Placeholder AI reply generation
    // In a real implementation, this would call an AI service like OpenAI
    const generatedReply = `Thank you for your message. ${prompt.includes("meeting") ? 
      "I'd be happy to discuss this further in a meeting." : 
      "I appreciate you reaching out and would love to connect."} Looking forward to hearing from you.`;

    // Store the generation in usage tracking
    await db.collection("ai_generations").add({
      userId,
      prompt,
      reply: generatedReply,
      tone,
      context: context || null,
      timestamp: new Date(),
      type: "reply_generation"
    });

    res.status(200).json({
      success: true,
      reply: generatedReply,
      metadata: {
        tone,
        wordCount: generatedReply.split(" ").length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error("Error generating reply:", error);
    res.status(500).json({error: "Failed to generate reply"});
  }
});

// Process queue function (for batch processing)
export const processQueue = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {queueType = "default", batchSize = 10} = req.body;

    logger.info("Processing queue", {queueType, batchSize});

    // Get items from queue
    const queueRef = db.collection("processing_queue")
      .where("status", "==", "pending")
      .where("queueType", "==", queueType)
      .limit(batchSize);

    const snapshot = await queueRef.get();
    const processed = [];

    for (const doc of snapshot.docs) {
      const queueItem = doc.data();
      
      try {
        // Process the queue item based on type
        let result;
        switch (queueItem.taskType) {
          case "analyze_post":
            // Process post analysis
            result = {status: "completed", processedAt: new Date()};
            break;
          case "generate_content":
            // Process content generation
            result = {status: "completed", processedAt: new Date()};
            break;
          default:
            result = {status: "skipped", reason: "Unknown task type"};
        }

        // Update queue item
        await doc.ref.update({
          ...result,
          updatedAt: new Date()
        });

        processed.push({
          id: doc.id,
          taskType: queueItem.taskType,
          result
        });

      } catch (itemError) {
        logger.error("Error processing queue item:", itemError);
        await doc.ref.update({
          status: "failed",
          error: itemError instanceof Error ? itemError.message : String(itemError),
          updatedAt: new Date()
        });
      }
    }

    res.status(200).json({
      success: true,
      processed: processed.length,
      items: processed
    });

  } catch (error) {
    logger.error("Error processing queue:", error);
    res.status(500).json({error: "Failed to process queue"});
  }
});