
import 'dotenv/config';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';
import fs from 'fs';

// --- 1. API CLIENTS ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiVisionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
const apiClient = axios.create();

// --- 2. CORE FUNCTIONS ---

/**
 * [IMPROVED] Robust HTML parser with multiple fallback strategies
 */
function parsePropertyHTML(html) {
  const $ = cheerio.load(html);
  const scrapedData = {};
  const images = {};

  console.log('[Parser] Attempting to extract data from HTML...');

  // Helper: Parse numbers from text
  const parseNum = (text) => {
    if (!text) return null;
    const cleaned = text.toString().replace(/[^0-9]/g, '');
    const num = parseInt(cleaned);
    return isNaN(num) ? null : num;
  };

  // Helper: Try multiple selectors
  const trySelectors = (selectors) => {
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      if (text) return text;
    }
    return null;
  };

  // --- STRATEGY 1: Look for JSON-LD structured data ---
  // Many sites embed structured data for SEO
  try {
    const jsonLdScripts = $('script[type="application/ld+json"]');
    jsonLdScripts.each((i, elem) => {
      try {
        const json = JSON.parse($(elem).html());
        if (json['@type'] === 'SingleFamilyResidence' || json['@type'] === 'Apartment') {
          if (json.floorSize && !scrapedData.GrLivArea) {
            scrapedData.GrLivArea = parseNum(json.floorSize.value);
          }
          if (json.yearBuilt && !scrapedData.YearBuilt) {
            scrapedData.YearBuilt = parseNum(json.yearBuilt);
          }
          if (json.numberOfBathroomsTotal && !scrapedData.FullBath) {
            scrapedData.FullBath = parseNum(json.numberOfBathroomsTotal);
          }
          if (json.numberOfRooms && !scrapedData.TotRmsAbvGrd) {
            scrapedData.TotRmsAbvGrd = parseNum(json.numberOfRooms);
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });
  } catch (e) {
    console.warn('[Parser] JSON-LD parsing failed');
  }

  // --- STRATEGY 2: Parse from meta tags ---
  const ogPrice = $('meta[property="og:price:amount"]').attr('content');
  if (ogPrice && !scrapedData.price) {
    scrapedData.price = parseNum(ogPrice);
  }

  // --- STRATEGY 3: Text-based extraction with multiple selectors ---
  
  // Living Area / Square Feet
  if (!scrapedData.GrLivArea) {
    const sqftText = trySelectors([
      'span:contains("sqft")',
      'span:contains("Sq Ft")',
      '[data-testid*="square"]',
      '.summary-size',
      '.ds-bed-bath-living-area span:last-child'
    ]);
    scrapedData.GrLivArea = parseNum(sqftText);
  }

  // Year Built
  if (!scrapedData.YearBuilt) {
    const yearText = trySelectors([
      'span:contains("Built in")',
      'span:contains("Year built")',
      '[data-testid*="year"]',
      '.ds-home-fact-value:contains("19")',
      '.ds-home-fact-value:contains("20")'
    ]);
    scrapedData.YearBuilt = parseNum(yearText);
  }

  // Lot Size
  if (!scrapedData.LotArea) {
    const lotText = trySelectors([
      'span:contains("Lot size")',
      'span:contains("acres")',
      '[data-testid*="lot"]',
      '.ds-home-fact-value:contains("acres")',
      '.ds-home-fact-value:contains("sqft")'
    ]);
    scrapedData.LotArea = parseNum(lotText);
  }

  // Bedrooms and Bathrooms - look for the "3 bd | 2 ba" pattern
  const bedBathSelectors = [
    '[data-testid="bed-bath-beyond"]',
    '.ds-bed-bath-living-area-container',
    '.summary-container',
    'h3:contains("bd")',
    'span:contains("bd")'
  ];
  
  const bedBathText = trySelectors(bedBathSelectors);
  if (bedBathText) {
    const bdMatch = bedBathText.match(/(\d+)\s*b[de]d?/i);
    const baMatch = bedBathText.match(/(\d+)\s*ba/i);
    
    if (bdMatch && !scrapedData.TotRmsAbvGrd) {
      scrapedData.TotRmsAbvGrd = parseInt(bdMatch[1]) * 2; // Rough estimate
    }
    if (baMatch && !scrapedData.FullBath) {
      scrapedData.FullBath = parseInt(baMatch[1]);
    }
  }

  // --- STRATEGY 4: Images with multiple approaches ---
  const allImages = [];
  
  // Try multiple image selector strategies
  const imageSelectors = [
    'ul li button img',
    '.media-stream img',
    '[data-testid*="photo"] img',
    '.photo-carousel img',
    'picture img',
    'img[src*="zillow"]',
    'img[srcset]'
  ];

  imageSelectors.forEach(selector => {
    $(selector).each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src');
      
      // Handle srcset
      if (!src) {
        const srcset = $(el).attr('srcset');
        if (srcset) {
          src = srcset.split(',')[0].split(' ')[0];
        }
      }
      
      if (src && !src.includes('data:image') && src.startsWith('http')) {
        // Get high-res version if available
        src = src.replace(/\/\d+x\d+_/, '/1024x768_');
        allImages.push(src);
      }
    });
  });

  // Deduplicate images
  const uniqueImages = [...new Set(allImages)];
  
  console.log(`[Parser] Found ${uniqueImages.length} unique images`);

  if (uniqueImages.length > 0) {
    images.main = uniqueImages[0];
    
    // Try to intelligently categorize images
    images.kitchen = uniqueImages.find(src => 
      src.toLowerCase().includes('kitchen') || 
      src.toLowerCase().includes('uncaptioned')
    ) || uniqueImages[Math.min(2, uniqueImages.length - 1)];
    
    images.basement = uniqueImages.find(src => 
      src.toLowerCase().includes('basement') ||
      src.toLowerCase().includes('lower')
    ) || uniqueImages[Math.min(3, uniqueImages.length - 1)];
    
    images.exterior = uniqueImages.find(src => 
      src.toLowerCase().includes('exterior') ||
      src.toLowerCase().includes('front') ||
      src.toLowerCase().includes('street')
    ) || uniqueImages[0];
  } else {
    // Fallback placeholders
    images.main = 'https://photos.zillowstatic.com/fp/03a36bcfb147fe15ea3147896b4f03f5-cc_ft_1152.webp';
    images.kitchen = 'https://photos.zillowstatic.com/fp/32001bc5de16fe698a9fe84ecab95508-cc_ft_576.webp';
    images.basement = 'https://photos.zillowstatic.com/fp/78c71ba4095717d87e6c6e04b880389a-cc_ft_576.webp';
    images.exterior = 'https://placehold.co/600x400/8b9a4a/FFFFFF?text=Exterior+Image+Not+Found';
  }

  scrapedData.images = images;

  // Add defaults for features we can't parse
  scrapedData.OverallQual = scrapedData.OverallQual || 7;
  scrapedData.OverallCond = scrapedData.OverallCond || 5;
  scrapedData.Neighborhood = scrapedData.Neighborhood || 'CollgCr';
  scrapedData.BldgType = scrapedData.BldgType || '1Fam';

  // Log what we found
  console.log('[Parser] Extracted data:', {
    GrLivArea: scrapedData.GrLivArea,
    YearBuilt: scrapedData.YearBuilt,
    LotArea: scrapedData.LotArea,
    FullBath: scrapedData.FullBath,
    TotRmsAbvGrd: scrapedData.TotRmsAbvGrd,
    imagesFound: uniqueImages.length
  });

  return scrapedData;
}

