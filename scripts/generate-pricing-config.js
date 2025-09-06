#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Build-time script to parse pricing.md and generate TypeScript configuration
 * This ensures pricing changes in the markdown file automatically reflect in the app
 */

function parsePricingMarkdown() {
  console.log('🔧 Generating pricing configuration from pricing.md...');
  
  try {
    // Read the pricing.md file
    const pricingMdPath = path.join(__dirname, '../config/pricing.md');
    const content = fs.readFileSync(pricingMdPath, 'utf-8')
      .replace(/\r\n/g, '\n')  // Normalize Windows line endings
      .replace(/\r/g, '\n');   // Normalize Mac line endings
    
    // Initialize configuration
    const config = {
      base_pricing: { monthly: 12, annual: 120 },
      countries: {}
    };
    
    // Parse base pricing
    const basePricingMatch = content.match(/base_pricing:\s*\n\s*monthly:\s*(\d+(?:\.\d+)?)\s*\n\s*annual:\s*(\d+(?:\.\d+)?)/);
    if (basePricingMatch) {
      config.base_pricing.monthly = parseFloat(basePricingMatch[1]);
      config.base_pricing.annual = parseFloat(basePricingMatch[2]);
      console.log(`💰 Base pricing: $${config.base_pricing.monthly}/$${config.base_pricing.annual}`);
    }
    
    // Parse country-specific pricing blocks
    const yamlBlocks = content.match(/```yaml\n([\s\S]*?)\n```/g);
    
    console.log(`🔍 Found ${yamlBlocks ? yamlBlocks.length : 0} YAML blocks`);
    
    if (yamlBlocks) {
      yamlBlocks.forEach(block => {
        try {
          // Remove the yaml block markers
          const yamlContent = block.replace(/```yaml\n/, '').replace(/\n```/, '');
          
          // Skip base pricing block
          if (yamlContent.includes('base_pricing:')) {
            return;
          }
          
          // Split by country entries (lines that start with two capital letters and colon)
          const countryEntries = yamlContent.split(/\n(?=[A-Z]{2}:)/);
          
          countryEntries.forEach(entry => {
            const lines = entry.trim().split('\n');
            if (lines.length === 0) return;
            
            // Extract country code
            const countryMatch = lines[0].match(/^([A-Z]{2}):/);
            if (!countryMatch) return;
            
            const countryCode = countryMatch[1];
            const countryData = {};
            
            // Parse each property
            lines.forEach(line => {
              const currencyMatch = line.match(/^\s*currency:\s*([A-Z]{3})/);
              const symbolMatch = line.match(/^\s*symbol:\s*(.+)$/);
              const monthlyMatch = line.match(/^\s*monthly:\s*(\d+(?:\.\d+)?)/);
              const annualMatch = line.match(/^\s*annual:\s*(\d+(?:\.\d+)?)/);
              const notesMatch = line.match(/^\s*notes:\s*"([^"]+)"/);
              
              if (currencyMatch) countryData.currency = currencyMatch[1];
              if (symbolMatch) countryData.symbol = symbolMatch[1].trim();
              if (monthlyMatch) countryData.monthly = parseFloat(monthlyMatch[1]);
              if (annualMatch) countryData.annual = parseFloat(annualMatch[1]);
              if (notesMatch) countryData.notes = notesMatch[1];
            });
            
            // Only add if we have complete data
            if (countryData.currency && countryData.symbol && 
                countryData.monthly !== undefined && countryData.annual !== undefined) {
              config.countries[countryCode] = countryData;
              console.log(`🌍 ${countryCode}: ${countryData.symbol}${countryData.monthly}/${countryData.symbol}${countryData.annual}`);
            }
          });
        } catch (error) {
          console.warn(`⚠️  Failed to parse yaml block: ${error.message}`);
        }
      });
    }
    
    // Generate TypeScript configuration file
    const configContent = `// Auto-generated from pricing.md - DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}
// Source: config/pricing.md

import { PricingConfig } from './currency-service';

export const PRICING_CONFIG: PricingConfig = ${JSON.stringify(config, null, 2)};

export default PRICING_CONFIG;
`;
    
    // Write the generated configuration
    const outputPath = path.join(__dirname, '../lib/pricing-config.generated.ts');
    fs.writeFileSync(outputPath, configContent);
    
    console.log(`✅ Generated pricing configuration with ${Object.keys(config.countries).length} countries`);
    console.log(`📄 Output: ${outputPath}`);
    
    return config;
    
  } catch (error) {
    console.error('❌ Failed to generate pricing configuration:', error);
    process.exit(1);
  }
}

// Run the parser
if (require.main === module) {
  parsePricingMarkdown();
}

module.exports = { parsePricingMarkdown };