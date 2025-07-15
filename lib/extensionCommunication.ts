/**
 * ExtensionCommunication class for handling bidirectional communication
 * between the web app and Chrome extension
 */
export class ExtensionCommunication {
  private messageHandlers: { [key: string]: (data: any) => void } = {};

  constructor() {
    this.setupMessageListener();
  }

  /**
   * Set up message listener for extension responses
   */
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
   * Send idToken to extension after user login
   */
  setIdToken(idToken: string, userData: any = null) {
    console.log('Website sending idToken to extension:', idToken ? `${idToken.substring(0, 20)}...` : 'null');
    window.postMessage({
      type: 'SET_ID_TOKEN',
      idToken: idToken,
      userData: userData
    }, '*');
  }

  /**
   * Request idToken from extension
   */
  getIdToken() {
    console.log('Website requesting idToken from extension');
    window.postMessage({
      type: 'GET_ID_TOKEN'
    }, '*');
  }

  /**
   * Clear idToken from extension (logout)
   */
  clearIdToken() {
    console.log('Website clearing idToken from extension');
    window.postMessage({
      type: 'CLEAR_ID_TOKEN'
    }, '*');
  }

  /**
   * Check if extension is available and active
   */
  checkExtensionStatus() {
    console.log('Website checking extension status');
    window.postMessage({
      type: 'CHECK_EXTENSION_STATUS'
    }, '*');
  }

  /**
   * Send the legacy REQUILL_LOGIN message for backward compatibility
   */
  sendRequillLogin(idToken: string) {
    console.log('Website sending REQUILL_LOGIN message');
    window.postMessage({
      type: 'REQUILL_LOGIN',
      idToken: idToken
    }, '*');
  }

  // Response handlers
  handleIdTokenResponse(idToken: string | null) {
    if (idToken) {
      console.log('✅ Extension has idToken:', idToken ? `${idToken.substring(0, 20)}...` : 'null');
      // User is logged in to extension
      this.onExtensionAuthenticated(idToken);
    } else {
      console.log('ℹ️ Extension does not have idToken');
      // User is not logged in to extension
      this.onExtensionUnauthenticated();
    }
  }

  handleIdTokenSetResponse(success: boolean) {
    if (success) {
      console.log('✅ idToken successfully stored in extension');
      this.onIdTokenStored();
    } else {
      console.log('❌ Failed to store idToken in extension');
      this.onIdTokenStoreFailed();
    }
  }

  handleIdTokenClearedResponse(success: boolean) {
    if (success) {
      console.log('✅ idToken successfully cleared from extension');
      this.onIdTokenCleared();
    } else {
      console.log('❌ Failed to clear idToken from extension');
      this.onIdTokenClearFailed();
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

  // Override these methods for custom behavior
  onExtensionAuthenticated(idToken: string) {
    // Override in implementation
  }

  onExtensionUnauthenticated() {
    // Override in implementation
  }

  onIdTokenStored() {
    // Override in implementation
  }

  onIdTokenStoreFailed() {
    // Override in implementation
  }

  onIdTokenCleared() {
    // Override in implementation
  }

  onIdTokenClearFailed() {
    // Override in implementation
  }

  onExtensionAvailable(data: any) {
    // Override in implementation
  }

  onExtensionUnavailable() {
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
    this.getIdToken();
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