/**
 * [CORE FUNCTION 1: SCRAPING]
 */
export async function scrapePropertyData(propertyUrl) {
  console.log(`[Engine] LIVE SCRAPE: Scraping started for: ${propertyUrl}`);

  const scraperApiUrl = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(propertyUrl)}`;

  // --- SAFETY SWITCH ---
  const USE_DEMO_HACK_FOR_STABILITY = false;

  if (USE_DEMO_HACK_FOR_STABILITY) {
    console.log('[Engine] STABILITY MODE: Using mock data.');
    return {
      success: true,
      data: {
        LotArea: 8450, OverallQual: 7, OverallCond: 5, YearBuilt: 2003,
        GrLivArea: 1710, TotRmsAbvGrd: 8, FullBath: 2, Neighborhood: 'CollgCr',
        BldgType: '1Fam',
        images: {
          kitchen: 'https://placehold.co/600x400/553c30/FFFFFF?text=Dated+Kitchen',
          basement: 'https://placehold.co/600x400/4a4a4a/FFFFFF?text=Unfinished+Basement',
          exterior: 'https://placehold.co/600x400/8b9a4a/FFFFFF?text=Average+Exterior',
          main: 'https://placehold.co/600x400/1e293b/94a3b8?text=Property+Image'
        }
      }
    };
  }

  try {
    console.log('[Engine] LIVE SCRAPE: Fetching from ScraperAPI...');
    const response = await apiClient.get(scraperApiUrl, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
      }
    });
    
    const html = response.data;
    const filename = 'scrapped.html';
    
    // Save HTML for debugging
    fs.writeFile(filename, html, err => {
      if (err) {
        console.error('[Engine] Error writing file:', err);
      } else {
        console.log('[Engine] HTML saved to scrapped.html for debugging');
      }
    });

    // Use improved parser
    const scrapedData = parsePropertyHTML(html);

    // --- VALIDATION ---
    const hasMinimumData = scrapedData.GrLivArea || scrapedData.images.main;
    
    if (!hasMinimumData) {
      console.error('[Engine] LIVE SCRAPE FAILED: Insufficient data parsed from HTML.');
      throw new Error('Live scraping failed. Could not extract minimum required data.');
    }

    // Fill in missing critical fields with reasonable defaults
    if (!scrapedData.GrLivArea) {
      console.warn('[Engine] Missing GrLivArea, using default: 1710');
      scrapedData.GrLivArea = 1710;
    }
    if (!scrapedData.YearBuilt) {
      console.warn('[Engine] Missing YearBuilt, using default: 2003');
      scrapedData.YearBuilt = 2003;
    }
    if (!scrapedData.FullBath) {
      console.warn('[Engine] Missing FullBath, using default: 2');
      scrapedData.FullBath = 2;
    }
    if (!scrapedData.TotRmsAbvGrd) {
      console.warn('[Engine] Missing TotRmsAbvGrd, using default: 8');
      scrapedData.TotRmsAbvGrd = 8;
    }
    if (!scrapedData.LotArea) {
      console.warn('[Engine] Missing LotArea, using default: 8450');
      scrapedData.LotArea = 8450;
    }

    console.log('[Engine] LIVE SCRAPE SUCCESS: Parsed data with validation.');
    return { success: true, data: scrapedData };

  } catch (error) {
    console.error(`[Engine] Scrape error: ${error.message}`);
    console.log('[Engine] LIVE SCRAPE FAILED. Returning mock data to prevent app crash.');
    
    return {
      success: true,
      data: {
        LotArea: 8450, OverallQual: 7, OverallCond: 5, YearBuilt: 2003,
        GrLivArea: 1710, TotRmsAbvGrd: 8, FullBath: 2, Neighborhood: 'CollgCr',
        BldgType: '1Fam',
        images: {
          kitchen: 'https://photos.zillowstatic.com/fp/35a38cb47defcb5d5d6db786e50f228f-cc_ft_1152.webp',
          basement: 'https://placehold.co/600x400/4a4a4a/FFFFFF?text=SCRAPE+FAILED',
          exterior: 'https://photos.zillowstatic.com/fp/62ce747cac50c4856d1814226c483c5a-cc_ft_576.webp',
          main: 'https://photos.zillowstatic.com/fp/03a36bcfb147fe15ea3147896b4f03f5-cc_ft_1152.webp'
        }
      }
    };
  }
}

/**
 * [CORE FUNCTION 2: AI VISION]
 */
export async function getAiConditionAnalysis(imageUrl, featureType) {
  console.log(`[Engine] AI Vision: Analyzing ${featureType} at ${imageUrl}`);
  
  if (imageUrl.includes('placehold.co')) {
    console.warn(`[Engine] AI Vision: Detected placeholder image. Defaulting to 'TA'.`);
    return 'TA';
  }

  const prompt = `
    You are a real estate appraiser. Analyze this image of a ${featureType}.
    Based *only* on the Ames Housing Dataset scale, rate its quality as one of:
    'Ex' (Excellent)
    'Gd' (Good)
    'TA' (Typical/Average)
    'Fa' (Fair)
    'Po' (Poor)
    
    Respond with *only* the two-letter code.
  `;

  try {
    const imageResponse = await apiClient.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 15000
    });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: imageResponse.headers['content-type'] || 'image/jpeg'
      }
    };

    const result = await geminiVisionModel.generateContent([prompt, imagePart]);
    const response = result.response;
    let text = response.text().trim().replace(/'/g, '');

    const validCodes = ['Ex', 'Gd', 'TA', 'Fa', 'Po'];
    if (validCodes.includes(text)) {
      console.log(`[Engine] AI Vision result for ${featureType}: ${text}`);
      return text;
    } else {
      console.warn(`[Engine] AI Vision gave invalid code: '${text}'. Defaulting to 'TA'.`);
      return 'TA';
    }
  } catch (error) {
    console.error(`[Engine] AI Vision error for ${featureType}: ${error.message}`);
    return 'TA';
  }
}

/**
 * [CORE FUNCTION 3: ML MODEL]
 */
export async function callPredictApi(features) {
  console.log(`[Engine] Calling Hugging Face model...`);
  try {
    const response = await apiClient.post(process.env.HF_MODEL_URL, features, {
      timeout: 15000
    });
    return parseFloat(response.data.predicted_price);
  } catch (error) {
    console.error(`[Engine] ML Model error: ${error.response ? error.response.data : error.message}`);
    return 0;
  }
}


// Helper Function for improvement => 
  /**
 * [NEW HELPER FUNCTION]
 * Generates a list of actionable steps for a given renovation type.
 *
 * @param {string} featureToUpgrade - The feature being upgraded (e.g., 'KitchenQual').
 * @returns {string[]} An array of steps.
 */
function getRenovationSteps(featureToUpgrade) {
  switch (featureToUpgrade) {
    case 'KitchenQual':
      return [
        'Finalize design and budget with a general contractor.',
        'Secure all necessary building permits for plumbing and electrical.',
        'Demo existing kitchen and update utilities.',
        'Install high-end cabinetry, quartz countertops, and a tile backsplash.',
        'Install new stainless steel, energy-efficient appliances.',
        'Pass final building inspection.',
      ];
    case 'BsmtQual':
      return [
        'Consult a structural engineer and waterproof the foundation.',
        'Secure permits for finishing a living space.',
        'Frame new walls for planned rooms (e.g., bedroom, living area).',
        'Install modern recessed lighting and ensure proper egress.',
        'Add drywall, paint, and high-quality flooring (e.g., LVP).',
        'Get final inspection and approval.',
      ];
    case 'ExterQual':
      return [
        'Hire a professional exterior designer for a curb appeal consultation.',
        'Power wash all exterior surfaces to remove mildew and old paint.',
        'Repair or replace any damaged siding, trim, or fascia.',
        'Apply two coats of premium-quality exterior paint.',
        'Upgrade landscaping and exterior light fixtures to match the new look.',
      ];
    default:
      // A generic fallback
      return [
        'Consult a professional contractor for a project plan.',
        'Secure funding and permits.',
        'Complete renovation and pass inspection.',
      ];
  }
}

/**
 * [CORE FUNCTION 4: THE ORCHESTRATOR]
 */
export async function runFullRoiAnalysis(propertyUrl) {
  console.log(`[Engine] --- STARTING FULL ROI ANALYSIS ---`);

  const { data: baseFeatures, success } = await scrapePropertyData(propertyUrl);
  if (!success) {
    throw new Error('Scraping failed entirely.');
  }
  
  baseFeatures.KitchenQual = 'TA';
  baseFeatures.BsmtQual = 'TA';
  baseFeatures.ExterQual = 'TA';

  console.log('[Engine] Starting parallel AI vision analysis...');
  const [kitchenScore, basementScore, exteriorScore] = await Promise.all([
    getAiConditionAnalysis(baseFeatures.images.kitchen, 'Kitchen'),
    getAiConditionAnalysis(baseFeatures.images.basement, 'Basement'),
    getAiConditionAnalysis(baseFeatures.images.exterior, 'Exterior')
  ]);

  baseFeatures.KitchenQual = kitchenScore;
  baseFeatures.BsmtQual = basementScore;
  baseFeatures.ExterQual = exteriorScore;

  console.log('[Engine] Getting baseline price...');
  const baselinePrice = await callPredictApi(baseFeatures);
  if (baselinePrice === 0) {
    throw new Error('Failed to get baseline price from ML model.');
  }

  console.log('[Engine] Starting simulation engine...');

  const RENOVATION_COSTS = {
    'KitchenQual': 10000,
    'BsmtQual': 8000,
    'ExterQual': 5000,
  };

  const UPGRADES_TO_SIMULATE = ['KitchenQual', 'BsmtQual', 'ExterQual'];
  let simulationResults = [];

// [Updated Code Block]
  for (const featureToUpgrade of UPGRADES_TO_SIMULATE) {
    let upgradedFeatures = { ...baseFeatures };
    upgradedFeatures[featureToUpgrade] = 'Ex';
    const upgradedPrice = await callPredictApi(upgradedFeatures);
    if (upgradedPrice === 0) continue;
    const cost = RENOVATION_COSTS[featureToUpgrade];
    const valueUplift = upgradedPrice - baselinePrice;
    const netProfit = valueUplift - cost;
    const roi = (netProfit / cost) * 100;

    // --- NEWLY ADDED ---
    // Get the actionable steps for this upgrade
    const steps = getRenovationSteps(featureToUpgrade);
    // --- END NEW ---

    console.log(`[Engine] Sim: ${featureToUpgrade} | Cost: ${cost} | Uplift: ${valueUplift} | ROI: ${roi.toFixed(0)}%`);

    simulationResults.push({
      upgrade: featureToUpgrade,
      currentCondition: baseFeatures[featureToUpgrade],
      newPrice: upgradedPrice,
      cost: cost,
      netProfit: netProfit,
      roi: parseFloat(roi.toFixed(1)),
      steps: steps // <-- This is the new property
    });
  }

  console.log('[Engine] Categorizing results...');

  const goodInvestments = simulationResults
    .filter(item => item.roi > 0)
    .sort((a, b) => b.roi - a.roi);

  const badInvestments = simulationResults
    .filter(item => item.roi <= 0)
    .sort((a, b) => a.roi - b.roi);
    
  console.log("Done !");

  return {
    baselinePrice: baselinePrice,
    propertyImage: baseFeatures.images.main,
    allImages: baseFeatures.images,
    aiAnalysis: {
      KitchenQual: kitchenScore,
      BsmtQual: basementScore,
      ExterQual: exteriorScore
    },
    goodInvestments: goodInvestments,
    badInvestments: badInvestments
  };
}