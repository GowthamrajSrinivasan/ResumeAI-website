# Firebase Hosting Deployment Guide

This guide will help you deploy your ResumeAI website to Firebase Hosting with automatic GitHub Actions deployment.

## Prerequisites

1. **Firebase CLI** installed globally
2. **Firebase project** (`resume-ai-6aaaf`) with Hosting enabled
3. **GitHub repository** with proper secrets configured
4. **Node.js 18+** installed locally

## Quick Setup Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Verify Project Configuration
```bash
firebase projects:list
# Should show resume-ai-6aaaf as your project
```

## Manual Deployment

### Build and Deploy Locally
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Firebase Hosting
npm run deploy

# Or deploy everything (hosting + functions)
npm run deploy:all
```

### Deploy Functions Only
```bash
npm run deploy:functions
```

## GitHub Actions Automatic Deployment

### Required GitHub Secrets

You need to add these secrets to your GitHub repository:

#### 1. Firebase Service Account Key
```
Secret Name: FIREBASE_SERVICE_ACCOUNT_RESUME_AI_6AAAF
Value: [Firebase Service Account JSON - see steps below]
```

#### 2. Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAjni7hjvLY0xQMLJF_3MuD3OX8HpELnN4"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "resume-ai-6aaaf.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID: "resume-ai-6aaaf"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "resume-ai-6aaaf.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "495891812861"
NEXT_PUBLIC_FIREBASE_APP_ID: "1:495891812861:web:74017bcbedcc100516c994"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-KFYFJMWG7M"
NEXT_PUBLIC_RAZORPAY_KEY_ID: [Your Razorpay Key ID]
```

### How to Get Firebase Service Account Key

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `resume-ai-6aaaf`
3. **Go to Project Settings** (gear icon)
4. **Service Accounts tab**
5. **Click "Generate new private key"**
6. **Download the JSON file**
7. **Copy the entire JSON content** and paste it as the secret value

### How to Add GitHub Secrets

1. **Go to your GitHub repository**: `https://github.com/GowthamrajSrinivasan/ResumeAI-website`
2. **Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add each secret** from the list above

## Deployment Workflow

### Automatic Deployments

The GitHub Actions workflow will automatically:

#### On Pull Requests:
- ✅ Build the application
- ✅ Deploy to Firebase Hosting **preview channel**
- ✅ Comment on PR with preview URL

#### On Push to Main:
- ✅ Build the application
- ✅ Deploy to Firebase Hosting **live channel**
- ✅ Update production website

### Manual Trigger
You can also manually trigger deployment:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Firebase Hosting**
3. Click **Run workflow**

## Configuration Files

### `firebase.json`
```json
{
  "functions": {
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"],
    "source": "functions"
  },
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `.firebaserc`
```json
{
  "projects": {
    "default": "resume-ai-6aaaf"
  }
}
```

### `next.config.js`
```javascript
const nextConfig = {
  output: 'export',           // Static export
  trailingSlash: true,        // Required for Firebase
  images: {
    unoptimized: true,        // Required for static export
  }
}
```

## Build Process

### Local Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates static files in `/out` directory
```

### Preview Build
```bash
npm run preview
# Serves the built `/out` directory locally
```

## Troubleshooting

### Common Issues

#### 1. Build Fails - Environment Variables Missing
**Solution**: Ensure all Firebase environment variables are set in GitHub secrets

#### 2. Firebase CLI Not Authenticated
```bash
firebase logout
firebase login
```

#### 3. Wrong Firebase Project
```bash
firebase use resume-ai-6aaaf
```

#### 4. Deployment Permissions Error
**Solution**: Regenerate Firebase service account key and update GitHub secret

#### 5. Next.js Build Errors
**Solution**: Test build locally first:
```bash
npm run build
npm run preview
```

### Debug Deployment

#### Check Firebase Project
```bash
firebase projects:list
firebase use --list
```

#### Test Local Build
```bash
npm run build
ls -la out/
```

#### Check GitHub Actions Logs
1. Go to **Actions** tab in GitHub
2. Click on latest deployment
3. Check logs for errors

## URLs After Deployment

### Production
- **Live Site**: `https://resume-ai-6aaaf.web.app`
- **Custom Domain** (if configured): Your custom domain

### Preview (for PRs)
- **Preview URL**: Automatically generated and commented on PR

## Security Notes

1. **Environment Variables**: All sensitive data should be in GitHub secrets, not in code
2. **Firebase Rules**: Ensure Firestore security rules are properly configured
3. **API Keys**: Only client-side Firebase config should be in environment variables
4. **Service Account**: Keep the Firebase service account JSON secure

## Monitoring

### Check Deployment Status
```bash
firebase hosting:sites:list
```

### View Deployment History
- Firebase Console → Hosting → View deployment history

### Monitor Performance
- Firebase Console → Performance
- Google Analytics (if configured)

## Custom Domain Setup (Optional)

If you want to use a custom domain:

1. **Firebase Console** → **Hosting**
2. **Add custom domain**
3. **Follow DNS configuration steps**
4. **SSL certificates** will be automatically provisioned

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review Firebase Console logs
3. Test local build first
4. Verify all secrets are correctly set

**Firebase Project**: `resume-ai-6aaaf`  
**GitHub Repository**: `GowthamrajSrinivasan/ResumeAI-website`