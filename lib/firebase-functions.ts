// Firebase Functions configuration
// TODO: Replace 'your-project-id' with your actual Firebase project ID
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id';
const FIREBASE_REGION = 'us-central1';

const FUNCTIONS_BASE_URL = `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

export const FIREBASE_FUNCTIONS = {
  // Contact functions
  contact: `${FUNCTIONS_BASE_URL}/contact`,
  sendWelcomeEmail: `${FUNCTIONS_BASE_URL}/sendWelcomeEmail`,
  waitlist: `${FUNCTIONS_BASE_URL}/waitlist`,
  
  // Payment functions
  createOrder: `${FUNCTIONS_BASE_URL}/createOrder`,
  verifyPayment: `${FUNCTIONS_BASE_URL}/verifyPayment`,
  paymentWebhook: `${FUNCTIONS_BASE_URL}/webhook`,
  paymentTest: `${FUNCTIONS_BASE_URL}/paymentTest`,
} as const;

export default FIREBASE_FUNCTIONS;