const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

/**
 * Website Platform Detection Route
 * Analyzes a website URL to determine its platform (WordPress, Shopify, Squarespace, etc.)
 */

// POST /api/website/detect-platform
router.post('/detect-platform', async (req, res) => {
    try {
        const { url } = req.body;
        
        // Input validation
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Website URL is required'
            });
        }
        
        // Validate URL format
        if (!isValidUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid URL (e.g., https://example.com)'
            });
        }
        
        console.log('🔍 Detecting platform for:', url);
        
        // Demo mode for development and testing
        const demoMode = process.env.NODE_ENV === 'development' || !process.env.USER_AGENT;
        
        if (demoMode) {
            const mockResult = generateMockPlatformDetection(url);
            console.log('📦 Demo mode - returning mock platform data');
            return res.json({
                success: true,
                data: mockResult
            });
        }
        
        // Real platform detection
        const platformData = await detectWebsitePlatform(url);
        
        res.json({
            success: true,
            data: platformData
        });
        
    } catch (error) {
        console.error('🚨 Platform detection error:', error.message);
        
        // Return graceful error with helpful message
        res.status(500).json({
            success: false,
            error: 'Unable to analyze website. Please check the URL and try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * Real platform detection implementation
 * Analyzes website headers, HTML content, and patterns
 */
async function detectWebsitePlatform(url) {
    try {
        // Fetch website with timeout and proper headers
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WebsiteStudio/1.0; +https://example.com/bot)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            maxRedirects: 5
        });
        
        const html = response.data;
        const headers = response.headers;
        const $ = cheerio.load(html);
        
        // Platform detection logic
        const platform = analyzePlatformSignatures(html, headers, $);
        const features = detectPlatformFeatures(html, $);
        const confidence = calculateConfidence(platform, features);
        
        return {
            platform: platform.name,
            confidence: confidence,
            version: platform.version,
            features_detected: features,
            recommendations: generateRecommendations(platform.name),
            analysis_timestamp: new Date().toISOString(),
            response_time: Date.now()
        };
        
    } catch (error) {
        // If website analysis fails, try URL pattern detection
        return analyzeFromUrlPatterns(url);
    }
}

/**
 * Analyze platform based on signatures in HTML and headers
 */
function analyzePlatformSignatures(html, headers, $) {
    const signatures = [
        // Shopify detection
        {
            name: 'shopify',
            patterns: [
                /Shopify\.shop\s*=\s*/i,
                /cdn\.shopify\.com/i,
                /\/assets\/shopify_/i,
                /window\.Shopify\s*=/i
            ],
            selectors: [
                '[data-shopify]',
                '.shopify-section',
                '#shopify-section'
            ],
            headers: ['x-shopify-stage', 'x-shopify-request-id'],
            confidence: 0.95
        },
        
        // WordPress detection
        {
            name: 'wordpress',
            patterns: [
                /wp-content/i,
                /wp-includes/i,
                /wordpress/i,
                /wp-json/i
            ],
            selectors: [
                'link[href*="wp-content"]',
                'script[src*="wp-includes"]',
                'meta[name="generator"][content*="WordPress"]'
            ],
            headers: [],
            confidence: 0.9
        },
        
        // Squarespace detection
        {
            name: 'squarespace',
            patterns: [
                /static1\.squarespace\.com/i,
                /squarespace\.com/i,
                /SQUARESPACE_ROLLUPS/i
            ],
            selectors: [
                '[data-controller="SquareSpace"]',
                '.sqs-block',
                '#siteWrapper'
            ],
            headers: ['x-servedby'],
            confidence: 0.9
        },
        
        // Wix detection
        {
            name: 'wix',
            patterns: [
                /static\.wixstatic\.com/i,
                /wix\.com/i,
                /_wixCIDX/i
            ],
            selectors: [
                '[data-wix-editor]',
                '.wix-ads'
            ],
            headers: [],
            confidence: 0.85
        },
        
        // Custom/Unknown
        {
            name: 'custom',
            patterns: [],
            selectors: [],
            headers: [],
            confidence: 0.5
        }
    ];
    
    // Check each platform signature
    for (const signature of signatures) {
        let score = 0;
        
        // Check HTML patterns
        for (const pattern of signature.patterns) {
            if (pattern.test(html)) {
                score += 0.3;
            }
        }
        
        // Check CSS selectors
        for (const selector of signature.selectors) {
            if ($(selector).length > 0) {
                score += 0.2;
            }
        }
        
        // Check headers
        for (const header of signature.headers) {
            if (headers[header] || headers[header.toLowerCase()]) {
                score += 0.4;
            }
        }
        
        // If we have a strong match, return it
        if (score > 0.5) {
            return {
                name: signature.name,
                confidence: Math.min(score, 1.0),
                version: extractVersion(html, signature.name)
            };
        }
    }
    
    // Default to custom if no platform detected
    return {
        name: 'custom',
        confidence: 0.6,
        version: null
    };
}

/**
 * Detect platform-specific features
 */
function detectPlatformFeatures(html, $) {
    const features = [];
    
    // E-commerce features
    if (html.includes('add-to-cart') || html.includes('shopping-cart') || $('.cart').length > 0) {
        features.push('ecommerce');
    }
    
    // Blog features
    if (html.includes('wp-content') || $('.blog').length > 0 || $('.post').length > 0) {
        features.push('blog');
    }
    
    // Custom CSS support
    if ($('style').length > 0 || $('link[rel="stylesheet"]').length > 3) {
        features.push('custom_css');
    }
    
    // JavaScript framework detection
    if (html.includes('react') || html.includes('React')) {
        features.push('react');
    }
    if (html.includes('vue') || html.includes('Vue')) {
        features.push('vue');
    }
    if (html.includes('angular') || html.includes('Angular')) {
        features.push('angular');
    }
    
    // Mobile responsiveness
    if ($('meta[name="viewport"]').length > 0) {
        features.push('responsive');
    }
    
    return features;
}

/**
 * Calculate confidence score based on multiple factors
 */
function calculateConfidence(platform, features) {
    let confidence = platform.confidence || 0.5;
    
    // Boost confidence based on features
    if (features.length > 2) {
        confidence += 0.1;
    }
    
    // Platform-specific confidence adjustments
    if (platform.name === 'shopify' && features.includes('ecommerce')) {
        confidence += 0.1;
    }
    
    if (platform.name === 'wordpress' && features.includes('blog')) {
        confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
}

/**
 * Extract version information for detected platforms
 */
function extractVersion(html, platform) {
    const versionPatterns = {
        'wordpress': /WordPress\s+([\d.]+)/i,
        'shopify': /Shopify\.shop\s*=.*version['":]?\s*['"]?([\d.]+)/i,
        'squarespace': /Static\.SQUARESPACE_CONTEXT.*version['":]?\s*['"]?([\d.]+)/i
    };
    
    const pattern = versionPatterns[platform];
    if (pattern) {
        const match = html.match(pattern);
        return match ? match[1] : null;
    }
    
    return null;
}

/**
 * Generate platform-specific recommendations
 */
function generateRecommendations(platform) {
    const recommendations = {
        'shopify': [
            'Use Shopify-specific CSS selectors like .shopify-section',
            'Consider liquid template modifications for complex changes',
            'Test changes in a staging environment first',
            'Be aware of theme updates that might override custom CSS'
        ],
        'wordpress': [
            'Add CSS through Appearance > Customize > Additional CSS',
            'Consider child themes for major modifications',
            'Use WordPress-specific selectors like .wp-block',
            'Test with different WordPress themes'
        ],
        'squarespace': [
            'Add CSS through Design > Custom CSS',
            'Use Squarespace block selectors like .sqs-block',
            'Consider Squarespace style editor limitations',
            'Test across different device sizes'
        ],
        'custom': [
            'Examine the HTML structure for specific selectors',
            'Test CSS changes in browser dev tools first',
            'Consider responsive design implications',
            'Back up original CSS before applying changes'
        ]
    };
    
    return recommendations[platform] || recommendations['custom'];
}

/**
 * Fallback: Analyze platform from URL patterns when direct analysis fails
 */
function analyzeFromUrlPatterns(url) {
    if (url.includes('shopify') || url.includes('.myshopify.com')) {
        return {
            platform: 'shopify',
            confidence: 0.8,
            version: null,
            features_detected: ['ecommerce'],
            recommendations: generateRecommendations('shopify'),
            analysis_method: 'url_pattern'
        };
    }
    
    if (url.includes('wordpress') || url.includes('wp-')) {
        return {
            platform: 'wordpress',
            confidence: 0.7,
            version: null,
            features_detected: ['blog', 'custom_css'],
            recommendations: generateRecommendations('wordpress'),
            analysis_method: 'url_pattern'
        };
    }
    
    return {
        platform: 'custom',
        confidence: 0.6,
        version: null,
        features_detected: ['custom_css'],
        recommendations: generateRecommendations('custom'),
        analysis_method: 'fallback'
    };
}

/**
 * Generate mock platform detection for demo mode
 */
function generateMockPlatformDetection(url) {
    const platforms = ['shopify', 'wordpress', 'squarespace', 'custom'];
    const features = ['ecommerce', 'blog', 'custom_css', 'responsive'];
    
    // Simple URL-based mock detection
    let platform = 'custom';
    if (url.includes('shopify') || url.includes('shop')) {
        platform = 'shopify';
    } else if (url.includes('wordpress') || url.includes('blog')) {
        platform = 'wordpress';
    } else if (url.includes('squarespace')) {
        platform = 'squarespace';
    } else {
        // Random platform for demo
        platform = platforms[Math.floor(Math.random() * platforms.length)];
    }
    
    return {
        platform: platform,
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        version: platform === 'wordpress' ? '6.4.2' : null,
        features_detected: features.filter(() => Math.random() > 0.5),
        recommendations: generateRecommendations(platform),
        analysis_timestamp: new Date().toISOString(),
        demo_mode: true
    };
}

/**
 * Validate URL format
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

module.exports = router;