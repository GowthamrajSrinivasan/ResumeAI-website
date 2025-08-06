"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FIREBASE_FUNCTIONS } from '@/lib/firebase-functions';
import { getLocalizedPricing, PlanPricing } from '@/lib/currency-service';
import PaymentButton from '@/components/PaymentButtonWithCurrency';
import { extensionComm } from '@/lib/extensionCommunication';
import { chromeStorageReader, ChromeUserData } from '@/lib/chromeStorageReader';

interface UserProfile {
  // Basic user info
  uid?: string;
  userEmail?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  
  // Account timestamps
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  
  // Premium status
  isPremium: boolean;
  planType?: string;
  premiumStartDate?: Date;
  premiumEndDate?: Date;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired' | 'paused';
  
  // Payment info
  lastPaymentId?: string;
  lastOrderId?: string;
  
  // Usage data
  usage?: {
    totalUsage: number;
    monthlyUsage: number;
    lastUsed?: Date;
    quotaLimit: number;
    quotaReset?: Date;
  };
  
  // Activity and history
  recentActivity?: any[];
  upgradeHistory?: any[];
  
  // Extension data
  extensionInstalled?: boolean;
  lastExtensionSync?: Date;
}

interface BillingHistory {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoice_url?: string;
  description: string;
  formattedAmount?: string;
  paymentId?: string;
  orderId?: string;
}

function SubscriptionsPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [pricingData, setPricingData] = useState<PlanPricing | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [chromeStorageData, setChromeStorageData] = useState<any>(null);
  const [chromeUserData, setChromeUserData] = useState<ChromeUserData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [authStateChecked, setAuthStateChecked] = useState(false);
  const [redirectTimeoutId, setRedirectTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Handle Chrome extension visits first
  useEffect(() => {
    const handleChromeExtensionData = async () => {
      try {
        // COMPREHENSIVE CHROME API LOGGING - Check at the very beginning
        console.log('🔍 SUBSCRIPTION PAGE: Starting Chrome API availability check...');
        console.log('🔍 typeof window:', typeof window);
        console.log('🔍 window.chrome exists:', !!(window as any).chrome);
        console.log('🔍 window.chrome object:', (window as any).chrome);
        
        if ((window as any).chrome) {
          console.log('🔍 chrome.storage exists:', !!((window as any).chrome.storage));
          console.log('🔍 chrome.storage object:', (window as any).chrome.storage);
          
          if ((window as any).chrome.storage) {
            console.log('🔍 chrome.storage.sync exists:', !!((window as any).chrome.storage.sync));
            console.log('🔍 chrome.storage.sync object:', (window as any).chrome.storage.sync);
            
            if ((window as any).chrome.storage.sync) {
              console.log('🔍 chrome.storage.sync.get exists:', typeof (window as any).chrome.storage.sync.get);
              console.log('✅ ALL CHROME APIS AVAILABLE - Ready to proceed');
            } else {
              console.log('❌ chrome.storage.sync is NULL/UNDEFINED');
            }
          } else {
            console.log('❌ chrome.storage is NULL/UNDEFINED');
          }
        } else {
          console.log('❌ window.chrome is NULL/UNDEFINED');
        }
        
        // Check extension availability through chromeStorageReader
        console.log('🔍 chromeStorageReader.isChromeStorageAvailable():', chromeStorageReader.isChromeStorageAvailable());
        
        // DIRECT TEST: Try to access Chrome storage directly
        if ((window as any).chrome && (window as any).chrome.storage && (window as any).chrome.storage.sync) {
          console.log('🧪 DIRECT TEST: Attempting direct chrome.storage.sync access...');
          try {
            (window as any).chrome.storage.sync.get(null, (items: any) => {
              if ((window as any).chrome.runtime?.lastError) {
                console.error('🧪 DIRECT TEST ERROR:', (window as any).chrome.runtime.lastError.message);
              } else {
                console.log('🧪 DIRECT TEST SUCCESS: Items from chrome.storage.sync:', items);
                const userKeys = Object.keys(items).filter(key => key.startsWith('user_'));
                console.log('🧪 DIRECT TEST: Found user keys:', userKeys);
              }
            });
          } catch (directError) {
            console.error('🧪 DIRECT TEST EXCEPTION:', directError);
          }
        } else {
          console.log('🧪 DIRECT TEST: Cannot perform - Chrome APIs not available');
        }
        
        // Check if this is a visit from Chrome extension
        console.log('🔗 Checking if visit is from Chrome extension...');
        console.log('URL search params:', window.location.search);
        console.log('isFromExtension():', chromeStorageReader.isFromExtension());
        
        if (chromeStorageReader.isFromExtension()) {
          console.log('🔗 Detected visit from Chrome extension, attempting to read user data...');
          
          // Set up direct message listener (matches your extension code exactly)
          const messageHandler = (event: MessageEvent) => {
            // Log ALL messages received to see what the extension is sending
            console.log('📨 SUBSCRIPTION: Received message:', {
              type: event.data?.type,
              source: event.data?.source,
              origin: event.origin,
              data: event.data
            });
            
            if (event.data?.type === "UID_RESPONSE") {
              console.log('🎉 SUBSCRIPTION: Processing UID_RESPONSE:', event.data);
              
              // Check if we got complete user data
              if (event.data.uid && event.data.email) {
                console.log('✅ SUBSCRIPTION: Complete user data received - proceeding with authentication');
                
                const userData = {
                  uid: event.data.uid,
                  email: event.data.email,
                  displayName: event.data.displayName || 'User',
                  usageCount: event.data.usageCount || 0,
                  isPremium: event.data.isPremium || false,
                  createdAt: event.data.createdAt,
                  lastUsageUpdate: event.data.lastUsageUpdate,
                  planType: event.data.planType || (event.data.isPremium ? 'premium' : 'free'),
                  subscriptionStatus: event.data.subscriptionStatus || 'active'
                };
                
                setChromeUserData(userData);
                console.log('✅ Chrome extension user data loaded:', userData);
                
              } else if (event.data.error) {
                console.error('❌ SUBSCRIPTION: Error from extension:', event.data.error);
                setChromeStorageData({ available: false, error: true, message: event.data.error });
              } else {
                console.warn('⚠️ SUBSCRIPTION: Incomplete user data received');
                console.log('📋 SUBSCRIPTION: Available data:', event.data);
                
                // Still try to authenticate with partial data if we have UID
                if (event.data.uid) {
                  const partialUserData = {
                    uid: event.data.uid,
                    email: event.data.email || 'Unknown',
                    displayName: event.data.displayName || 'User',
                    usageCount: event.data.usageCount || 0,
                    isPremium: event.data.isPremium || false,
                    planType: event.data.planType || (event.data.isPremium ? 'premium' : 'free'),
                    subscriptionStatus: event.data.subscriptionStatus || 'active'
                  };
                  
                  console.log('🔄 SUBSCRIPTION: Attempting authentication with partial data');
                  setChromeUserData(partialUserData);
                } else {
                  console.error('Unable to authenticate: No user ID found');
                  setChromeStorageData({ available: false, error: true, message: 'No user ID found' });
                }
              }
              
              // Clean up listener
              window.removeEventListener('message', messageHandler);
            }
          };
          
          // Add message listener
          window.addEventListener('message', messageHandler);
          
          // Request user data from extension (matches your extension code)
          console.log('🌐 SUBSCRIPTION: Requesting user data from extension...');
          window.postMessage({
            type: "GET_UID"
          }, "*");
          
          // Timeout for extension response
          setTimeout(() => {
            if (!chromeUserData) {
              console.warn('⚠️ SUBSCRIPTION: No response from extension, trying fallback...');
              // Remove the message listener
              window.removeEventListener('message', messageHandler);
              
              // Try Chrome storage reader as fallback
              chromeStorageReader.handleExtensionVisit().then((fallbackData) => {
                if (fallbackData) {
                  console.log('✅ Chrome extension user data loaded via fallback:', fallbackData);
                  setChromeUserData(fallbackData);
                } else {
                  console.warn('⚠️ No user data found in Chrome extension storage');
                  setChromeStorageData({ available: false, authenticated: false });
                }
              }).catch((error) => {
                console.error('❌ Error with fallback Chrome storage reader:', error);
                setChromeStorageData({ available: false, authenticated: false });
              });
            }
          }, 3000);
        } else {
          console.log('🔗 Not from extension, skipping Chrome storage read');
        }
      } catch (error) {
        console.error('❌ Error handling Chrome extension data:', error);
        setChromeStorageData({ available: false, error: true, message: error });
      }
    };

    // Run immediately when component mounts
    handleChromeExtensionData();
  }, []);

  useEffect(() => {
    console.log('Subscription page useEffect:', { 
      loading, 
      user: !!user, 
      userEmail: user?.email,
      userUid: user?.uid,
      authStateChecked
    });
    
    // Wait for Firebase Auth to fully initialize
    if (loading) {
      return; // Still loading auth state
    }
    
    // If we have a user OR Chrome extension data, clear any existing timeout and proceed with data loading
    if (!loading && (user || chromeUserData)) {
      const effectiveUser = user || { 
        email: chromeUserData?.email, 
        uid: chromeUserData?.uid,
        displayName: chromeUserData?.displayName 
      };
      
      console.log('User found (Firebase or Chrome), loading subscription data:', effectiveUser.email);
      
      // Clear any existing redirect timeout since we found a user
      if (redirectTimeoutId) {
        console.log('Clearing existing redirect timeout since user is found');
        clearTimeout(redirectTimeoutId);
        setRedirectTimeoutId(null);
      }
      
      // Mark that we've successfully checked auth state
      if (!authStateChecked) {
        setAuthStateChecked(true);
      }
      
      // Wrap data loading in try-catch for additional safety
      try {
        loadSubscriptionData();
      } catch (error) {
        console.error('Error in loadSubscriptionData useEffect:', error);
        setError('Failed to initialize data loading');
        setPageLoading(false);
      }
      return;
    }
    
    // Mark that we've checked the auth state at least once
    if (!authStateChecked) {
      setAuthStateChecked(true);
      
      // If no user after auth state is loaded, wait a bit more for potential restoration
      if (!user) {
        // Check if this navigation came from extension (which might need more time)
        const fromExtension = searchParams.get('from') === 'extension';
        const waitTime = fromExtension ? 5000 : 1500; // Wait longer if from extension - increased to 5s
        
        console.log(`No user found after auth state loaded, waiting ${waitTime}ms for potential restoration...`, {
          fromExtension,
          searchParams: Object.fromEntries(searchParams.entries())
        });
        
        const timeoutId = setTimeout(() => {
          // Double-check after additional wait time - only redirect if still no user AND no Chrome data
          console.log('Timeout reached. Checking user state:', { 
            user: !!user, 
            chromeUserData: !!chromeUserData,
            authStateChecked
          });
          
          if (!user && !chromeUserData) {
            console.log('No user found after restoration wait, redirecting to login');
            router.push('/login?returnTo=' + encodeURIComponent('/account/subscriptions'));
          } else {
            console.log('User or Chrome data available, skipping redirect. User:', !!user, 'Chrome data:', !!chromeUserData);
          }
        }, waitTime);
        
        // Store timeout ID so we can clear it if user appears
        setRedirectTimeoutId(timeoutId);
        return;
      }
    }
    
    // Handle case where user becomes null after being authenticated (logout)
    if (!loading && !user && !chromeUserData && authStateChecked) {
      console.log('User logged out, redirecting to login');
      console.log('chromeUserData:', chromeUserData);

      //router.push('/login');
    }
  }, [user, loading, router, authStateChecked, redirectTimeoutId, chromeUserData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutId) {
        console.log('Cleaning up redirect timeout on unmount');
        clearTimeout(redirectTimeoutId);
      }
    };
  }, [redirectTimeoutId]);

  const retryDataLoading = () => {
    setError('');
    setRetryCount(prev => prev + 1);
    loadSubscriptionData();
  };

  const loadSubscriptionData = async () => {
    try {
      // Determine effective user (Firebase or Chrome extension)
      const effectiveUser = user || { 
        uid: chromeUserData?.uid, 
        email: chromeUserData?.email,
        displayName: chromeUserData?.displayName 
      };
      
      if (!effectiveUser.uid || !effectiveUser.email) {
        console.error('No valid user data available for loading subscription data');
        setPageLoading(false);
        return;
      }
      
      console.log('Starting comprehensive data loading for:', effectiveUser.email);
      setPageLoading(true);
      
      // Start all data loading operations in parallel for better performance
      const dataLoadingPromises = [];

      // 1. Load pricing data with timeout
      console.log('Loading pricing data...');
      const pricingPromise = Promise.race([
        getLocalizedPricing(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]).then((pricing) => {
        setPricingData(pricing as PlanPricing);
        console.log('Pricing data loaded:', pricing);
      }).catch((pricingError) => {
        console.error('Pricing load failed:', pricingError);
        // Set fallback pricing
        setPricingData({
          monthly: 999,
          annual: 9999,
          currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
          formattedMonthly: '₹999',
          formattedAnnual: '₹9,999',
          pricingSource: 'fallback'
        });
      });
      dataLoadingPromises.push(pricingPromise);

      // 2. Load comprehensive user profile from Firestore
      console.log('Loading comprehensive user profile...');
      const profilePromise = Promise.race([
        fetch(FIREBASE_FUNCTIONS.getUserProfile, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: effectiveUser.uid }),
        }),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('API Timeout')), 10000))
      ]).then(async (profileResponse) => {
        console.log('User profile response status:', profileResponse.status);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('User profile data:', profileData);
          setUserProfile(profileData.userProfile);
        } else {
          console.error('User profile API failed:', profileResponse.status, profileResponse.statusText);
          // Set minimal user profile using effective user or Chrome data
          setUserProfile({
            isPremium: chromeUserData?.isPremium || false,
            planType: chromeUserData?.planType || 'free',
            subscriptionStatus: (chromeUserData?.subscriptionStatus as any) || 'expired',
            userEmail: effectiveUser.email || undefined,
            displayName: effectiveUser.displayName || effectiveUser.email?.split('@')[0] || undefined,
            uid: effectiveUser.uid || undefined,
            usage: chromeUserData ? {
              totalUsage: chromeUserData.usageCount || 0,
              monthlyUsage: 0,
              quotaLimit: chromeUserData.isPremium ? -1 : 10
            } : undefined
          });
        }
      }).catch((profileError) => {
        console.error('Error loading user profile:', profileError);
        // Set fallback user profile using Chrome data if available
        setUserProfile({
          isPremium: chromeUserData?.isPremium || false,
          planType: chromeUserData?.planType || 'free',
          subscriptionStatus: (chromeUserData?.subscriptionStatus as any) || 'expired',
          userEmail: effectiveUser.email || undefined,
          displayName: effectiveUser.displayName || effectiveUser.email?.split('@')[0] || undefined,
          uid: effectiveUser.uid || undefined,
          usage: chromeUserData ? {
            totalUsage: chromeUserData.usageCount || 0,
            monthlyUsage: 0,
            quotaLimit: chromeUserData.isPremium ? -1 : 10
          } : undefined
        });
      });
      dataLoadingPromises.push(profilePromise);

      // 3. Load billing history
      console.log('Loading billing history...');
      const billingPromise = Promise.race([
        fetch(FIREBASE_FUNCTIONS.getBillingHistory, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: effectiveUser.uid, limit: 10 }),
        }),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('API Timeout')), 10000))
      ]).then(async (billingResponse) => {
        console.log('Billing response status:', billingResponse.status);
        if (billingResponse.ok) {
          const billingData = await billingResponse.json();
          console.log('Billing data:', billingData);
          setBillingHistory(billingData.billingHistory || []);
        } else {
          console.error('Billing API failed:', billingResponse.status, billingResponse.statusText);
          setBillingHistory([]);
        }
      }).catch((billingError) => {
        console.error('Error loading billing history:', billingError);
        setBillingHistory([]);
      });
      dataLoadingPromises.push(billingPromise);

      // Wait for all critical data to load (don't wait for extension)
      await Promise.allSettled(dataLoadingPromises);
      console.log('Core data loading completed');

      // 4. Try to get Chrome extension data (non-blocking)
      console.log('Attempting to get Chrome extension data...');
      try {
        if (typeof window !== 'undefined') {
          // Initialize extension communication
          extensionComm.initialize();
          
          // Set up handlers for extension responses
          extensionComm.onExtensionAuthenticated = (uid: string) => {
            console.log('Extension is authenticated with uid:', uid);
            setChromeStorageData({ uid, authenticated: true });
          };
          
          extensionComm.onExtensionUnauthenticated = () => {
            console.log('Extension is not authenticated');
            setChromeStorageData({ authenticated: false });
          };
          
          extensionComm.onExtensionAvailable = (data: any) => {
            console.log('Extension is available:', data);
            setChromeStorageData({ ...data, available: true });
          };
          
          extensionComm.onExtensionUnavailable = () => {
            console.log('Extension is not available');
            setChromeStorageData({ available: false });
          };
          
          // Request extension status and UID
          extensionComm.checkExtensionStatus();
          extensionComm.getUid();
          
          // Wait for extension response (with timeout)
          const timeoutHandle = setTimeout(() => {
            console.log('Extension data timeout reached');
            if (!chromeStorageData) {
              setChromeStorageData({ available: false, timeout: true });
            }
          }, 3000);
          
          // Clear timeout if we get a response
          const originalOnExtensionAvailable = extensionComm.onExtensionAvailable;
          extensionComm.onExtensionAvailable = (data: any) => {
            clearTimeout(timeoutHandle);
            originalOnExtensionAvailable.call(extensionComm, data);
            console.log('Extension is available:', data);
            setChromeStorageData({ ...data, available: true });
          };
          
          const originalOnExtensionUnavailable = extensionComm.onExtensionUnavailable;
          extensionComm.onExtensionUnavailable = () => {
            clearTimeout(timeoutHandle);
            originalOnExtensionUnavailable.call(extensionComm);
            console.log('Extension is not available');
            setChromeStorageData({ available: false });
          };
        }
      } catch (extensionError) {
        console.error('Error communicating with extension:', extensionError);
        setChromeStorageData({ error: true, message: extensionError });
      }

    } catch (err) {
      console.error('Error in loadSubscriptionData:', err);
      setError('Failed to load some subscription data');
      
      // Redeclare effectiveUser in catch block
      const effectiveUser = user || { 
        uid: chromeUserData?.uid, 
        email: chromeUserData?.email,
        displayName: chromeUserData?.displayName 
      };
      
      // Set minimal fallback data using Chrome data if available
      setUserProfile({
        isPremium: chromeUserData?.isPremium || false,
        planType: chromeUserData?.planType || 'free',
        subscriptionStatus: (chromeUserData?.subscriptionStatus as any) || 'expired',
        userEmail: effectiveUser.email || undefined,
        displayName: effectiveUser.displayName || effectiveUser.email?.split('@')[0] || undefined,
        uid: effectiveUser.uid || undefined,
        usage: chromeUserData ? {
          totalUsage: chromeUserData.usageCount || 0,
          monthlyUsage: 0,
          quotaLimit: chromeUserData.isPremium ? -1 : 10
        } : undefined
      });
      setBillingHistory([]);
    } finally {
      console.log('Setting pageLoading to false');
      setPageLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const effectiveUser = user || { uid: chromeUserData?.uid };
      const response = await fetch(FIREBASE_FUNCTIONS.cancelSubscription, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: effectiveUser.uid,
          reason: 'User requested cancellation'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setShowCancelConfirm(false);
        // Refresh subscription data
        loadSubscriptionData();
        alert('Subscription cancelled successfully. You will retain access until your next billing date.');
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel subscription: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  // Show loading state while authentication is being determined
  if (loading || (!user && !chromeUserData && !authStateChecked)) {
    return (
      <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3">
            {loading ? 'Loading authentication...' : 'Restoring session...'}
          </span>
        </div>
      </div>
    );
  }

  if (!user && !chromeUserData) {
    return (
      <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please log in to manage your subscription.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const currentPlan = userProfile?.isPremium ? 'Premium' : 'Free';
  const planBenefits = userProfile?.isPremium ? [
    'Unlimited AI-powered LinkedIn replies',
    'Advanced analytics and insights',
    'Priority customer support',
    'Custom branding options'
  ] : [
    'Limited AI-powered replies (5 per day)',
    'Basic analytics',
    'Community support'
  ];

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200">
      {/* Header */}
      <div className="bg-[#111624]/80 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Your Subscription</h1>
              <p className="text-gray-400 mt-2">Control your plan, billing, and account settings</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-400">{error}</p>
              <button
                onClick={retryDataLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                Retry {retryCount > 0 && `(${retryCount})`}
              </button>
            </div>
          </div>
        )}

        {pageLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-300">Loading subscription data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Information */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Current Plan Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{currentPlan} Plan</h3>
                    <p className="text-gray-400 text-sm">
                      {userProfile?.isPremium 
                        ? `Active since ${userProfile.premiumStartDate?.toLocaleDateString()}`
                        : 'Free tier with basic features'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    {userProfile?.isPremium && (
                      <>
                        <div className="text-2xl font-bold text-green-400">
                          {pricingData?.formattedMonthly || '₹999'}/month
                        </div>
                        <div className="text-sm text-gray-400">
                          Renews monthly
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Plan Benefits:</h4>
                  <ul className="space-y-1">
                    {planBenefits.map((benefit, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Upgrade/Downgrade Options */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Plan Options
              </h2>

              <div className="space-y-4">
                {!userProfile?.isPremium ? (
                  <div className="space-y-4">
                    <p className="text-gray-300">Upgrade to Premium to unlock all features:</p>
                    <div className="flex flex-wrap gap-3">
                      <PaymentButton
                        planName="Premium"
                        planType="monthly"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Upgrade to Premium
                      </PaymentButton>
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="border border-gray-600 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Compare Plans
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-300">You're currently on the Premium plan.</p>
                    <div className="flex flex-wrap gap-3">
                      <button className="border border-gray-600 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
                        Switch to Annual (Save 20%)
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="border border-red-600 hover:border-red-500 text-red-400 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Downgrade to Free
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Billing */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                Payment & Billing
              </h2>

              <div className="space-y-6">
                {/* Billing History */}
                <div>
                  <h3 className="font-medium text-white mb-3">Billing History</h3>
                  {billingHistory.length > 0 ? (
                    <div className="space-y-2">
                      {billingHistory.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{invoice.description}</div>
                            <div className="text-gray-400 text-sm">{invoice.date.toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {invoice.formattedAmount || `${invoice.currency === 'INR' ? '₹' : '$'}${invoice.amount}`}
                            </div>
                            <div className={`text-sm ${invoice.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No billing history available</p>
                  )}
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-medium text-white mb-3">Payment Method</h3>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" />
                      </svg>
                      <div>
                        <div className="text-white font-medium">Razorpay</div>
                        <div className="text-gray-400 text-sm">UPI, Cards, Net Banking</div>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Subscription Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Current Status</div>
                    <div className="text-gray-400 text-sm">
                      {userProfile?.isPremium ? 'Active Premium Subscription' : 'Free Plan'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    userProfile?.isPremium ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {userProfile?.isPremium ? 'Active' : 'Free'}
                  </div>
                </div>

                {userProfile?.isPremium && (
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Cancel Subscription
                    </button>
                    <p className="text-gray-400 text-xs mt-1">
                      You'll retain access until your next billing date
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Details */}
            {userProfile && (
              <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white text-right break-all max-w-48">{userProfile.userEmail || user?.email || chromeUserData?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Display Name</span>
                    <span className="text-white">{userProfile.displayName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email Verified</span>
                    <span className={userProfile.emailVerified ? 'text-green-400' : 'text-yellow-400'}>
                      {userProfile.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {userProfile.usage && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Usage</span>
                        <span className="text-white">{userProfile.usage.totalUsage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Quota</span>
                        <span className="text-white">
                          {userProfile.usage.quotaLimit === -1 ? 'Unlimited' : userProfile.usage.quotaLimit}
                        </span>
                      </div>
                    </>
                  )}
                  {chromeStorageData && (
                    <>
                      <div className="pt-2 border-t border-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Extension Status</span>
                          <span className={`text-sm ${
                            chromeStorageData.available && chromeStorageData.authenticated 
                              ? 'text-green-400' 
                              : chromeStorageData.available 
                                ? 'text-yellow-400' 
                                : 'text-red-400'
                          }`}>
                            {chromeStorageData.available && chromeStorageData.authenticated 
                              ? 'Connected & Authenticated' 
                              : chromeStorageData.available 
                                ? 'Available (Not Logged In)' 
                                : 'Not Available'}
                          </span>
                        </div>
                        {chromeStorageData.uid && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Extension UID</span>
                            <span className="text-white text-xs">{chromeStorageData.uid.substring(0, 8)}...</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Account & Legal */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account & Legal</h3>
              <div className="space-y-3">
                <button className="w-full text-left text-gray-300 hover:text-white py-2 border-b border-gray-700">
                  Manage Account Details
                </button>
                <a href="/privacy" className="block text-gray-300 hover:text-white py-2 border-b border-gray-700">
                  Privacy Policy
                </a>
                <a href="/terms" className="block text-gray-300 hover:text-white py-2 border-b border-gray-700">
                  Terms of Service
                </a>
                <a href="/refund" className="block text-gray-300 hover:text-white py-2">
                  Refund Policy
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <div className="space-y-3">
                <a href="/contact" className="block text-gray-300 hover:text-white py-2 border-b border-gray-700">
                  Contact Support
                </a>
                <a href="#" className="block text-gray-300 hover:text-white py-2">
                  Help & FAQs
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#181c28]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Since</span>
                  <span className="text-white">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : chromeUserData?.createdAt ? new Date(chromeUserData.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white">{currentPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={userProfile?.isPremium ? 'text-green-400' : 'text-gray-400'}>
                    {userProfile?.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
                {userProfile?.usage && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Usage This Month</span>
                    <span className="text-white">{userProfile.usage.monthlyUsage || 0}</span>
                  </div>
                )}
                {chromeStorageData && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Extension</span>
                    <span className={`text-sm ${
                      chromeStorageData.available && chromeStorageData.authenticated 
                        ? 'text-green-400' 
                        : chromeStorageData.available 
                          ? 'text-yellow-400' 
                          : 'text-red-400'
                    }`}>
                      {chromeStorageData.available && chromeStorageData.authenticated 
                        ? 'Connected' 
                        : chromeStorageData.available 
                          ? 'Not Logged In' 
                          : 'Not Available'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181c28] border border-gray-700 rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Cancel Subscription?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features 
              at the end of your current billing period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 border border-gray-600 hover:border-gray-500 text-gray-300 py-2 px-4 rounded-lg"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 flex items-center justify-center">
      <div className="flex items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading subscription page...</span>
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SubscriptionsPageContent />
    </Suspense>
  );
}