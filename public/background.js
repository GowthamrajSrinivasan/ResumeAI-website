// background.js - Chrome Extension Background Script (Manifest V2)
// For Manifest V3, rename this to service_worker.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_LOGIN_DATA") {
    console.log("Background script storing login data:", {
      uid: message.uid
    });

    // Store only UID in chrome.storage.sync for cross-device sync
    const syncData = {
      uid: message.uid
    };

    // Store UID in chrome.storage.sync
    chrome.storage.sync.set(syncData, () => {
      if (chrome.runtime.lastError) {
        console.error("Error storing UID in sync storage:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log("✅ UID stored in chrome.storage.sync for cross-device sync");
        sendResponse({ success: true });
      }
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }

  // Handle other message types if needed
  if (message.type === "GET_LOGIN_DATA") {
    // Retrieve stored UID
    chrome.storage.sync.get(['uid'], (syncResult) => {
      sendResponse({
        uid: syncResult.uid
      });
    });
    return true;
  }

  if (message.type === "CLEAR_LOGIN_DATA") {
    // Clear stored UID
    chrome.storage.sync.remove(['uid'], () => {
      console.log("✅ UID cleared from chrome.storage.sync");
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log("Background script loaded and ready to handle UID data");