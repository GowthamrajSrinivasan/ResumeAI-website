// Currency conversion service with configuration-based pricing

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  conversionRate?: number; // Optional for config-based pricing
}

export interface CountryPricing {
  currency: string;
  symbol: string;
  monthly: number;
  annual: number;
  notes?: string;
}

export interface PricingConfig {
  base_pricing: { monthly: number; annual: number };
  countries: Record<string, CountryPricing>;
}

// Cached pricing configuration
let cachedPricingConfig: PricingConfig | null = null;
let cachedExchangeRates: Record<string, number> = {};
let exchangeRatesLastUpdated = 0;
const EXCHANGE_RATE_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Currency symbol mappings for auto-conversion
const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'KRW': '₩', 'CAD': 'C$', 'AUD': 'A$',
  'SGD': 'S$', 'AED': 'د.إ', 'INR': '₹', 'BRL': 'R$', 'MXN': '$', 'CHF': '₣',
  'NOK': 'kr', 'SEK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft',
  'RON': 'lei', 'BGN': 'лв', 'HRK': 'kn', 'RUB': '₽', 'UAH': '₴', 'TRY': '₺',
  'ILS': '₪', 'SAR': '﷼', 'QAR': '﷼', 'KWD': 'د.ك', 'BHD': '.د.ب', 'OMR': '﷼',
  'JOD': 'د.ا', 'LBP': '£', 'EGP': '£', 'MAD': 'د.م.', 'TND': 'د.ت', 'DZD': 'د.ج',
  'LYD': 'ل.د', 'ZAR': 'R', 'NGN': '₦', 'GHS': '₵', 'KES': 'KSh', 'UGX': 'USh',
  'TZS': 'TSh', 'ETB': 'Br', 'CNY': '¥', 'HKD': 'HK$', 'TWD': 'NT$', 'THB': '฿',
  'VND': '₫', 'IDR': 'Rp', 'MYR': 'RM', 'PHP': '₱', 'LKR': '₨', 'PKR': '₨',
  'BDT': '৳', 'NPR': '₨', 'MMK': 'K', 'KHR': '៛', 'LAK': '₭', 'BND': 'B$'
};

// Load pricing configuration from generated file
async function loadPricingConfig(): Promise<PricingConfig> {
  if (cachedPricingConfig) {
    return cachedPricingConfig;
  }

  try {
    // Import the generated pricing configuration
    const { PRICING_CONFIG } = await import('./pricing-config.generated');
    cachedPricingConfig = PRICING_CONFIG;
    console.log('💰 Pricing configuration loaded from pricing.md with', Object.keys(PRICING_CONFIG.countries).length, 'countries');
    return PRICING_CONFIG;
  } catch (error) {
    console.error('Failed to load pricing configuration from generated file:', error);
    // Fallback configuration
    const fallbackConfig: PricingConfig = {
      base_pricing: { monthly: 12, annual: 120 },
      countries: {
        'IN': { currency: 'INR', symbol: '₹', monthly: 2.99, annual: 4.99 },
        'US': { currency: 'USD', symbol: '$', monthly: 3.99, annual: 39.99 }
      }
    };
    cachedPricingConfig = fallbackConfig;
    console.warn('💰 Using fallback pricing configuration');
    return fallbackConfig;
  }
}

// Get exchange rates for USD conversion
async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cachedExchangeRates && Object.keys(cachedExchangeRates).length > 0 && 
      (now - exchangeRatesLastUpdated) < EXCHANGE_RATE_CACHE_DURATION) {
    return cachedExchangeRates;
  }

  try {
    // Using a free exchange rate API (in production, use a reliable paid service)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (response.ok) {
      const data = await response.json();
      cachedExchangeRates = data.rates || {};
      exchangeRatesLastUpdated = now;
      console.log('💱 Exchange rates updated:', Object.keys(cachedExchangeRates).length, 'currencies');
      return cachedExchangeRates;
    }
  } catch (error) {
    console.warn('Failed to fetch exchange rates:', error);
  }

  // Fallback exchange rates (approximate)
  const fallbackRates = {
    'INR': 83, 'EUR': 0.85, 'GBP': 0.75, 'JPY': 150, 'KRW': 1300, 'CAD': 1.25,
    'AUD': 1.50, 'SGD': 1.35, 'AED': 3.67, 'BRL': 5.0, 'MXN': 20, 'CHF': 0.90,
    'NOK': 10, 'SEK': 10.5, 'DKK': 6.5, 'PLN': 4.0, 'CZK': 23, 'HUF': 350,
    'CNY': 7.2, 'HKD': 7.8, 'THB': 35, 'MYR': 4.5, 'PHP': 56, 'IDR': 15000
  };
  
  cachedExchangeRates = fallbackRates;
  exchangeRatesLastUpdated = now;
  console.log('💱 Using fallback exchange rates');
  return fallbackRates;
}

