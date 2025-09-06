/**
 * ChromeStorageReader Usage Examples
 * This file shows how to use the ChromeStorageReader class in different scenarios
 */

import { chromeStorageReader, ChromeUserData } from './chromeStorageReader';

// Example 1: Simple usage in a React component
export const useSimpleExample = () => {
  const handlePageLoad = async () => {
    // Check if this is a visit from Chrome extension
    if (chromeStorageReader.isFromExtension()) {
      console.log('User came from Chrome extension');
      
      // Try to get user data from Chrome storage
      const userData = await chromeStorageReader.getUserDataFromChromeStorage();
      
      if (userData) {
        console.log('User data loaded:', userData);
        // Use the user data in your component
        return userData;
      }
    }
    return null;
  };
  
  return { handlePageLoad };
};

// Example 2: Payment page integration
export const usePaymentPageExample = () => {
  const initializePaymentPage = async () => {
    // Check if Chrome extension is available
    if (chromeStorageReader.isChromeStorageAvailable()) {
      console.log('Chrome extension is available');
      
      // Handle extension visit
      const userData = await chromeStorageReader.handleExtensionVisit();
      
      if (userData) {
        // Pre-fill payment form with user data
        return {
          email: userData.email,
          name: userData.displayName,
          isPremium: userData.isPremium,
          usageCount: userData.usageCount
        };
      }
    }
    
    return null;
  };
  
  return { initializePaymentPage };
};

// Example 3: Subscription management integration
export const useSubscriptionExample = () => {
  const loadUserSubscriptionData = async () => {
    try {
      // First try Chrome extension data
      const chromeData = await chromeStorageReader.getUserDataFromChromeStorage();
      
      if (chromeData) {
        // Display immediate data from Chrome storage
        chromeStorageReader.displayUserInfo(chromeData, {
          'user-email': chromeData.email,
          'premium-status': chromeData.isPremium ? 'Premium' : 'Free',
          'usage-count': chromeData.usageCount?.toString() || '0'
        });
        
        // Generate usage recommendation
        const recommendation = chromeStorageReader.generateRecommendation();
        if (recommendation) {
          console.log('Recommendation:', recommendation);
        }
        
        return chromeData;
      }
    } catch (error) {
      console.error('Error loading Chrome data:', error);
    }
    
    return null;
  };
  
  return { loadUserSubscriptionData };
};

// Example 4: Complete page initialization
export const useCompleteExample = () => {
  const initializePage = async () => {
    console.log('Initializing page with Chrome extension support...');
    
    // Step 1: Check if visit is from extension
    if (!chromeStorageReader.isFromExtension()) {
      console.log('Normal website visit');
      return { source: 'web', userData: null };
    }
    
    // Step 2: Check if Chrome storage is available
    if (!chromeStorageReader.isChromeStorageAvailable()) {
      console.log('Chrome extension not available');
      return { source: 'extension', userData: null, error: 'Extension not available' };
    }
    
    // Step 3: Load user data
    const userData = await chromeStorageReader.handleExtensionVisit();
    
    if (!userData) {
      console.log('No user data found in Chrome storage');
      return { source: 'extension', userData: null, error: 'No user data' };
    }
    
    // Step 4: Try auto-authentication (optional)
    try {
      const authSuccess = await chromeStorageReader.autoLoginUser(userData);
      if (authSuccess) {
        console.log('User auto-authenticated successfully');
      }
    } catch (error) {
      console.log('Auto-authentication failed:', error);
    }
    
    // Step 5: Return complete data
    return {
      source: 'extension',
      userData: userData,
      isPremium: chromeStorageReader.isPremiumUser(),
      usageCount: chromeStorageReader.getUserUsageCount(),
      recommendation: chromeStorageReader.generateRecommendation()
    };
  };
  
  return { initializePage };
};

// Example 5: Error handling and fallbacks
export const useRobustExample = () => {
  const loadDataWithFallbacks = async () => {
    let userData: ChromeUserData | null = null;
    let source = 'unknown';
    
    try {
      // Try Chrome extension data first
      if (chromeStorageReader.isFromExtension()) {
        source = 'extension';
        userData = await chromeStorageReader.getUserDataFromChromeStorage();
        
        if (userData) {
          console.log('✅ Loaded data from Chrome extension');
          return { userData, source, success: true };
        }
      }
      
      // Fallback to regular authentication flow
      source = 'web';
      console.log('ℹ️ Falling back to regular authentication');
      
      // Here you would implement your regular auth flow
      // For example, Firebase Auth, etc.
      
      return { userData: null, source, success: false };
      
    } catch (error) {
      console.error('❌ Error in loadDataWithFallbacks:', error);
      return { userData: null, source, success: false, error };
    }
  };
  
  const clearCacheAndRetry = () => {
    chromeStorageReader.clearCache();
    return loadDataWithFallbacks();
  };
  
  return { loadDataWithFallbacks, clearCacheAndRetry };
};

// Example 6: URL parameter detection
export const detectExtensionVisit = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    isFromExtension: chromeStorageReader.isFromExtension(),
    hasAuthParam: urlParams.get('auth') === 'chrome_storage',
    hasFromParam: urlParams.get('from') === 'extension',
    allParams: Object.fromEntries(urlParams.entries())
  };
};

// Example 7: Integration with React useEffect
// Note: This is just an example - import React properly in your actual components
export const getReactIntegrationExample = () => {
  return `
import React, { useState, useEffect } from 'react';
import { chromeStorageReader, ChromeUserData } from './chromeStorageReader';

export const useReactIntegration = () => {
  const [chromeUserData, setChromeUserData] = useState<ChromeUserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadChromeData = async () => {
      try {
        setLoading(true);
        
        if (chromeStorageReader.isFromExtension()) {
          const userData = await chromeStorageReader.handleExtensionVisit();
          setChromeUserData(userData);
        }
      } catch (error) {
        console.error('Error loading Chrome data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChromeData();
  }, []);
  
  return { chromeUserData, loading };
};
  `;
};