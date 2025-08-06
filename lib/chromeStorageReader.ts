/**
 * Chrome Storage Reader Class
 * Handles reading user data from chrome.storage.sync on website pages
 * to avoid redirects and provide seamless authentication from Chrome extension
 */

export interface ChromeUserData {
  uid: string;
  email: string;
  displayName?: string;
  usageCount?: number;
  isPremium?: boolean;
  createdAt?: string;
  lastUsageUpdate?: string;
  photoURL?: string;
  planType?: string;
  subscriptionStatus?: string;
}

export interface ChromeStorageItem {
  userDetails?: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
  };
  usageCount?: number;
  isPremium?: boolean;
  planType?: string;
  subscriptionStatus?: string;
  createdAt?: string;
  lastUsageUpdate?: string;
}

// Type for Chrome extension API
type ChromeStorageAPI = {
  storage?: {
    sync?: {
      get: (keys: string[] | string | null, callback: (items: any) => void) => void;
    };
  };
  runtime?: {
    lastError?: {
      message?: string;
    };
  };
};

export class ChromeStorageReader {
  private static instance: ChromeStorageReader;
  private userData: ChromeUserData | null = null;
  private isInitialized = false;
  private initPromise: Promise<ChromeUserData | null> | null = null;

  private constructor() {}

  public static getInstance(): ChromeStorageReader {
    if (!ChromeStorageReader.instance) {
      ChromeStorageReader.instance = new ChromeStorageReader();
    }
    return ChromeStorageReader.instance;
  }

  /**
   * Check if the current visit came from the Chrome extension
   */
  public isFromExtension(): boolean {
    if (typeof window === 'undefined') return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('from') === 'extension' || urlParams.get('auth') === 'chrome_storage';
  }

  /**
   * Check if Chrome extension APIs are available
   */
  public isChromeStorageAvailable(): boolean {
    return !!(typeof window !== 'undefined' && 
             (window as any).chrome && 
             (window as any).chrome.storage && 
             (window as any).chrome.storage.sync);
  }

  /**
   * Read user data from Chrome extension via postMessage communication
   */
  public async getUserDataFromChromeStorage(): Promise<ChromeUserData | null> {
    // Return cached data if already loaded
    if (this.isInitialized) {
      return this.userData;
    }

    // Return existing promise if already in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    // Create new promise for loading data via extension communication
    this.initPromise = new Promise<ChromeUserData | null>((resolve) => {
      console.log('📡 ChromeStorageReader: Requesting user data from extension via postMessage');
      
      // Set up message listener for extension response
      const messageHandler = (event: MessageEvent) => {
        if (event.source !== window) return;
        
        console.log('📨 ChromeStorageReader received message:', event.data);
        
        if (event.data.type === 'CHROME_USER_DATA_RESPONSE') {
          window.removeEventListener('message', messageHandler);
          clearTimeout(timeoutId);
          
          if (event.data.userData && event.data.userData.uid) {
            console.log('✅ ChromeStorageReader: User data received from extension');
            
            this.userData = {
              uid: event.data.userData.uid,
              email: event.data.userData.email,
              displayName: event.data.userData.displayName,
              photoURL: event.data.userData.photoURL,
              usageCount: event.data.userData.usageCount || 0,
              isPremium: event.data.userData.isPremium || false,
              planType: event.data.userData.planType,
              subscriptionStatus: event.data.userData.subscriptionStatus,
              createdAt: event.data.userData.createdAt,
              lastUsageUpdate: event.data.userData.lastUsageUpdate
            };
            
            this.isInitialized = true;
            resolve(this.userData);
          } else {
            console.warn('⚠️ ChromeStorageReader: No user data in extension response');
            this.isInitialized = true;
            resolve(null);
          }
        }
      };

      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.warn('ChromeStorageReader: Timeout waiting for extension response');
        window.removeEventListener('message', messageHandler);
        this.isInitialized = true;
        resolve(null);
      }, 5000);

      // Listen for extension response
      window.addEventListener('message', messageHandler);

      // Request user data from extension
      window.postMessage({
        type: 'GET_CHROME_USER_DATA',
        source: 'website'
      }, '*');
    });

    return this.initPromise;
  }

  /**
   * Initialize and handle extension visit
   */
  public async handleExtensionVisit(): Promise<ChromeUserData | null> {
    if (!this.isFromExtension()) {
      console.log('ChromeStorageReader: Not from extension, skipping chrome storage read');
      return null;
    }

    console.log('🔗 ChromeStorageReader: Visit from extension detected, reading user data from chrome.storage.sync');
    
    const userData = await this.getUserDataFromChromeStorage();
    
    if (userData) {
      console.log('✅ ChromeStorageReader: User data loaded from extension:', userData.email);
      return userData;
    } else {
      console.warn('⚠️ ChromeStorageReader: No user data found in chrome storage');
      return null;
    }
  }

  /**
   * Auto-authenticate user using Firebase Auth
   */
  public async autoLoginUser(userData: ChromeUserData, firebaseAuth?: any): Promise<boolean> {
    try {
      console.log('ChromeStorageReader: Attempting auto-login for user:', userData.email);

      // If Firebase Auth is provided, try to sign in with custom token
      if (firebaseAuth) {
        // This would require a backend endpoint to create custom tokens
        // For now, we'll just return the user data for manual authentication
        console.log('ChromeStorageReader: Firebase Auth integration not implemented yet');
      }

      // Make API call to backend to validate and create session
      const response = await fetch('/api/extension-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          source: 'chrome_extension'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ ChromeStorageReader: User authenticated successfully via extension');
        return true;
      } else {
        console.error('ChromeStorageReader: Backend authentication failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ ChromeStorageReader: Auto-login failed:', error);
      return false;
    }
  }

  /**
   * Update UI elements with user data
   */
  public displayUserInfo(userData: ChromeUserData, elements?: { [key: string]: string }): void {
    const defaultElements = {
      'user-name': userData.displayName || 'User',
      'user-email': userData.email,
      'usage-count': userData.usageCount?.toString() || '0',
      'premium-status': userData.isPremium ? 'Premium' : 'Free',
      'plan-type': userData.planType || 'free'
    };

    const elementsToUpdate = elements || defaultElements;

    Object.entries(elementsToUpdate).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = value;
      }
    });
  }

  /**
   * Get cached user data without re-reading from storage
   */
  public getCachedUserData(): ChromeUserData | null {
    return this.userData;
  }

  /**
   * Clear cached data and force re-read on next access
   */
  public clearCache(): void {
    this.userData = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Check if user has premium features based on chrome storage data
   */
  public isPremiumUser(): boolean {
    return this.userData?.isPremium || false;
  }

  /**
   * Get user's usage count from chrome storage
   */
  public getUserUsageCount(): number {
    return this.userData?.usageCount || 0;
  }

  /**
   * Generate recommendations based on usage
   */
  public generateRecommendation(): string | null {
    if (!this.userData) return null;

    const usageCount = this.userData.usageCount || 0;
    const isPremium = this.userData.isPremium || false;

    if (!isPremium && usageCount >= 8) {
      return `You've used ${usageCount} of your 10 free uses. Upgrade to Premium for unlimited access!`;
    } else if (!isPremium && usageCount >= 5) {
      return `You've used ${usageCount} of your 10 free uses. Consider upgrading to Premium.`;
    }

    return null;
  }
}

// Create and export singleton instance
export const chromeStorageReader = ChromeStorageReader.getInstance();

// Export default instance for easier imports
export default chromeStorageReader;