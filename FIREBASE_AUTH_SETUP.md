# Firebase Authentication Setup

## Error: `auth/operation-not-allowed`

This error means **Email/Password authentication is not enabled** in your Firebase project. Here's how to fix it:

## Steps to Enable Email/Password Authentication

### 1. Go to Firebase Console
- Visit [Firebase Console](https://console.firebase.google.com)
- Select your project (`executivesai-website`)

### 2. Enable Authentication
- In the left sidebar, click **"Authentication"**
- Click **"Get started"** if this is your first time

### 3. Configure Sign-in Methods
- Click the **"Sign-in method"** tab
- Find **"Email/Password"** in the list
- Click on it
- Toggle **"Enable"** to ON
- Click **"Save"**

### 4. Enable Google Sign-in
- In the same "Sign-in method" tab
- Find **"Google"** in the list
- Click on it
- Toggle **"Enable"** to ON
- Enter your **Project support email** (required)
- Click **"Save"**


### 5. Optional: Enable Email Link Sign-in
- While in Email/Password settings, you can also enable **"Email link (passwordless sign-in)"**
- This is optional but provides a better user experience

### 6. Configure Authorized Domains (if needed)
- In the same "Sign-in method" tab
- Scroll down to **"Authorized domains"**
- Make sure your domain is listed (localhost should already be there for development)
- Add your production domain when deploying

## Additional Security Settings

### Password Requirements
- Minimum length: 6 characters (Firebase default)
- You can enforce stronger passwords in your application logic

### Account Protection
- Consider enabling **"Email enumeration protection"** in Authentication settings
- This prevents attackers from discovering registered email addresses

## Testing the Fix

After enabling Email/Password authentication:

1. Save the changes in Firebase Console
2. Go back to your application
3. Try to sign up with a new account
4. The error should be resolved

## Environment Variables

Make sure your `.env` file has the correct Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Common Issues

### Still getting the error?
- Double-check that you clicked "Save" in Firebase Console
- Wait a few minutes for changes to propagate
- Clear your browser cache and try again

### Google Sign-in Issues

#### "Google authentication is not enabled"
- Make sure you enabled Google in the Sign-in method tab
- Verify you provided a support email address
- Check that the status shows "Enabled"

#### "Popup blocked by browser"
- Allow popups for your site in browser settings
- Try disabling popup blockers temporarily
- Make sure you're not in incognito/private mode

#### "An account already exists with the same email"
- This happens when someone signed up with email/password using the same email as their Google account
- Users can link accounts or use password reset to access the existing account

### Can't find Authentication in Firebase Console?
- Make sure you're in the correct Firebase project
- Authentication should be in the left sidebar under "Build"

### Need help finding your config values?
- In Firebase Console: Project Settings → General → Your apps
- Copy the config object from there