// Extension Monitoring System
// Handles extension uninstall detection, heartbeat, presence checking, and session validation

import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface ExtensionStatus {
  isInstalled: boolean;
  isResponding: boolean;
  lastHeartbeat: number;
  version?: string;
}

export interface ExtensionMonitorConfig {
  heartbeatInterval: number; // ms
  heartbeatTimeout: number; // ms
  maxMissedHeartbeats: number;
  enableLogging: boolean;
}

export class ExtensionMonitor {
  private config: ExtensionMonitorConfig;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private missedHeartbeats = 0;
  private lastHeartbeat = 0;
  private isInitialized = false;
  private messageHandlers: ((event: MessageEvent) => void)[] = [];
  
  // Extension status
  private extensionStatus: ExtensionStatus = {
    isInstalled: false,
    isResponding: false,
    lastHeartbeat: 0
  };

  // Callbacks
  public onExtensionUninstalled?: (userId: string) => void;
  public onExtensionStopped?: () => void;
  public onExtensionRestored?: () => void;
  public onHeartbeatMissed?: (missedCount: number) => void;

  constructor(config: Partial<ExtensionMonitorConfig> = {}) {
    this.config = {
      heartbeatInterval: 30000, // 30 seconds
      heartbeatTimeout: 5000,   // 5 seconds
      maxMissedHeartbeats: 3,   // 3 missed = extension assumed dead
      enableLogging: true,
      ...config
    };
  }

  // Initialize the extension monitor
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.log('🔍 Initializing Extension Monitor');
    
    // Set up message listener
    this.setupMessageListener();
    
    // Start heartbeat system
    this.startHeartbeat();
    
    // Check initial extension presence
    this.checkExtensionPresence();
    
