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
                    this.handleUidResponse(event.data);
                    break;
                case 'USER_ID_SET_RESPONSE':
                    this.handleUserIdSetResponse(event.data.success);
                    break;
                case 'USER_ID_CLEARED_RESPONSE':
                    this.handleUserIdClearedResponse(event.data.success);
                    break;
                case 'EXTENSION_HEARTBEAT':
                    this.handleExtensionHeartbeat(event.data);
                    break;
                case 'EXTENSION_PRESENCE_RESPONSE':
                    this.handleExtensionPresenceResponse(event.data);
                    break;
                case 'REQUILL_LOGIN_RESPONSE':
                    this.handleRequillLoginResponse(event.data);
                    break;
            }
        });
    }

    // Send user ID to extension after user login
    setUid(uid, userData = null) {
        console.log('Website sending user ID to extension:', uid);
        window.postMessage({
            type: 'SET_USER_ID',
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

    // Clear user ID from extension (logout)
    clearUid() {
        console.log('Website clearing user ID from extension');
        window.postMessage({
            type: 'CLEAR_USER_ID'
        }, '*');
    }

    // Send heartbeat to extension
    sendHeartbeat() {
        console.log('Website sending heartbeat to extension');
        window.postMessage({
            type: 'WEBSITE_HEARTBEAT_REQUEST',
            timestamp: Date.now()
        }, '*');
    }

    // Check if extension is present
    checkExtensionPresence() {
        console.log('Website checking extension presence');
        window.postMessage({
            type: 'WEBSITE_PRESENCE_CHECK',
            timestamp: Date.now()
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
    handleUidResponse(data) {
        const { uid, email, displayName, usageCount, isPremium, createdAt, lastUsageUpdate, personalization } = data;
        
        if (uid) {
            console.log('✅ Extension has uid:', uid);
            console.log('📊 User data from extension:', {
                email,
                displayName,
                usageCount: usageCount || 0,
                isPremium: isPremium || false,
                createdAt,
                lastUsageUpdate,
                personalization
            });
            
            // User is logged in to extension - pass complete data
            this.onExtensionAuthenticated?.(uid, {
                email,
                displayName,
                usageCount: usageCount || 0,
                isPremium: isPremium || false,
                createdAt,
                lastUsageUpdate,
                personalization
            });
        } else {
            console.log('ℹ️ Extension does not have uid');
            // User is not logged in to extension
            this.onExtensionUnauthenticated?.();
        }
    }

    handleUserIdSetResponse(success) {
        if (success) {
            console.log('✅ User ID successfully stored in extension');
            this.onUidStored?.();
        } else {
            console.log('❌ Failed to store User ID in extension');
            this.onUidStoreFailed?.();
        }
    }

    handleUserIdClearedResponse(success) {
        if (success) {
            console.log('✅ User ID successfully cleared from extension');
            this.onUidCleared?.();
        } else {
            console.log('❌ Failed to clear User ID from extension');
            this.onUidClearFailed?.();
        }
    }

    handleExtensionHeartbeat(data) {
        const { userId, timestamp, extensionVersion } = data;
        
        console.log('💓 Extension heartbeat received:', {
            userId: userId || 'No user logged in',
            timestamp: new Date(timestamp).toISOString(),
            extensionVersion
        });
        
        this.onExtensionHeartbeat?.({
            userId,
            timestamp,
            extensionVersion
        });
    }

    handleExtensionPresenceResponse(data) {
        const { userId, timestamp, extensionVersion, isInstalled } = data;
        
        console.log('Extension presence response:', {
            userId,
            timestamp,
            extensionVersion,
            isInstalled
        });
        
        if (isInstalled) {
            console.log('✅ Extension is present and responding');
            console.log('📊 Extension details:', {
                userId: userId || 'No user logged in',
                version: extensionVersion,
                timestamp: new Date(timestamp).toISOString()
            });
            
            this.onExtensionPresent?.({
                userId,
                timestamp,
                extensionVersion,
                isInstalled
            });
        } else {
            console.log('ℹ️ Extension is not present');
            this.onExtensionNotPresent?.();
        }
    }

    handleRequillLoginResponse(data) {
        console.log('Requill login response:', data);
        if (data.success) {
            console.log('✅ Requill login successful in extension');
            this.onRequillLoginSuccess?.(data);
        } else {
            console.log('❌ Requill login failed in extension');
            this.onRequillLoginFailed?.(data);
        }
    }

    // Initialize extension communication
    initialize() {
        console.log('Initializing extension communication...');
        
        // Check if extension is present
        this.checkExtensionPresence();
        
        // Check if user is already logged in to extension
        this.getUid();
        
        // Start heartbeat monitoring
        this.startHeartbeat();
    }

    // Start regular heartbeat with extension
    startHeartbeat() {
        // Send initial heartbeat
        this.sendHeartbeat();
        
        // Set up regular heartbeat interval (every 30 seconds)
        setInterval(() => {
            this.sendHeartbeat();
        }, 30000);
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