// Get user's country code from various sources
export async function getUserCountry(): Promise<string> {
  try {
    // Method 1: Try to get from IP geolocation API
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.country_code) {
        console.log('Country detected via IP:', data.country_code);
        return data.country_code.toUpperCase();
      }
    }
  } catch (error) {
    console.warn('IP geolocation failed:', error);
  }

  try {
    // Method 2: Try browser's Intl API
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale) {
      const countryCode = locale.split('-')[1]?.toUpperCase();
      if (countryCode) {
        console.log('Country detected via Intl API:', countryCode);
        return countryCode;
      }
    }
  } catch (error) {
    console.warn('Intl API failed:', error);
  }

  // Method 3: Try navigator.language
  try {
    const language = navigator.language || navigator.languages?.[0];
    if (language) {
      const countryCode = language.split('-')[1]?.toUpperCase();
      if (countryCode) {
        console.log('Country detected via navigator:', countryCode);
        return countryCode;
      }
    }
  } catch (error) {
    console.warn('Navigator language detection failed:', error);
  }

  // Default to India
  console.log('Using default country: IN');
  return 'IN';
}

// Detect likely currency for a country not in manual config
function detectCurrencyForCountry(countryCode: string): string {
  const currencyMap: Record<string, string> = {
    // Major currencies
    'BR': 'BRL', 'MX': 'MXN', 'CH': 'CHF', 'NO': 'NOK', 'SE': 'SEK', 'DK': 'DKK',
    'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK',
    'RU': 'RUB', 'UA': 'UAH', 'TR': 'TRY', 'IL': 'ILS', 'SA': 'SAR', 'QA': 'QAR',
    'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR', 'JO': 'JOD', 'LB': 'LBP', 'EG': 'EGP',
    'MA': 'MAD', 'TN': 'TND', 'DZ': 'DZD', 'LY': 'LYD', 'ZA': 'ZAR', 'NG': 'NGN',
    'GH': 'GHS', 'KE': 'KES', 'UG': 'UGX', 'TZ': 'TZS', 'ET': 'ETB', 'CN': 'CNY',
    'HK': 'HKD', 'TW': 'TWD', 'TH': 'THB', 'VN': 'VND', 'ID': 'IDR', 'MY': 'MYR',
    'PH': 'PHP', 'LK': 'LKR', 'PK': 'PKR', 'BD': 'BDT', 'NP': 'NPR', 'MM': 'MMK',
    'KH': 'KHR', 'LA': 'LAK', 'BN': 'BND'
  };
  
  return currencyMap[countryCode] || 'USD'; // Default to USD for unknown countries
}

// Get currency name
function getCurrencyName(currencyCode: string): string {
  const names: Record<string, string> = {
    'USD': 'US Dollar', 'EUR': 'Euro', 'GBP': 'British Pound', 'JPY': 'Japanese Yen',
    'KRW': 'South Korean Won', 'CAD': 'Canadian Dollar', 'AUD': 'Australian Dollar',
    'SGD': 'Singapore Dollar', 'AED': 'UAE Dirham', 'INR': 'Indian Rupee',
    'BRL': 'Brazilian Real', 'MXN': 'Mexican Peso', 'CHF': 'Swiss Franc',
    'NOK': 'Norwegian Krone', 'SEK': 'Swedish Krona', 'DKK': 'Danish Krone',
    'PLN': 'Polish Złoty', 'CZK': 'Czech Koruna', 'HUF': 'Hungarian Forint',
    'CNY': 'Chinese Yuan', 'HKD': 'Hong Kong Dollar', 'THB': 'Thai Baht',
    'MYR': 'Malaysian Ringgit', 'PHP': 'Philippine Peso', 'IDR': 'Indonesian Rupiah'
  };
  
  return names[currencyCode] || `${currencyCode} Currency`;
}

