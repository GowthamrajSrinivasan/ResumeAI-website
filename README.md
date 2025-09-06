# ResumeAI Website

A Next.js application for AI-powered LinkedIn assistance with job tracking capabilities.

## Features

- 🎯 **Job Tracking Dashboard** - Track and manage job applications with status indicators
- 📊 **Statistics Overview** - Visual overview of application progress  
- 🔍 **Search & Filter** - Find applications by company, title, or status
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔐 **Firebase Authentication** - Secure user management
- ⚡ **Real-time Updates** - Sync data across devices

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/GowthamrajSrinivasan/ResumeAI-website.git
   cd ResumeAI-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **View the application**
   - Main app: http://localhost:3000
   - Job Tracker Demo: http://localhost:3000/test-jobs
   - Dashboard (login required): http://localhost:3000/dashboard

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

### Firebase Configuration (Required)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Email Service (ZeptoMail)
```env
ZEPTO_MAIL_API_KEY=
ZEPTO_MAIL_FROM_EMAIL=
ZEPTO_MAIL_FROM_NAME=
```

### Payment Integration (Razorpay)
```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

## Deployment

### Environment Setup for Production

**For Vercel:**
1. Add environment variables in the Vercel dashboard
2. Deploy from GitHub repository

**For Netlify:**
1. Add environment variables in site settings
2. Deploy from GitHub repository

**For other platforms:**
- Ensure all environment variables are properly set
- The app gracefully handles missing Firebase configuration

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password and Google Sign-in
3. Create a Firestore database
4. Copy the configuration values to your `.env` file

## Job Tracker Features

### Dashboard Overview
- Total applications count
- Applications by status (Applied, In Review, Interviews, Offers, Rejected)
- Color-coded status indicators

### Job Management
- Add new job applications
- Update application status
- Add notes and priorities
- View detailed job information
- Track application dates

### Sample Data
The job tracker includes sample data with:
- Senior Frontend Developer (Interview Scheduled)
- Full Stack Engineer (In Review)
- Product Manager (Offer Received)
- UX Designer (Rejected)
- DevOps Engineer (Applied)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # User dashboard
│   ├── test-jobs/        # Job tracker demo
│   └── page.tsx          # Landing page
├── components/            # React components
│   └── JobTracker.tsx    # Job tracking dashboard
├── hooks/                # Custom React hooks
│   └── useAuth.ts        # Authentication hook
├── lib/                  # Utility libraries
│   └── firebase.ts       # Firebase configuration
└── functions/            # Firebase cloud functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the environment setup

## License

This project is proprietary software. All rights reserved.