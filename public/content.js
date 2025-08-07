// content.js - Chrome Extension Content Script
// This script runs on executivesai.pro to listen for login success messages and handle data requests

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  
  console.log("📨 Content script received message from website:", event.data);
  
  // Handle LOGIN_SUCCESS messages
  if (event.data?.source === "REQUILL_EXTENSION" && event.data?.type === "LOGIN_SUCCESS") {
    console.log("Content script received LOGIN_SUCCESS:", event.data);

    // Send UID to background for storage
    chrome.runtime.sendMessage({
      type: "STORE_LOGIN_DATA",
      uid: event.data.uid
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background:", chrome.runtime.lastError);
      } else {
        console.log("Successfully sent UID to background script");
      }
    });
  }
  
  // Handle SET_USER_ID messages
  if (event.data?.type === "SET_USER_ID") {
    console.log("Content script received SET_USER_ID:", event.data);

    // Send UID to background for storage
    chrome.runtime.sendMessage({
      type: "STORE_LOGIN_DATA",
      uid: event.data.uid
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background:", chrome.runtime.lastError);
      } else {
        console.log("Successfully sent UID to background script");
      }
    });
  }
  
  // Note: This content script is injected by the website, not the Chrome extension
  // The actual Chrome extension handles GET_UID and CHECK_EXTENSION_STATUS requests
  // This file is just for website-side communication bridge
});

console.log("Content script loaded and listening for website messages");