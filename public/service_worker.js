// service_worker.js - Chrome Extension Service Worker (Manifest V3)
// This is the Manifest V3 version of background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_LOGIN_DATA") {
    console.log("Service worker storing login data:", {
      uid: message.uid,
      idToken: message.idToken ? `${message.idToken.substring(0, 20)}...` : 'null'
    });

    // Store UID in chrome.storage.sync for cross-device sync
    // Store idToken in chrome.storage.local for session-based, temporary storage
    const syncData = {
      uid: message.uid
    };
    
    const localData = {
      idToken: message.idToken
    };

    // Use Promise.all to handle both storage operations
    Promise.all([
      chrome.storage.sync.set(syncData).then(() => {
        console.log("✅ UID stored in chrome.storage.sync for cross-device sync");
      }).catch((error) => {
        console.error("Error storing UID in sync storage:", error);
        throw error;
      }),
      chrome.storage.local.set(localData).then(() => {
        console.log("✅ idToken stored in chrome.storage.local for session-based storage");
      }).catch((error) => {
        console.error("Error storing idToken in local storage:", error);
        throw error;
      })
    ]).then(() => {
      console.log("✅ All login data stored successfully");
      sendResponse({ success: true });
    }).catch((error) => {
      console.error("❌ Error storing login data:", error);
      sendResponse({ success: false, error: error.message });
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }

  // Handle other message types if needed
  if (message.type === "GET_LOGIN_DATA") {
    // Retrieve stored login data
    Promise.all([
      chrome.storage.sync.get(['uid']),
      chrome.storage.local.get(['idToken'])
    ]).then(([syncResult, localResult]) => {
      sendResponse({
        uid: syncResult.uid,
        idToken: localResult.idToken
      });
    }).catch((error) => {
      console.error("Error retrieving login data:", error);
      sendResponse({ error: error.message });
    });
    return true;
  }

  if (message.type === "CLEAR_LOGIN_DATA") {
    // Clear stored login data
    Promise.all([
      chrome.storage.sync.remove(['uid']).then(() => {
        console.log("✅ UID cleared from chrome.storage.sync");
      }),
      chrome.storage.local.remove(['idToken']).then(() => {
        console.log("✅ idToken cleared from chrome.storage.local");
      })
    ]).then(() => {
      console.log("✅ All login data cleared successfully");
      sendResponse({ success: true });
    }).catch((error) => {
      console.error("Error clearing login data:", error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

console.log("Service worker loaded and ready to handle login data");