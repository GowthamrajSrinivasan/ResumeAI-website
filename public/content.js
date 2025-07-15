// content.js - Chrome Extension Content Script
// This script runs on executivesai.pro to listen for login success messages

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  
  // Listen for the specific REQUILL_EXTENSION login success message
  if (event.data?.source !== "REQUILL_EXTENSION" || event.data?.type !== "LOGIN_SUCCESS") return;

  console.log("Content script received LOGIN_SUCCESS:", event.data);

  // Send UID and ID token to background for storage
  chrome.runtime.sendMessage({
    type: "STORE_LOGIN_DATA",
    uid: event.data.uid,
    idToken: event.data.idToken
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message to background:", chrome.runtime.lastError);
    } else {
      console.log("Successfully sent login data to background script");
    }
  });
});

console.log("Content script loaded and listening for LOGIN_SUCCESS messages");