    this.isInitialized = true;
  }

  // Destroy the monitor and cleanup
  destroy(): void {
    if (!this.isInitialized) return;
    
    this.log('🛑 Destroying Extension Monitor');
    
    // Stop heartbeat
    this.stopHeartbeat();
    
    // Remove message listeners
    this.messageHandlers.forEach(handler => {
      window.removeEventListener('message', handler);
    });
    this.messageHandlers = [];
    
    this.isInitialized = false;
  }

  // 1. EXTENSION UNINSTALL EVENT LISTENER
  private setupMessageListener(): void {
    const messageHandler = (event: MessageEvent) => {
      this.log('📨 Received message:', event.data, 'from origin:', event.origin);
      
      // Handle different message types
      switch (event.data.type) {
        case 'EXTENSION_UNINSTALLED':
          this.handleExtensionUninstall(event.data.userId, event.data.timestamp);
          break;
          
        case 'EXTENSION_HEARTBEAT':
          this.handleHeartbeat(event.data);
          break;
          
        case 'EXTENSION_PRESENCE_RESPONSE':
          this.handlePresenceResponse(event.data);
          break;
          
        default:
          // Handle other extension messages
          break;
      }
    };

    window.addEventListener('message', messageHandler);
    this.messageHandlers.push(messageHandler);
  }

  private async handleExtensionUninstall(userId: string, timestamp: number): Promise<void> {
    this.log('🔴 Extension uninstalled for user:', userId);
    
    // Update extension status
    this.extensionStatus.isInstalled = false;
    this.extensionStatus.isResponding = false;
    
    // Log to Firestore (only if we have a valid user session)
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await addDoc(collection(db, 'extension_events'), {
          event: 'extension_uninstalled',
          userId,
          timestamp: serverTimestamp(),
          originalTimestamp: timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      } catch (error) {
        console.error('Failed to log extension uninstall:', error);
        // Fallback to console logging
        console.log('📊 Extension uninstalled (fallback):', {
          event: 'extension_uninstalled',
          userId,
          timestamp: Date.now(),
          originalTimestamp: timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      }
    } else {
      // Log to console if no user session
      console.log('📊 Extension uninstalled (no auth):', {
        event: 'extension_uninstalled',
        userId,
        timestamp: Date.now(),
        originalTimestamp: timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }

    // Check if current user should be logged out
    if (currentUser && currentUser.uid === userId) {
      this.log('🚪 Logging out user due to extension uninstall');
      
      try {
        // Set a flag to prevent automatic re-login
        localStorage.setItem('extension_uninstall_logout', 'true');
        localStorage.setItem('extension_uninstall_userId', userId);
        localStorage.setItem('extension_uninstall_timestamp', Date.now().toString());
        
        // Clear all possible auth storage
        localStorage.removeItem('firebase:authUser:' + window.location.hostname);
        sessionStorage.clear();
        
        // Sign out from Firebase
        await signOut(auth);
        this.log('✅ User logged out successfully');
        
        // Redirect to login page with clear reason
        if (typeof window !== 'undefined') {
          window.location.href = '/login?reason=extension_uninstalled&userId=' + userId;
        }
      } catch (error) {
        console.error('❌ Error during logout:', error);
      }
    }

    // Call callback
    if (this.onExtensionUninstalled) {
      this.onExtensionUninstalled(userId);
    }
  }

  // 2. HEARTBEAT SYSTEM
  private startHeartbeat(): void {
    if (this.heartbeatTimer) return;
    
    this.log('💓 Starting heartbeat system');
    
    // Send initial heartbeat request
    this.sendHeartbeatRequest();
    
    // Set up interval for regular heartbeats
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeatRequest();
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private sendHeartbeatRequest(): void {
    this.log('💓 Sending heartbeat request');
    
    // Send heartbeat request to extension
    window.postMessage({
      type: 'WEBSITE_HEARTBEAT_REQUEST',
      timestamp: Date.now()
    }, '*');
    
    // Set timeout for response
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    
    this.heartbeatTimeoutTimer = setTimeout(() => {
      this.handleHeartbeatTimeout();
    }, this.config.heartbeatTimeout);
  }

  private handleHeartbeat(data: any): void {
    this.log('💓 Received heartbeat response');
    
    // Clear timeout
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
    
    // Update status
    this.lastHeartbeat = Date.now();
    this.missedHeartbeats = 0;
    
    const wasResponding = this.extensionStatus.isResponding;
    this.extensionStatus.isResponding = true;
    this.extensionStatus.isInstalled = true;
    this.extensionStatus.lastHeartbeat = this.lastHeartbeat;
    this.extensionStatus.version = data.version;
    
    // Call callback if extension was restored
    if (!wasResponding && this.onExtensionRestored) {
      this.onExtensionRestored();
    }
  }

  private handleHeartbeatTimeout(): void {
    this.missedHeartbeats++;
    this.log(`💔 Heartbeat timeout (${this.missedHeartbeats}/${this.config.maxMissedHeartbeats})`);
    
    // Call callback
    if (this.onHeartbeatMissed) {
      this.onHeartbeatMissed(this.missedHeartbeats);
    }
    
    // Check if extension should be considered dead
    if (this.missedHeartbeats >= this.config.maxMissedHeartbeats) {
      this.handleExtensionStopped();
    }
  }

  private handleExtensionStopped(): void {
    this.log('💀 Extension appears to be stopped/uninstalled');
    
    // Update status
    this.extensionStatus.isResponding = false;
    
    // Log event
    this.logExtensionEvent('extension_stopped');
    
    // Call callback
    if (this.onExtensionStopped) {
      this.onExtensionStopped();
    }
  }

  // 3. EXTENSION PRESENCE CHECKER
  async checkExtensionPresence(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.extensionStatus.isInstalled = false;
        resolve(false);
      }, 2000); // 2 second timeout

      const checkHandler = (event: MessageEvent) => {
        if (event.data.type === 'EXTENSION_PRESENCE_RESPONSE') {
          clearTimeout(timeout);
          window.removeEventListener('message', checkHandler);
          this.extensionStatus.isInstalled = true;
          resolve(true);
        }
      };

      window.addEventListener('message', checkHandler);
      
      // Send presence check request
      window.postMessage({
        type: 'WEBSITE_PRESENCE_CHECK',
        timestamp: Date.now()
      }, '*');
    });
  }

  private handlePresenceResponse(data: any): void {
    this.log('✅ Extension presence confirmed');
    this.extensionStatus.isInstalled = true;
    this.extensionStatus.version = data.version;
  }

  // 4. SESSION VALIDATION
  async validateSession(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      this.log('❌ No user logged in');
      return false;
    }

    // Check if extension is present and responding
    const isPresent = await this.checkExtensionPresence();
    if (!isPresent) {
      this.log('❌ Extension not present during session validation');
      this.logExtensionEvent('session_validation_failed', {
        reason: 'extension_not_present',
        userId: currentUser.uid
      });
      return false;
    }

    // Check heartbeat status
    if (!this.extensionStatus.isResponding) {
      this.log('❌ Extension not responding during session validation');
      this.logExtensionEvent('session_validation_failed', {
        reason: 'extension_not_responding',
        userId: currentUser.uid
      });
      return false;
    }

    this.log('✅ Session validation passed');
    return true;
  }

  // Utility methods
  getExtensionStatus(): ExtensionStatus {
    return { ...this.extensionStatus };
  }

  private async logExtensionEvent(event: string, additionalData: any = {}): Promise<void> {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      // Log to console if user not authenticated
      console.log(`📊 Extension Event (anonymous): ${event}`, {
        event,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        extensionStatus: this.extensionStatus,
        ...additionalData
      });
      return;
    }

    try {
      await addDoc(collection(db, 'extension_events'), {
        event,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        extensionStatus: this.extensionStatus,
        userId: currentUser.uid,
        ...additionalData
      });
    } catch (error) {
      console.error('Failed to log extension event:', error);
      // Fallback to console logging
      console.log(`📊 Extension Event (fallback): ${event}`, {
        event,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        extensionStatus: this.extensionStatus,
        userId: currentUser.uid,
        ...additionalData
      });
    }
  }

  private log(message: string, ...args: any[]): void {
    if (this.config.enableLogging) {
      console.log(`[ExtensionMonitor] ${message}`, ...args);
    }
  }
}

// Create singleton instance
export const extensionMonitor = new ExtensionMonitor({
  heartbeatInterval: 30000,  // 30 seconds
  heartbeatTimeout: 5000,    // 5 seconds
  maxMissedHeartbeats: 3,    // 3 missed heartbeats = dead
  enableLogging: true
});

// Initialize when module loads
if (typeof window !== 'undefined') {
  extensionMonitor.initialize();
}