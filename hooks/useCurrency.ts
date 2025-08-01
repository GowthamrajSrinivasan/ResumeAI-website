import { useState, useEffect } from 'react';
import { getUserCurrencyInfo, convertPrice, formatPrice, CurrencyInfo, getLocalizedPricing, PlanPricing } from '@/lib/currency-service';

export interface UseCurrencyResult {
  currency: CurrencyInfo | null;
  isLoading: boolean;
  error: string | null;
  convertPrice: (amountInINR: number) => Promise<number>;
  formatPrice: (amount: number) => string;
  convertAndFormat: (amountInINR: number) => Promise<string>;
  getLocalizedPricing: () => Promise<PlanPricing>;
}

export function useCurrency(): UseCurrencyResult {
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { currency: userCurrency } = await getUserCurrencyInfo();
        setCurrency(userCurrency);
        
        console.log('🌍 Currency initialized:', {
          code: userCurrency.code,
          symbol: userCurrency.symbol,
          name: userCurrency.name
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to detect currency';
        setError(errorMessage);
        console.error('Currency detection failed:', err);
        
        // Fallback to INR
        setCurrency({ 
          code: 'INR', 
          symbol: '₹', 
          name: 'Indian Rupee'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  const convertPriceToUserCurrency = async (amountInINR: number): Promise<number> => {
    if (!currency) return amountInINR;
    return await convertPrice(amountInINR, currency, 'INR');
  };

  const formatPriceInUserCurrency = (amount: number): string => {
    if (!currency) return `₹${amount}`;
    return formatPrice(amount, currency);
  };

  const convertAndFormatPrice = async (amountInINR: number): Promise<string> => {
    if (!currency) return `₹${amountInINR}`;
    const converted = await convertPrice(amountInINR, currency, 'INR');
    return formatPrice(converted, currency);
  };

  const getLocalizedPricingData = async (): Promise<PlanPricing> => {
    return await getLocalizedPricing();
  };

  return {
    currency,
    isLoading,
    error,
    convertPrice: convertPriceToUserCurrency,
    formatPrice: formatPriceInUserCurrency,
    convertAndFormat: convertAndFormatPrice,
    getLocalizedPricing: getLocalizedPricingData
  };
}