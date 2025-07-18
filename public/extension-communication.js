/**
 * Extension Communication Script
 * Include this script in HTML pages to enable communication with Chrome extension
 */

class ExtensionCommunication {
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        // Listen for responses from the extension
        window.addEventListener('message', (event) => {
            // Verify the message is from our extension's content script
            if (event.source !== window) return;

            console.log('Website received message from extension:', event.data);

            switch (event.data.type) {
                case 'UID_RESPONSE':
                    this.handleUidResponse(event.data.uid);
                    break;
                case 'UID_SET_RESPONSE':
                    this.handleUidSetResponse(event.data.success);
                    break;
                case 'UID_CLEARED_RESPONSE':
                    this.handleUidClearedResponse(event.data.success);
                    break;
                case 'EXTENSION_STATUS_RESPONSE':
                    this.handleExtensionStatusResponse(event.data);
                    break;
            }
        });
    }

    // Send uid to extension after user login
    setUid(uid, userData = null) {
        console.log('Website sending uid to extension:', uid);
        window.postMessage({
            type: 'SET_UID',
            uid: uid,
            userData: userData
        }, '*');
    }

    // Request uid from extension
    getUid() {
        console.log('Website requesting uid from extension');
        window.postMessage({
            type: 'GET_UID'
        }, '*');
    }

    // Clear uid from extension (logout)
    clearUid() {
        console.log('Website clearing uid from extension');
        window.postMessage({
            type: 'CLEAR_UID'
        }, '*');
    }

    // Check if extension is available
    checkExtensionStatus() {
        console.log('Website checking extension status');
        window.postMessage({
            type: 'CHECK_EXTENSION_STATUS'
        }, '*');
    }

    // Send REQUILL_LOGIN message with uid
    sendRequillLogin(uid) {
        console.log('Website sending REQUILL_LOGIN message');
        window.postMessage({
            type: 'REQUILL_LOGIN',
            uid: uid
        }, '*');
    }

    // Handle responses
    handleUidResponse(uid) {
        if (uid) {
            console.log('✅ Extension has uid:', uid);
            // User is logged in to extension
            this.onExtensionAuthenticated?.(uid);
        } else {
            console.log('ℹ️ Extension does not have uid');
            // User is not logged in to extension
            this.onExtensionUnauthenticated?.();
        }
    }

    handleUidSetResponse(success) {
        if (success) {
            console.log('✅ uid successfully stored in extension');
            this.onUidStored?.();
        } else {
            console.log('❌ Failed to store uid in extension');
            this.onUidStoreFailed?.();
        }
    }

    handleUidClearedResponse(success) {
        if (success) {
            console.log('✅ uid successfully cleared from extension');
            this.onUidCleared?.();
        } else {
            console.log('❌ Failed to clear uid from extension');
            this.onUidClearFailed?.();
        }
    }

    handleExtensionStatusResponse(data) {
        console.log('Extension status:', data);
        if (data.available) {
            console.log('✅ Extension is available and active');
            this.onExtensionAvailable?.(data);
        } else {
            console.log('ℹ️ Extension is not available');
            this.onExtensionUnavailable?.();
        }
    }

    // Initialize extension communication
    initialize() {
        console.log('Initializing extension communication...');
        
        // Check if extension is available
        this.checkExtensionStatus();
        
        // Check if user is already logged in to extension
        this.getUid();
    }
}

// Create global instance
window.extensionComm = new ExtensionCommunication();

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing extension communication...');
    window.extensionComm.initialize();
});

// Example integration with Firebase Auth
function integrateWithFirebaseAuth() {
    // Example: After Firebase login success
    window.handleFirebaseLoginSuccess = function(user) {
        console.log('Firebase login successful, integrating with extension...');
        
        // Prepare user data for extension
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };

        // Send to extension (uid will be stored in chrome.storage.sync by extension)
        window.extensionComm.setUid(user.uid, userData);
        window.extensionComm.sendRequillLogin(user.uid);
        
        // Store in Firestore (implement your Firestore logic here)
        console.log('Store user data in Firestore:', userData);
        
        // Note: uid is stored in chrome.storage.sync for cross-device sync
        console.log('UID will be stored in chrome.storage.sync by extension');
    };

    // Example: Firebase logout
    window.handleFirebaseLogout = function() {
        console.log('Firebase logout, clearing extension data...');
        
        // Clear from extension
        window.extensionComm.clearUid();
    };
}

// Initialize Firebase integration
integrateWithFirebaseAuth();

console.log('Extension communication script loaded successfully');