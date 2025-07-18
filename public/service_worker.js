// service_worker.js - Chrome Extension Service Worker (Manifest V3)
// This is the Manifest V3 version of background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_LOGIN_DATA") {
    console.log("Service worker storing login data:", {
      uid: message.uid
    });

    // Store only UID in chrome.storage.sync for cross-device sync
    const syncData = {
      uid: message.uid
    };

    // Store UID in chrome.storage.sync
    chrome.storage.sync.set(syncData).then(() => {
      console.log("✅ UID stored in chrome.storage.sync for cross-device sync");
      sendResponse({ success: true });
    }).catch((error) => {
      console.error("❌ Error storing UID:", error);
      sendResponse({ success: false, error: error.message });
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }

  // Handle other message types if needed
  if (message.type === "GET_LOGIN_DATA") {
    // Retrieve stored UID
    chrome.storage.sync.get(['uid']).then((syncResult) => {
      sendResponse({
        uid: syncResult.uid
      });
    }).catch((error) => {
      console.error("Error retrieving UID:", error);
      sendResponse({ error: error.message });
    });
    return true;
  }

  if (message.type === "CLEAR_LOGIN_DATA") {
    // Clear stored UID
    chrome.storage.sync.remove(['uid']).then(() => {
      console.log("✅ UID cleared from chrome.storage.sync");
      sendResponse({ success: true });
    }).catch((error) => {
      console.error("Error clearing UID:", error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

console.log("Service worker loaded and ready to handle UID data");