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
                case 'ID_TOKEN_RESPONSE':
                    this.handleIdTokenResponse(event.data.idToken);
                    break;
                case 'ID_TOKEN_SET_RESPONSE':
                    this.handleIdTokenSetResponse(event.data.success);
                    break;
                case 'ID_TOKEN_CLEARED_RESPONSE':
                    this.handleIdTokenClearedResponse(event.data.success);
                    break;
                case 'EXTENSION_STATUS_RESPONSE':
                    this.handleExtensionStatusResponse(event.data);
                    break;
            }
        });
    }

    // Send idToken to extension after user login
    setIdToken(idToken, userData = null) {
        console.log('Website sending idToken to extension:', idToken ? `${idToken.substring(0, 20)}...` : 'null');
        window.postMessage({
            type: 'SET_ID_TOKEN',
            idToken: idToken,
            userData: userData
        }, '*');
    }

    // Request idToken from extension
    getIdToken() {
        console.log('Website requesting idToken from extension');
        window.postMessage({
            type: 'GET_ID_TOKEN'
        }, '*');
    }

    // Clear idToken from extension (logout)
    clearIdToken() {
        console.log('Website clearing idToken from extension');
        window.postMessage({
            type: 'CLEAR_ID_TOKEN'
        }, '*');
    }

    // Check if extension is available
    checkExtensionStatus() {
        console.log('Website checking extension status');
        window.postMessage({
            type: 'CHECK_EXTENSION_STATUS'
        }, '*');
    }

    // Send legacy REQUILL_LOGIN message
    sendRequillLogin(idToken) {
        console.log('Website sending REQUILL_LOGIN message');
        window.postMessage({
            type: 'REQUILL_LOGIN',
            idToken: idToken
        }, '*');
    }

    // Handle responses
    handleIdTokenResponse(idToken) {
        if (idToken) {
            console.log('✅ Extension has idToken:', idToken ? `${idToken.substring(0, 20)}...` : 'null');
            // User is logged in to extension
            this.onExtensionAuthenticated?.(idToken);
        } else {
            console.log('ℹ️ Extension does not have idToken');
            // User is not logged in to extension
            this.onExtensionUnauthenticated?.();
        }
    }

    handleIdTokenSetResponse(success) {
        if (success) {
            console.log('✅ idToken successfully stored in extension');
            this.onIdTokenStored?.();
        } else {
            console.log('❌ Failed to store idToken in extension');
            this.onIdTokenStoreFailed?.();
        }
    }

    handleIdTokenClearedResponse(success) {
        if (success) {
            console.log('✅ idToken successfully cleared from extension');
            this.onIdTokenCleared?.();
        } else {
            console.log('❌ Failed to clear idToken from extension');
            this.onIdTokenClearFailed?.();
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
        this.getIdToken();
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
    window.handleFirebaseLoginSuccess = function(user, idToken) {
        console.log('Firebase login successful, integrating with extension...');
        
        // Prepare user data for extension
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };

        // Send to extension (idToken will be stored in chrome.storage.local by extension)
        window.extensionComm.setIdToken(idToken, userData);
        window.extensionComm.sendRequillLogin(idToken);
        
        // Store in Firestore (implement your Firestore logic here)
        console.log('Store user data in Firestore:', userData);
        
        // Note: uid is stored in chrome.storage.sync for cross-device sync
        console.log('UID will be stored in chrome.storage.sync by extension');
    };

    // Example: Firebase logout
    window.handleFirebaseLogout = function() {
        console.log('Firebase logout, clearing extension data...');
        
        // Clear from extension
        window.extensionComm.clearIdToken();
    };
}

// Initialize Firebase integration
integrateWithFirebaseAuth();

console.log('Extension communication script loaded successfully');