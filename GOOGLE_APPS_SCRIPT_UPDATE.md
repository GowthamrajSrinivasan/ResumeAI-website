# Updated Google Apps Script for Referral Tracking

Please update your Google Apps Script with the following code to support referral tracking:

## Updated Script Code

```javascript
function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    const referralSource = data.referralSource || 'direct';
    const timestamp = data.timestamp || new Date().toISOString();
    const submittedAt = data.submittedAt || Date.now();
    
    // Open the Google Sheet
    // Replace 'YOUR_SHEET_ID' with your actual Google Sheet ID
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    
    // Check if this is the first entry and add headers if needed
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Email', 'Referral Source', 'Timestamp', 'Submitted At']]);
    }
    
    // Add the new row with all the data
    sheet.appendRow([
      email,
      referralSource,
      timestamp,
      new Date(submittedAt)
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email added to waitlist successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Waitlist API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## How to Update Your Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Open your existing waitlist script project
3. Replace the existing code with the code above
4. Make sure to replace `'YOUR_SHEET_ID'` with your actual Google Sheet ID
5. Save the project
6. If needed, redeploy the script as a web app

## Your Google Sheet Structure

After the update, your Google Sheet will have these columns:
- **Column A**: Email
- **Column B**: Referral Source (will show the LinkedIn influencer's identifier)
- **Column C**: Timestamp (ISO format)
- **Column D**: Submitted At (formatted date/time)

## Referral Link Format for LinkedIn Influencers

Share these referral links with your LinkedIn influencers:

```
https://yourdomain.com/?ref=influencer1
https://yourdomain.com/?ref=influencer2
https://yourdomain.com/?ref=linkedin_john_doe
```

When someone clicks on these links and joins the waitlist, the referral source will be captured automatically.