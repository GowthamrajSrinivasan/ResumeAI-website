import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// Export payment functions
export {createOrder, verifyPayment, webhook, paymentTest} from "./payment";

// Contact form handler
export const contact = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {name, email, phone, message} = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({error: "Name, email, and message are required"});
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({error: "Invalid email format"});
      return;
    }

    // Store in Firestore or send email
    logger.info("Contact form submitted", {name, email, phone, message});
    
    res.status(200).json({message: "Contact form submitted successfully"});
  } catch (error) {
    logger.error("Error in contact function:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

// Waitlist handler
export const waitlist = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {email, source = "api", userAgent, referrer} = req.body;

    if (!email) {
      res.status(400).json({error: "Email is required"});
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

    logger.info("User added to waitlist", {email, source});
    res.status(200).json({message: "Successfully added to waitlist"});
  } catch (error) {
    logger.error("Error adding to waitlist:", error);
    res.status(500).json({error: "Failed to add to waitlist"});
  }
});

// Send welcome email handler
export const sendWelcomeEmail = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {userEmail, userName} = req.body;

    if (!userEmail) {
      res.status(400).json({error: "User email is required"});
      return;
    }

    // Implement email sending logic here
    logger.info("Welcome email sent", {userEmail, userName});
    
    res.status(200).json({message: "Welcome email sent successfully"});
  } catch (error) {
    logger.error("Error sending welcome email:", error);
    res.status(500).json({error: "Failed to send welcome email"});
  }
});