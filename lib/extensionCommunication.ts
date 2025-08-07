/**
 * ExtensionCommunication class for handling bidirectional communication
 * between the web app and Chrome extension
 */
export class ExtensionCommunication {
  private messageHandlers: { [key: string]: (data: any) => void } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupMessageListener();
    }
  }

  /**
   * Set up message listener for extension responses
   */
  setupMessageListener() {
    if (typeof window === 'undefined') return;
    
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

      // Call custom handlers if registered
      if (this.messageHandlers[event.data.type]) {
        this.messageHandlers[event.data.type](event.data);
      }
    });
  }

  /**
   * Register a custom message handler
   */
  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers[type] = handler;
  }

  /**
   * Send user ID to extension after user login
   */
  setUid(uid: string, userData: any = null) {
    if (typeof window === 'undefined') return;
    
    console.log('Website sending user ID to extension:', uid);
    window.postMessage({
      type: 'SET_USER_ID',
      uid: uid,
      userData: userData
    }, '*');
  }

  /**
   * Request uid from extension
   */
  getUid() {
    if (typeof window === 'undefined') return;
    
    console.log('Website requesting uid from extension');
    window.postMessage({
      type: 'GET_UID'
    }, '*');
  }

  /**
   * Clear user ID from extension (logout)
   */
  clearUid() {
    if (typeof window === 'undefined') return;
    
    console.log('Website clearing user ID from extension');
    window.postMessage({
      type: 'CLEAR_USER_ID'
    }, '*');
  }

  /**
   * Send heartbeat request to extension
   */
  sendHeartbeat() {
    if (typeof window === 'undefined') return;
    
    console.log('Website sending heartbeat to extension');
    window.postMessage({
      type: 'WEBSITE_HEARTBEAT_REQUEST',
      timestamp: Date.now()
    }, '*');
  }

  /**
   * Check if extension is present and responding
   */
  checkExtensionPresence() {
    if (typeof window === 'undefined') return;
    
    console.log('Website checking extension presence');
    window.postMessage({
      type: 'WEBSITE_PRESENCE_CHECK',
      timestamp: Date.now()
    }, '*');
  }

  /**
   * Send the REQUILL_LOGIN message with uid
   */
  sendRequillLogin(uid: string) {
    if (typeof window === 'undefined') return;
    
    console.log('Website sending REQUILL_LOGIN message');
    window.postMessage({
      type: 'REQUILL_LOGIN',
      uid: uid
    }, '*');
  }


  // Response handlers
  handleUidResponse(data: any) {
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
      this.onExtensionAuthenticated(uid, {
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
      this.onExtensionUnauthenticated();
    }
  }

  handleUserIdSetResponse(success: boolean) {
    if (success) {
      console.log('✅ User ID successfully stored in extension');
      this.onUidStored();
    } else {
      console.log('❌ Failed to store User ID in extension');
      this.onUidStoreFailed();
    }
  }

  handleUserIdClearedResponse(success: boolean) {
    if (success) {
      console.log('✅ User ID successfully cleared from extension');
      this.onUidCleared();
    } else {
      console.log('❌ Failed to clear User ID from extension');
      this.onUidClearFailed();
    }
  }

  handleExtensionHeartbeat(data: any) {
    const { userId, timestamp, extensionVersion } = data;
    
    console.log('💓 Extension heartbeat received:', {
      userId: userId || 'No user logged in',
      timestamp: new Date(timestamp).toISOString(),
      extensionVersion
    });
    
    this.onExtensionHeartbeat({
      userId,
      timestamp,
      extensionVersion
    });
  }

  handleExtensionPresenceResponse(data: any) {
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
      
      this.onExtensionPresent({
        userId,
        timestamp,
        extensionVersion,
        isInstalled
      });
    } else {
      console.log('ℹ️ Extension is not present');
      this.onExtensionNotPresent();
    }
  }

  handleRequillLoginResponse(data: any) {
    console.log('Requill login response:', data);
    if (data.success) {
      console.log('✅ Requill login successful in extension');
      this.onRequillLoginSuccess(data);
    } else {
      console.log('❌ Requill login failed in extension');
      this.onRequillLoginFailed(data);
    }
  }

  // Override these methods for custom behavior
  onExtensionAuthenticated(uid: string, userData?: {
    email?: string;
    displayName?: string;
    usageCount?: number;
    isPremium?: boolean;
    createdAt?: string;
    lastUsageUpdate?: string;
    personalization?: any;
  }) {
    // Override in implementation
  }

  onExtensionUnauthenticated() {
    // Override in implementation
  }

  onUidStored() {
    // Override in implementation
  }

  onUidStoreFailed() {
    // Override in implementation
  }

  onUidCleared() {
    // Override in implementation
  }

  onUidClearFailed() {
    // Override in implementation
  }

  onExtensionHeartbeat(data: {
    userId?: string;
    timestamp?: number;
    extensionVersion?: string;
  }) {
    // Override in implementation
  }

  onExtensionPresent(data: {
    userId?: string;
    timestamp?: number;
    extensionVersion?: string;
    isInstalled?: boolean;
  }) {
    // Override in implementation
  }

  onExtensionNotPresent() {
    // Override in implementation
  }

  onRequillLoginSuccess(data: any) {
    // Override in implementation
  }

  onRequillLoginFailed(data: any) {
    // Override in implementation
  }

  /**
   * Initialize extension communication and check status
   */
  initialize() {
    console.log('Initializing extension communication...');
    
    // Check if extension is present
    this.checkExtensionPresence();
    
    // Check if user is already logged in to extension
    this.getUid();
    
    // Start heartbeat monitoring
    this.startHeartbeat();
  }

  /**
   * Start regular heartbeat with extension
   */
  startHeartbeat() {
    // Send initial heartbeat
    this.sendHeartbeat();
    
    // Set up regular heartbeat interval (every 30 seconds)
    setInterval(() => {
      this.sendHeartbeat();
    }, 30000);
  }

  /**
   * Cleanup event listeners and intervals
   */
  destroy() {
    // Note: We can't remove the specific event listener we added
    // without keeping a reference to the bound function
    // TODO: Keep reference to interval for proper cleanup
    console.log('ExtensionCommunication cleanup');
  }
}

// Create singleton instance
export const extensionComm = new ExtensionCommunication();