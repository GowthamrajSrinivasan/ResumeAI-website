// Debug environment variables
console.log('Environment variables:');
console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if running in browser
if (typeof window !== 'undefined') {
  console.log('Running in browser');
} else {
  console.log('Running in Node.js');
}