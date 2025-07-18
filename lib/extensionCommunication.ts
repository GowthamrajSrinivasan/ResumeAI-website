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
        case 'LINKEDIN_URL_STORED_RESPONSE':
          this.handleLinkedInUrlStoredResponse(event.data.success);
          break;
        case 'STORED_LINKEDIN_URL_RESPONSE':
          this.handleStoredLinkedInUrlResponse(event.data.url);
          break;
        case 'LINKEDIN_NAVIGATION_COMPLETE':
          this.handleLinkedInNavigationComplete(event.data.success);
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
   * Send uid to extension after user login
   */
  setUid(uid: string, userData: any = null) {
    if (typeof window === 'undefined') return;
    
    console.log('Website sending uid to extension:', uid);
    window.postMessage({
      type: 'SET_UID',
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
   * Clear uid from extension (logout)
   */
  clearUid() {
    if (typeof window === 'undefined') return;
    
    console.log('Website clearing uid from extension');
    window.postMessage({
      type: 'CLEAR_UID'
    }, '*');
  }

  /**
   * Check if extension is available and active
   */
  checkExtensionStatus() {
    if (typeof window === 'undefined') return;
    
    console.log('Website checking extension status');
    window.postMessage({
      type: 'CHECK_EXTENSION_STATUS'
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

  /**
   * Store LinkedIn URL before starting sign-in process
   */
  storeLinkedInUrl() {
    if (typeof window === 'undefined') return;
    
    console.log('Website requesting to store current LinkedIn URL');
    window.postMessage({
      type: 'STORE_LINKEDIN_URL'
    }, '*');
  }

  /**
   * Get stored LinkedIn URL after successful authentication
   */
  getStoredLinkedInUrl() {
    if (typeof window === 'undefined') return;
    
    console.log('Website requesting stored LinkedIn URL');
    window.postMessage({
      type: 'GET_STORED_LINKEDIN_URL'
    }, '*');
  }

  /**
   * Navigate to stored LinkedIn URL or fallback
   */
  navigateToLinkedIn() {
    if (typeof window === 'undefined') return;
    
    console.log('Website requesting navigation to LinkedIn');
    window.postMessage({
      type: 'NAVIGATE_TO_LINKEDIN'
    }, '*');
  }

  // Response handlers
  handleUidResponse(uid: string | null) {
    if (uid) {
      console.log('✅ Extension has uid:', uid);
      // User is logged in to extension
      this.onExtensionAuthenticated(uid);
    } else {
      console.log('ℹ️ Extension does not have uid');
      // User is not logged in to extension
      this.onExtensionUnauthenticated();
    }
  }

  handleUidSetResponse(success: boolean) {
    if (success) {
      console.log('✅ uid successfully stored in extension');
      this.onUidStored();
    } else {
      console.log('❌ Failed to store uid in extension');
      this.onUidStoreFailed();
    }
  }

  handleUidClearedResponse(success: boolean) {
    if (success) {
      console.log('✅ uid successfully cleared from extension');
      this.onUidCleared();
    } else {
      console.log('❌ Failed to clear uid from extension');
      this.onUidClearFailed();
    }
  }

  handleExtensionStatusResponse(data: any) {
    console.log('Extension status:', data);
    if (data.available) {
      console.log('✅ Extension is available and active');
      this.onExtensionAvailable(data);
    } else {
      console.log('ℹ️ Extension is not available');
      this.onExtensionUnavailable();
    }
  }

  handleLinkedInUrlStoredResponse(success: boolean) {
    if (success) {
      console.log('✅ LinkedIn URL successfully stored in extension');
      this.onLinkedInUrlStored();
    } else {
      console.log('❌ Failed to store LinkedIn URL in extension');
      this.onLinkedInUrlStoreFailed();
    }
  }

  handleStoredLinkedInUrlResponse(url: string | null) {
    if (url) {
      console.log('✅ Retrieved stored LinkedIn URL:', url);
      this.onStoredLinkedInUrlRetrieved(url);
    } else {
      console.log('ℹ️ No LinkedIn URL stored in extension');
      this.onNoLinkedInUrlStored();
    }
  }

  handleLinkedInNavigationComplete(success: boolean) {
    if (success) {
      console.log('✅ Successfully navigated to LinkedIn');
      this.onLinkedInNavigationSuccess();
    } else {
      console.log('❌ Failed to navigate to LinkedIn');
      this.onLinkedInNavigationFailed();
    }
  }

  // Override these methods for custom behavior
  onExtensionAuthenticated(uid: string) {
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

  onExtensionAvailable(data: any) {
    // Override in implementation
  }

  onExtensionUnavailable() {
    // Override in implementation
  }

  onLinkedInUrlStored() {
    // Override in implementation
  }

  onLinkedInUrlStoreFailed() {
    // Override in implementation
  }

  onStoredLinkedInUrlRetrieved(url: string) {
    // Override in implementation
  }

  onNoLinkedInUrlStored() {
    // Override in implementation
  }

  onLinkedInNavigationSuccess() {
    // Override in implementation
  }

  onLinkedInNavigationFailed() {
    // Override in implementation
  }

  /**
   * Initialize extension communication and check status
   */
  initialize() {
    console.log('Initializing extension communication...');
    
    // Check if extension is available
    this.checkExtensionStatus();
    
    // Check if user is already logged in to extension
    this.getUid();
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    // Note: We can't remove the specific event listener we added
    // without keeping a reference to the bound function
    console.log('ExtensionCommunication cleanup');
  }
}

// Create singleton instance
export const extensionComm = new ExtensionCommunication();