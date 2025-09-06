# Referral Tracking Testing Guide

## How to Test the Referral Functionality

### 1. Test URLs to Try

After deploying your changes, test these URLs:

```
# Direct visit (no referral)
https://yourdomain.com/

# With LinkedIn influencer referral
https://yourdomain.com/?ref=linkedin_john_smith
https://yourdomain.com/?ref=linkedin_jane_doe  
https://yourdomain.com/?ref=influencer_mike
https://yourdomain.com/?ref=social_media_sarah
```

### 2. Testing Steps

1. **Open your browser's Developer Tools** (F12)
2. **Go to Console tab** to see debug logs
3. **Visit a referral URL** (e.g., `https://yourdomain.com/?ref=linkedin_john_smith`)
4. **Enter an email** in the waitlist form
5. **Submit the form**
6. **Check the console logs** - you should see:
   ```
   ✅ Email submitted to waitlist via Google Sheets {email: "test@example.com", referralSource: "linkedin_john_smith"}
   ```
7. **Check your Google Sheet** - the new row should contain:
   - Email: test@example.com
   - Referral Source: linkedin_john_smith
   - Timestamp: 2025-01-23T10:30:00.000Z
   - Submitted At: formatted date

### 3. Test Edge Cases

- **Direct visit** (no referral parameter): Should show `referralSource: "direct"`
- **Invalid referral**: URLs with empty ref parameter should default to "direct"
- **Navigation persistence**: After visiting with `?ref=test`, navigate to other pages and back - referral should persist in sessionStorage

### 4. LinkedIn Influencer Referral Links

Create personalized referral links for your LinkedIn influencers:

```
John Smith (LinkedIn): https://yourdomain.com/?ref=linkedin_john_smith
Jane Marketing: https://yourdomain.com/?ref=linkedin_jane_marketing
Tech Guru Mike: https://yourdomain.com/?ref=linkedin_tech_mike
Business Leader Sarah: https://yourdomain.com/?ref=linkedin_sarah_business
```

### 5. Google Sheet Verification

Your Google Sheet should now have these columns:
1. **Email** - The email address submitted
2. **Referral Source** - The LinkedIn influencer identifier (or "direct")  
3. **Timestamp** - ISO timestamp when submitted
4. **Submitted At** - Human-readable date/time

### 6. Analytics & Tracking

You can now:
- **Track which influencers** are driving the most signups
- **Measure conversion rates** per referral source
- **Reward top-performing influencers** based on signup data
- **A/B test different referral incentives**

### 7. Troubleshooting

If referral tracking isn't working:
1. Check browser console for errors
2. Verify Google Apps Script is updated with new code
3. Ensure Google Sheet permissions are correct
4. Test with different browsers/incognito mode