// Get currency info for a country with configuration-based pricing
export async function getCurrencyForCountry(countryCode: string): Promise<CurrencyInfo> {
  const config = await loadPricingConfig();
  
  // Check if country has manual pricing configuration
  const countryConfig = config.countries[countryCode];
  if (countryConfig) {
    return {
      code: countryConfig.currency,
      symbol: countryConfig.symbol,
      name: getCurrencyName(countryConfig.currency)
    };
  }
  
  // For countries not in config, detect their currency and prepare for USD conversion
  const currencyCode = detectCurrencyForCountry(countryCode);
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';
  
  return {
    code: currencyCode,
    symbol: symbol,
    name: getCurrencyName(currencyCode)
  };
}

// Round currency amount based on currency characteristics
function roundCurrencyAmount(amount: number, currencyCode: string): number {
  // Currencies that don't use decimal places
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'KHR', 'LAK', 'MMK', 'UGX', 'TZS'];
  
  if (noDecimalCurrencies.includes(currencyCode)) {
    return Math.round(amount);
  }
  
  // Most currencies use 2 decimal places
  return Math.round(amount * 100) / 100;
}

// Convert price using configuration-based or USD-based conversion
export async function convertPrice(baseAmount: number, targetCurrency: CurrencyInfo, baseIn: 'INR' | 'USD' = 'INR'): Promise<number> {
  // If baseIn is USD and target is USD, no conversion needed
  if (baseIn === 'USD' && targetCurrency.code === 'USD') {
    return baseAmount;
  }
  
  // If converting from USD to other currencies (for auto-conversion)
  if (baseIn === 'USD' && targetCurrency.code !== 'USD') {
    const exchangeRates = await getExchangeRates();
    const exchangeRate = exchangeRates[targetCurrency.code];
    
    if (exchangeRate) {
      const convertedPrice = baseAmount * exchangeRate;
      return roundCurrencyAmount(convertedPrice, targetCurrency.code);
    }
  }
  
  // Legacy INR-based conversion (for backward compatibility)
  if (baseIn === 'INR' && targetCurrency.conversionRate) {
    const convertedPrice = baseAmount * targetCurrency.conversionRate;
    return roundCurrencyAmount(convertedPrice, targetCurrency.code);
  }
  
  // Fallback: return original amount
  return baseAmount;
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: CurrencyInfo): string {
  return `${currency.symbol}${amount.toLocaleString()}`;
}

// Get currency display info for user
export async function getUserCurrencyInfo(): Promise<{
  currency: CurrencyInfo;
  countryCode: string;
}> {
  const countryCode = await getUserCountry();
  const currency = await getCurrencyForCountry(countryCode);
  
  return { currency, countryCode };
}

// Convert plan prices based on user's currency using configuration
export interface PlanPricing {
  monthly: number;
  annual: number;
  currency: CurrencyInfo;
  formattedMonthly: string;
  formattedAnnual: string;
  pricingSource: 'manual' | 'auto-converted';
}

export async function getLocalizedPricing(): Promise<PlanPricing> {
  const { currency, countryCode } = await getUserCurrencyInfo();
  const config = await loadPricingConfig();
  
  // Check if country has manual pricing
  const countryConfig = config.countries[countryCode];
  if (countryConfig) {
    console.log(`💰 Using manual pricing for ${countryCode} (${currency.code})`);
    return {
      monthly: countryConfig.monthly,
      annual: countryConfig.annual,
      currency,
      formattedMonthly: formatPrice(countryConfig.monthly, currency),
      formattedAnnual: formatPrice(countryConfig.annual, currency),
      pricingSource: 'manual'
    };
  }
  
  // Auto-convert from USD base pricing
  console.log(`💱 Using USD-based conversion for ${countryCode} (${currency.code})`);
  const basePricing = config.base_pricing;
  const monthly = await convertPrice(basePricing.monthly, currency, 'USD');
  const annual = await convertPrice(basePricing.annual, currency, 'USD');
  
  return {
    monthly,
    annual,
    currency,
    formattedMonthly: formatPrice(monthly, currency),
    formattedAnnual: formatPrice(annual, currency),
    pricingSource: 'auto-converted'
  };
}

// Get pricing for specific amounts (backward compatibility)
export async function getLocalizedPricingForAmounts(basePrices: {
  monthly: number; // Base price in INR
  annual: number;  // Base price in INR
}): Promise<PlanPricing> {
  const { currency } = await getUserCurrencyInfo();
  
  const monthly = await convertPrice(basePrices.monthly, currency, 'INR');
  const annual = await convertPrice(basePrices.annual, currency, 'INR');
  
  return {
    monthly,
    annual,
    currency,
    formattedMonthly: formatPrice(monthly, currency),
    formattedAnnual: formatPrice(annual, currency),
    pricingSource: 'auto-converted'
  };
}