# Razorpay Payment Gateway Integration

This document outlines the Razorpay payment gateway integration for the Requill application.

## Overview

The integration includes:
- Server-side order creation and verification
- Client-side payment component
- Webhook handling for payment events
- Success and failure page handling
- Secure transaction processing

## Files Created/Modified

### 1. Environment Configuration
- **File**: `.env`
- **Variables Added**:
  ```bash
  RAZORPAY_KEY_ID=YOUR_KEY_ID
  RAZORPAY_SECRET=YOUR_SECRET
  RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
  NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_KEY_ID
  ```

### 2. API Endpoints

#### Create Order Endpoint
- **File**: `app/api/payment/create-order/route.ts`
- **Purpose**: Creates Razorpay orders for payment processing
- **Features**:
  - Amount validation (minimum ₹1.00)
  - Currency support (default: INR)
  - Receipt generation
  - Error handling with proper status codes

#### Payment Verification Endpoint  
- **File**: `app/api/payment/verify/route.ts`
- **Purpose**: Verifies payment signatures for security
- **Features**:
  - HMAC SHA256 signature verification
  - Payment status validation
  - Success/failure response handling

#### Webhook Handler
- **File**: `app/api/payment/webhook/route.ts`
- **Purpose**: Handles Razorpay webhook events
- **Events Supported**:
  - `payment.captured` - Payment successful
  - `payment.failed` - Payment failed
  - `order.paid` - Order fully paid
  - `payment.authorized` - Payment authorized
  - `refund.created` - Refund processed

### 3. Client Components

#### Payment Button Component
- **File**: `components/PaymentButton.tsx`
- **Features**:
  - Dynamic amount and plan handling
  - Razorpay checkout integration
  - Loading states
  - Error handling
  - Automatic redirect to success/failure pages

#### Success Page
- **File**: `app/payment/success/page.tsx`
- **Features**:
  - Payment confirmation display
  - Payment details showing
  - Navigation to dashboard

#### Failure Page
- **File**: `app/payment/failed/page.tsx`
- **Features**:
  - Error message display
  - Retry payment option
  - Contact support link

### 4. Modified Files

#### Pricing Page
- **File**: `app/pricing/page.tsx`
- **Changes**:
  - Imported PaymentButton component
  - Replaced Pro plan button with PaymentButton
  - Integrated with annual/monthly pricing logic

## Setup Instructions

### 1. Install Dependencies
```bash
npm install razorpay
```

### 2. Configure Environment Variables
Replace the placeholder values in `.env` with your actual Razorpay credentials:
- Get your Key ID and Secret from Razorpay Dashboard
- Create a webhook secret for secure webhook handling

### 3. Webhook Configuration
In your Razorpay Dashboard:
1. Go to Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events to listen for
4. Use the webhook secret in your environment variables

## Security Features

### 1. Server-Side Validation
- All payment creation and verification happens server-side
- Environment variables are properly secured
- Input validation for all API endpoints

### 2. Signature Verification
- HMAC SHA256 signature verification for payments
- Webhook signature validation
- Protection against replay attacks

### 3. Error Handling
- Comprehensive error responses
- Proper HTTP status codes
- Client-side error boundaries

## Usage Example

```tsx
import PaymentButton from "../components/PaymentButton";

// In your component
<PaymentButton
  amount={99.99}
  planName="Pro"
  planType="monthly"
  className="payment-button"
>
  Subscribe Now
</PaymentButton>
```

## Testing

### Test Mode
- Use Razorpay test credentials for development
- Test with different payment methods
- Verify webhook delivery and handling

### Production Checklist
- [ ] Replace test credentials with live credentials
- [ ] Update webhook URLs to production domain
- [ ] Test webhook delivery in production
- [ ] Verify SSL certificate is valid
- [ ] Test payment flow end-to-end

## Supported Payment Methods

Razorpay supports:
- Credit/Debit Cards (Visa, MasterCard, American Express, RuPay)
- Net Banking (50+ banks)
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Wallets (Paytm, Mobikwik, etc.)
- EMI options
- International cards

## Error Codes

Common error responses:
- `BAD_REQUEST_ERROR` - Invalid request parameters
- `GATEWAY_ERROR` - Payment gateway issues
- `INTERNAL_ERROR` - Server-side errors
- `NETWORK_ERROR` - Network connectivity issues

## Support

For Razorpay-specific issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For implementation issues:
- Check console logs for detailed error messages
- Verify environment variables are correctly set
- Ensure webhook endpoints are accessible