// Firebase Functions configuration
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'linkedin-ai-8fa59';
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
  
  // Analytics functions
  trackEvent: `${FUNCTIONS_BASE_URL}/trackEvent`,
  trackPageView: `${FUNCTIONS_BASE_URL}/trackPageView`,
  analyzePost: `${FUNCTIONS_BASE_URL}/analyzePost`,
  analyzeProfile: `${FUNCTIONS_BASE_URL}/analyzeProfile`,
  
  // User management functions
  checkUserByEmail: `${FUNCTIONS_BASE_URL}/checkUserByEmail`,
  getUserProfile: `${FUNCTIONS_BASE_URL}/getUserProfile`,
  getUserUsageData: `${FUNCTIONS_BASE_URL}/getUserUsageData`,
  updateUsageCount: `${FUNCTIONS_BASE_URL}/updateUsageCount`,
  upgradeToPremium: `${FUNCTIONS_BASE_URL}/upgradeToPremium`,
  cancelSubscription: `${FUNCTIONS_BASE_URL}/cancelSubscription`,
  getBillingHistory: `${FUNCTIONS_BASE_URL}/getBillingHistory`,
  updateSubscriptionPlan: `${FUNCTIONS_BASE_URL}/updateSubscriptionPlan`,
  
  // AI services functions
  generateReply: `${FUNCTIONS_BASE_URL}/generateReply`,
  processQueue: `${FUNCTIONS_BASE_URL}/processQueue`,
  
  // Dashboard functions
  getDashboard: `${FUNCTIONS_BASE_URL}/getDashboard`,
  
  // Maintenance functions
  healthCheck: `${FUNCTIONS_BASE_URL}/healthCheck`,
  cleanupBehaviorData: `${FUNCTIONS_BASE_URL}/cleanupBehaviorData`,
  cleanupMetrics: `${FUNCTIONS_BASE_URL}/cleanupMetrics`,
} as const;

export default FIREBASE_FUNCTIONS;