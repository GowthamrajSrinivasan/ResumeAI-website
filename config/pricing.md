# Requill Pricing Configuration

This file contains the pricing configuration for different countries and currencies. Prices are set manually for key markets, with automatic USD-based conversion for other countries.

## Base Pricing (USD)
These are the base prices in USD that will be used for automatic conversion to other currencies:

```yaml
base_pricing:
  monthly: 12
  annual: 120
```

## Manual Country-Specific Pricing

### India (INR)
```yaml
IN:
  currency: INR
  symbol: ₹
  monthly: 99
  annual: 999
  notes: "Primary market - competitive local pricing"
```

### United State19s (USD)
```yaml
US:
  currency: USD
  symbol: $
  monthly: 3.99
  annual: 39.99
  notes: "Base pricing market"
```

### United Kingdom (GBP)
```yaml
GB:
  currency: GBP
  symbol: £
  monthly: 9
  annual: 90
  notes: "Premium market pricing"
```

### European Union (EUR)
```yaml
DE:
  currency: EUR
  symbol: €
  monthly: 10
  annual: 100
  notes: "EU representative pricing"

FR:
  currency: EUR
  symbol: €
  monthly: 10
  annual: 100

IT:
  currency: EUR
  symbol: €
  monthly: 10
  annual: 100

ES:
  currency: EUR
  symbol: €
  monthly: 10
  annual: 100

NL:
  currency: EUR
  symbol: €
  monthly: 10
  annual: 100
```

### Canada (CAD)
```yaml
CA:
  currency: CAD
  symbol: C$
  monthly: 3.99
  annual: 39.99
  notes: "Competitive with US pricing"
```

### Australia (AUD)
```yaml
AU:
  currency: AUD
  symbol: A$
  monthly: 18
  annual: 180
  notes: "Regional pricing for Australia"
```

### Singapore (SGD)
```yaml
SG:
  currency: SGD
  symbol: S$
  monthly: 16
  annual: 160
  notes: "Southeast Asia hub pricing"
```

### UAE (AED)
```yaml
AE:
  currency: AED
  symbol: د.إ
  monthly: 44
  annual: 440
  notes: "Middle East premium pricing"
```

### Japan (JPY)
```yaml
JP:
  currency: JPY
  symbol: ¥
  monthly: 1800
  annual: 18000
  notes: "Japan market pricing"
```

### South Korea (KRW)
```yaml
KR:
  currency: KRW
  symbol: ₩
  monthly: 16000
  annual: 160000
  notes: "South Korea market pricing"
```

## Auto-Conversion Rules

For countries not explicitly listed above, the system will:

1. **Detect user's country** via IP geolocation and browser settings
2. **Use base USD pricing** ($12 monthly, $120 annual)
3. **Convert to local currency** using real-time exchange rates
4. **Apply currency-specific formatting** (decimals, symbols, etc.)

## Supported Currencies for Auto-Conversion

The following currencies are supported for automatic USD conversion:

- **BRL** (Brazilian Real) - Brazil
- **MXN** (Mexican Peso) - Mexico
- **CHF** (Swiss Franc) - Switzerland
- **NOK** (Norwegian Krone) - Norway
- **SEK** (Swedish Krona) - Sweden
- **DKK** (Danish Krone) - Denmark
- **PLN** (Polish Złoty) - Poland
- **CZK** (Czech Koruna) - Czech Republic
- **HUF** (Hungarian Forint) - Hungary
- **RON** (Romanian Leu) - Romania
- **BGN** (Bulgarian Lev) - Bulgaria
- **HRK** (Croatian Kuna) - Croatia
- **RUB** (Russian Ruble) - Russia
- **UAH** (Ukrainian Hryvnia) - Ukraine
- **TRY** (Turkish Lira) - Turkey
- **ILS** (Israeli Shekel) - Israel
- **SAR** (Saudi Riyal) - Saudi Arabia
- **QAR** (Qatari Riyal) - Qatar
- **KWD** (Kuwaiti Dinar) - Kuwait
- **BHD** (Bahraini Dinar) - Bahrain
- **OMR** (Omani Rial) - Oman
- **JOD** (Jordanian Dinar) - Jordan
- **LBP** (Lebanese Pound) - Lebanon
- **EGP** (Egyptian Pound) - Egypt
- **MAD** (Moroccan Dirham) - Morocco
- **TND** (Tunisian Dinar) - Tunisia
- **DZD** (Algerian Dinar) - Algeria
- **LYD** (Libyan Dinar) - Libya
- **ZAR** (South African Rand) - South Africa
- **NGN** (Nigerian Naira) - Nigeria
- **GHS** (Ghanaian Cedi) - Ghana
- **KES** (Kenyan Shilling) - Kenya
- **UGX** (Ugandan Shilling) - Uganda
- **TZS** (Tanzanian Shilling) - Tanzania
- **ETB** (Ethiopian Birr) - Ethiopia
- **EGP** (Egyptian Pound) - Egypt
- **CNY** (Chinese Yuan) - China
- **HKD** (Hong Kong Dollar) - Hong Kong
- **TWD** (Taiwan Dollar) - Taiwan
- **THB** (Thai Baht) - Thailand
- **VND** (Vietnamese Dong) - Vietnam
- **IDR** (Indonesian Rupiah) - Indonesia
- **MYR** (Malaysian Ringgit) - Malaysia
- **PHP** (Philippine Peso) - Philippines
- **LKR** (Sri Lankan Rupee) - Sri Lanka
- **PKR** (Pakistani Rupee) - Pakistan
- **BDT** (Bangladeshi Taka) - Bangladesh
- **NPR** (Nepalese Rupee) - Nepal
- **MMK** (Myanmar Kyat) - Myanmar
- **KHR** (Cambodian Riel) - Cambodia
- **LAK** (Lao Kip) - Laos
- **BND** (Brunei Dollar) - Brunei

## Exchange Rate Source

For automatic conversions, the system uses real-time exchange rates from reliable financial APIs. Rates are cached for performance and updated periodically.

## Notes

- **Manual pricing takes precedence** over auto-conversion
- **Prices should be reviewed quarterly** for competitiveness
- **Consider local market conditions** when setting manual prices
- **Test payments in each currency** before going live
- **Monitor conversion rates** for significant fluctuations

## Usage in Code

The pricing configuration is automatically loaded by the currency service:

```typescript
import { getLocalizedPricing } from '@/lib/currency-service';

const pricing = await getLocalizedPricing();
// Returns localized pricing based on user's country
```