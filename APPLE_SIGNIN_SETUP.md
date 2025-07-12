# Apple Sign-in Setup Guide

## Overview

Apple Sign-in requires additional configuration beyond Firebase. This guide will help you set up Apple authentication for production use.

## Prerequisites

- Apple Developer account ($99/year)
- Firebase project with Apple authentication enabled
- Domain name for your website

## Step 1: Apple Developer Console Setup

### 1.1 Create an App ID
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **App IDs**
4. Click the **+** button to create a new App ID
5. Select **App** and click **Continue**
6. Fill in the details:
   - **Description**: Your app name (e.g., "LinkedIn AI Assistant")
   - **Bundle ID**: Use explicit (e.g., `com.yourcompany.linkedinai`)
7. Under **Capabilities**, check **Sign In with Apple**
8. Click **Continue** and **Register**

### 1.2 Create a Services ID
1. Still in **Identifiers**, click the **+** button
2. Select **Services IDs** and click **Continue**
3. Fill in the details:
   - **Description**: Your service name (e.g., "LinkedIn AI Assistant Web")
   - **Identifier**: Different from App ID (e.g., `com.yourcompany.linkedinai.web`)
4. Click **Continue** and **Register**
5. Click on your newly created Services ID
6. Check **Sign In with Apple** and click **Configure**
7. Add your domains and URLs:
   - **Primary App ID**: Select the App ID created in step 1.1
   - **Web Domain**: Your website domain (e.g., `yourapp.com`)
   - **Return URLs**: Add your Firebase redirect URL:
     ```
     https://your-project-id.firebaseapp.com/__/auth/handler
     ```
8. Click **Save** and **Continue**

### 1.3 Create a Private Key
1. Go to **Certificates, Identifiers & Profiles** → **Keys**
2. Click the **+** button
3. Enter a **Key Name** (e.g., "Sign in with Apple Key")
4. Check **Sign In with Apple** and click **Configure**
5. Select your **Primary App ID** from step 1.1
6. Click **Save** and **Continue**
7. Click **Register**
8. **Download the key file (.p8)** - You can only download this once!
9. Note the **Key ID** displayed

## Step 2: Firebase Configuration

### 2.1 Configure Apple Provider in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Apple**
5. Toggle **Enable** to ON
6. Fill in the required information:
   - **Services ID**: From step 1.2 (e.g., `com.yourcompany.linkedinai.web`)
   - **Apple Team ID**: Found in your Apple Developer account membership details
   - **Key ID**: From step 1.3
   - **Private Key**: Copy the contents of the .p8 file from step 1.3
7. Click **Save**

### 2.2 Update Authorized Domains
1. In the same **Sign-in method** tab
2. Scroll down to **Authorized domains**
3. Add your production domain if not already present
4. Make sure `localhost` is included for development

## Step 3: Testing

### Development Testing
- Apple Sign-in will work on `localhost` for development
- Use a real Apple ID to test the flow

### Production Testing
- Deploy your app to your configured domain
- Test the complete sign-in flow
- Verify user data is correctly received

## Troubleshooting

### Common Issues

#### "Invalid client"
- Check that your Services ID matches exactly in Firebase
- Verify the Return URL is correct in Apple Developer Console

#### "Invalid request"
- Ensure your domain is properly configured in Apple Developer Console
- Check that the domain matches your Firebase hosting domain

#### "Key not found"
- Verify the Key ID is correct in Firebase
- Check that the private key content is copied correctly (including headers and footers)

#### "Team ID mismatch"
- Find your Team ID in Apple Developer Console → Membership
- Update the Team ID in Firebase configuration

### Apple Developer Account Required

Apple Sign-in **requires a paid Apple Developer account** for production use. The free Apple ID cannot be used to configure Sign in with Apple for web applications.

## Cost Considerations

- **Apple Developer Account**: $99/year (required)
- **Firebase**: Free tier available, paid tiers for higher usage
- **Domain**: Cost varies by provider

## Alternative Approach

If you don't have an Apple Developer account, consider:
1. **Remove Apple Sign-in** from your app temporarily
2. **Focus on Google and Email/Password** authentication first
3. **Add Apple Sign-in** once you have the Apple Developer account

## Support

For Apple-specific issues:
- [Apple Developer Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [Firebase Apple Sign-in Documentation](https://firebase.google.com/docs/auth/web/apple)

For Firebase issues:
- [Firebase Support](https://firebase.google.com/support)