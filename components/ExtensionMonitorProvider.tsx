'use client';

import { useEffect, useRef } from 'react';
import { extensionMonitor } from '@/lib/extensionMonitor';
import { useAuth } from '@/hooks/useAuth';

export default function ExtensionMonitorProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { user } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log('🔍 Initializing global extension monitor');

    // Set up extension monitor callbacks
    extensionMonitor.onExtensionUninstalled = (userId: string) => {
      console.log('🚨 Extension uninstalled detected globally for user:', userId);
      
      // Show user notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Extension Uninstalled', {
          body: 'You have been logged out because the Requill extension was uninstalled.',
          icon: '/favicon.ico'
        });
      }
    };

    extensionMonitor.onExtensionStopped = () => {
      console.log('⚠️ Extension stopped responding');
      
      // Show warning to user
      if (user) {
        const warning = document.createElement('div');
        warning.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 300px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="color: #92400E; font-weight: 600; margin-bottom: 8px;">
              ⚠️ Extension Connection Lost
            </div>
            <div style="color: #78350F; font-size: 14px; margin-bottom: 8px;">
              The Requill extension appears to be disabled or uninstalled.
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="
                      background: #F59E0B;
                      color: white;
                      border: none;
                      padding: 4px 8px;
                      border-radius: 4px;
                      font-size: 12px;
                      cursor: pointer;
                    ">
              Dismiss
            </button>
          </div>
        `;
        document.body.appendChild(warning);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
          if (warning.parentElement) {
            warning.remove();
          }
        }, 10000);
      }
    };

    extensionMonitor.onExtensionRestored = () => {
      console.log('✅ Extension connection restored');
      
      // Remove any existing warnings
      const existingWarnings = document.querySelectorAll('[data-extension-warning]');
      existingWarnings.forEach(warning => warning.remove());
      
      // Show success notification
      if (user) {
        const success = document.createElement('div');
        success.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #D1FAE5;
            border: 1px solid #10B981;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 300px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="color: #065F46; font-weight: 600; margin-bottom: 8px;">
              ✅ Extension Reconnected
            </div>
            <div style="color: #047857; font-size: 14px;">
              The Requill extension is working normally.
            </div>
          </div>
        `;
        document.body.appendChild(success);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
          if (success.parentElement) {
            success.remove();
          }
        }, 3000);
      }
    };

    extensionMonitor.onHeartbeatMissed = (missedCount: number) => {
      console.log(`💔 Extension heartbeat missed (${missedCount})`);
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('🛑 Cleaning up global extension monitor');
      extensionMonitor.destroy();
    };
  }, [user]);

  return <>{children}</>;
}