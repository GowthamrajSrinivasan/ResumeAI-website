import { useState, useEffect } from 'react';
import { extensionMonitor, ExtensionStatus } from '@/lib/extensionMonitor';

// Hook for accessing extension monitor functionality
export function useExtensionMonitor() {
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>(
    extensionMonitor.getExtensionStatus()
  );
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Update status periodically
    const interval = setInterval(() => {
      setExtensionStatus(extensionMonitor.getExtensionStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if extension is present
  const checkExtensionPresence = async (): Promise<boolean> => {
    setIsValidating(true);
    try {
      const isPresent = await extensionMonitor.checkExtensionPresence();
      setExtensionStatus(extensionMonitor.getExtensionStatus());
      return isPresent;
    } finally {
      setIsValidating(false);
    }
  };

  // Validate current session
  const validateSession = async (): Promise<boolean> => {
    setIsValidating(true);
    try {
      const isValid = await extensionMonitor.validateSession();
      setExtensionStatus(extensionMonitor.getExtensionStatus());
      return isValid;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    extensionStatus,
    isValidating,
    checkExtensionPresence,
    validateSession,
    isExtensionInstalled: extensionStatus.isInstalled,
    isExtensionResponding: extensionStatus.isResponding,
    lastHeartbeat: extensionStatus.lastHeartbeat,
    extensionVersion: extensionStatus.version
  };
}