// background.js - Chrome Extension Background Script (Manifest V2)
// For Manifest V3, rename this to service_worker.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_LOGIN_DATA") {
    console.log("Background script storing login data:", {
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
      new Promise((resolve, reject) => {
        chrome.storage.sync.set(syncData, () => {
          if (chrome.runtime.lastError) {
            console.error("Error storing UID in sync storage:", chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log("✅ UID stored in chrome.storage.sync for cross-device sync");
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        chrome.storage.local.set(localData, () => {
          if (chrome.runtime.lastError) {
            console.error("Error storing idToken in local storage:", chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log("✅ idToken stored in chrome.storage.local for session-based storage");
            resolve();
          }
        });
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
    chrome.storage.sync.get(['uid'], (syncResult) => {
      chrome.storage.local.get(['idToken'], (localResult) => {
        sendResponse({
          uid: syncResult.uid,
          idToken: localResult.idToken
        });
      });
    });
    return true;
  }

  if (message.type === "CLEAR_LOGIN_DATA") {
    // Clear stored login data
    Promise.all([
      new Promise((resolve) => {
        chrome.storage.sync.remove(['uid'], () => {
          console.log("✅ UID cleared from chrome.storage.sync");
          resolve();
        });
      }),
      new Promise((resolve) => {
        chrome.storage.local.remove(['idToken'], () => {
          console.log("✅ idToken cleared from chrome.storage.local");
          resolve();
        });
      })
    ]).then(() => {
      console.log("✅ All login data cleared successfully");
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log("Background script loaded and ready to handle login data");