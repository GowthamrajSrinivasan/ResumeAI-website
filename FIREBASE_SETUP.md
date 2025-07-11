# Firebase Deployment Setup Instructions

## Prerequisites
1. Firebase CLI installed (`npm install -g firebase-tools`)
2. Firebase project created at https://console.firebase.google.com
3. GitHub repository with proper secrets configured

## Firebase Service Account Setup

### Step 1: Generate Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`executivesai-website`)
3. Click the gear icon → Project Settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Download the JSON file (keep it secure!)

### Step 2: Add GitHub Repository Secret
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT_EXECUTIVESAI_WEBSITE`
5. Value: Copy the entire contents of the downloaded JSON file
6. Click "Add secret"

### Step 3: Update Project Configuration
If your Firebase project ID is different from `executivesai-website`, update:

**firebase.json:**
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "package.json",
      "package-lock.json",
      "README.md",
      "LoginSignup.jsx"
    ],
    "rewrites": [
      {
        "source": "/",
        "destination": "/landing.html"
      },
      {
        "source": "/login",
        "destination": "/index.html"
      }
    ]
  }
}
```

**GitHub Actions workflows:**
- Update `projectId: your-actual-project-id` in both workflow files
- Update secret name if needed: `FIREBASE_SERVICE_ACCOUNT_YOUR_PROJECT_ID`

## Error Resolution

### "Input required and not supplied: firebaseServiceAccount"
This error occurs when:
1. The GitHub secret is not set up properly
2. Secret name doesn't match the workflow file
3. Secret value is empty or invalid

**Solution:**
1. Verify secret name matches exactly: `FIREBASE_SERVICE_ACCOUNT_EXECUTIVESAI_WEBSITE`
2. Ensure secret value contains valid JSON from Firebase
3. Check that the secret is available in the repository (not organization-level)

### "Error: HTTP Error: 403, The caller does not have permission"
This error occurs when:
1. Service account doesn't have proper permissions
2. Firebase project ID is incorrect

**Solution:**
1. In Firebase Console → Project Settings → Service accounts
2. Ensure the service account has "Firebase Admin SDK Admin" role
3. Verify project ID matches your actual Firebase project

## Local Development
```bash
# Install dependencies
npm install

# Run locally
npm start

# Test Firebase deployment locally
firebase serve --only hosting
```

## Deployment
Push to `main` or `master` branch to trigger automatic deployment.

## URLs After Deployment
- Landing page: `https://your-project-id.web.app/`
- Login page: `https://your-project-id.web.app/login`