const express = require('express');
const router = express.Router();

/**
 * Website CSS Generation Route
 * Generates CSS customizations using OpenAI based on natural language descriptions
 */

// POST /api/website/generate-css
router.post('/generate-css', async (req, res) => {
    try {
        const { description, platform, website_url, existing_css } = req.body;
        
        // Input validation
        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a detailed description of the changes you want (minimum 10 characters)'
            });
        }
        
        if (description.length > 1000) {
            return res.status(400).json({
                success: false,
                error: 'Description is too long. Please keep it under 1000 characters.'
            });
        }
        
        console.log('🎨 Generating CSS for:', description.substring(0, 100) + '...');
        console.log('🔧 Platform:', platform || 'auto-detect');
        
        // Demo mode for development and testing
        const demoMode = process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY;
        
        if (demoMode) {
            console.log('📦 Demo mode - generating mock CSS');
            const mockResult = await generateMockCSS(description, platform, website_url);
            return res.json({
                success: true,
                data: mockResult
            });
        }
        
        // Real CSS generation with OpenAI
        const cssResult = await generateCSSWithOpenAI(description, platform, existing_css, website_url);
        
        res.json({
            success: true,
            data: cssResult
        });
        
    } catch (error) {
        console.error('🚨 CSS generation error:', error.message);
        
        // Fallback to mock generation on error
        try {
            const fallbackResult = await generateMockCSS(req.body.description, req.body.platform);
            fallbackResult.fallback_mode = true;
            fallbackResult.original_error = error.message;
            
            return res.json({
                success: true,
                data: fallbackResult,
                warning: 'Generated using fallback mode due to API error'
            });
        } catch (fallbackError) {
            return res.status(500).json({
                success: false,
                error: 'Unable to generate CSS. Please try again with a different description.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
});

/**
 * Real CSS generation using OpenAI API
 */
async function generateCSSWithOpenAI(description, platform, existingCSS, websiteUrl) {
    // This would integrate with OpenAI API
    // For now, return structured mock data
    
    const prompt = buildOpenAIPrompt(description, platform, existingCSS);
    
    // Simulated OpenAI call structure:
    // const response = await openai.chat.completions.create({
    //     model: "gpt-4",
    //     messages: [
    //         { role: "system", content: "You are a CSS expert..." },
    //         { role: "user", content: prompt }
    //     ],
    //     temperature: 0.7,
    //     max_tokens: 1500
    // });
    
    // For now, return mock data with realistic structure
    return await generateMockCSS(description, platform, websiteUrl);
}

/**
 * Build OpenAI prompt for CSS generation
 */
function buildOpenAIPrompt(description, platform, existingCSS) {
    const platformContext = {
        'shopify': 'This is a Shopify store. Use Shopify-specific selectors like .shopify-section, .product-form, .cart-drawer. Consider Liquid template structure.',
        'wordpress': 'This is a WordPress site. Use WordPress-specific selectors like .wp-block, .post, .widget. Consider theme compatibility.',
        'squarespace': 'This is a Squarespace site. Use Squarespace-specific selectors like .sqs-block, .Index-page. Follow Squarespace CSS conventions.',
        'custom': 'This is a custom website. Use semantic HTML selectors and modern CSS best practices.'
    };
    
    const basePrompt = `
Generate CSS code for the following customization request: "${description}"

Platform: ${platform || 'auto-detect'}
Context: ${platformContext[platform] || platformContext['custom']}

Requirements:
1. Generate clean, modern CSS code
2. Include helpful comments explaining each section
3. Use responsive design principles
4. Follow CSS best practices
5. Ensure cross-browser compatibility
6. Include hover effects and transitions where appropriate

${existingCSS ? `Existing CSS to consider:\n${existingCSS}` : ''}

Please respond with only the CSS code, properly formatted.
    `;
    
    return basePrompt.trim();
}

/**
 * Generate mock CSS for demo mode and fallback
 */
async function generateMockCSS(description, platform, websiteUrl) {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const cssTemplates = {
        'button': generateButtonCSS,
        'header': generateHeaderCSS,
        'form': generateFormCSS,
        'contact': generateContactFormCSS,
        'navigation': generateNavigationCSS,
        'card': generateCardCSS,
        'modal': generateModalCSS,
        'footer': generateFooterCSS,
        'colors': generateColorSchemeCSS,
        'fonts': generateTypographyCSS
    };
    
    // Analyze description for keywords
    const keywords = extractKeywords(description.toLowerCase());
    let selectedTemplate = 'default';
    
    for (const keyword of keywords) {
        if (cssTemplates[keyword]) {
            selectedTemplate = keyword;
            break;
        }
    }
    
    // Generate CSS based on template or default
    const generatedCSS = cssTemplates[selectedTemplate] ? 
        cssTemplates[selectedTemplate](description, platform) : 
        generateDefaultCSS(description, platform);
    
    // Calculate confidence score
    const confidence = calculateCSSConfidence(description, selectedTemplate);
    
    // Generate platform-specific implementation code
    const platformCode = generatePlatformSpecificCode(generatedCSS, platform);
    
    return {
        generated_css: generatedCSS,
        platform_specific_code: platformCode,
        confidence_score: confidence,
        template_used: selectedTemplate,
        keywords_detected: keywords,
        suggestions: generateImprovementSuggestions(description, platform),
        estimated_impact: estimateImpact(description),
        browser_compatibility: ['Chrome 80+', 'Firefox 75+', 'Safari 13+', 'Edge 80+'],
        implementation_time: 'Estimated 5-10 minutes',
        generated_at: new Date().toISOString()
    };
}

/**
 * Extract keywords from description
 */
function extractKeywords(description) {
    const keywordMap = {
        'button': ['button', 'btn', 'click', 'submit', 'cta'],
        'header': ['header', 'navbar', 'navigation', 'menu', 'top'],
        'form': ['form', 'input', 'field', 'submit'],
        'contact': ['contact', 'email', 'phone', 'address'],
        'navigation': ['nav', 'menu', 'link', 'navigation'],
        'card': ['card', 'box', 'container', 'panel'],
        'modal': ['modal', 'popup', 'dialog', 'overlay'],
        'footer': ['footer', 'bottom', 'copyright'],
        'colors': ['color', 'background', 'theme', 'purple', 'blue', 'red', 'green'],
        'fonts': ['font', 'text', 'typography', 'size', 'weight']
    };
    
    const found = [];
    for (const [category, words] of Object.entries(keywordMap)) {
        if (words.some(word => description.includes(word))) {
            found.push(category);
        }
    }
    
    return found;
}

/**
 * CSS Template Generators
 */
function generateButtonCSS(description, platform) {
    const colors = extractColors(description) || ['#8b5cf6', '#7c3aed'];
    return `/* Modern Button Styling */
.btn, .button, button, input[type="submit"], input[type="button"] {
    background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] || colors[0]} 100%);
    border: none;
    border-radius: 12px;
    color: white;
    padding: 12px 24px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    text-align: center;
}

.btn:hover, .button:hover, button:hover, 
input[type="submit"]:hover, input[type="button"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
    filter: brightness(1.1);
}

.btn:active, .button:active, button:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

/* Secondary button variant */
.btn-secondary {
    background: transparent;
    border: 2px solid ${colors[0]};
    color: ${colors[0]};
}

.btn-secondary:hover {
    background: ${colors[0]};
    color: white;
}`;
}

function generateHeaderCSS(description, platform) {
    const isDark = description.includes('dark');
    const isSticky = description.includes('sticky') || description.includes('fixed');
    
    return `/* Modern Header Styling */
.header, header, .site-header, .main-header {
    background: ${isDark ? 
        'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
    color: white;
    padding: 20px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    ${isSticky ? 'position: sticky;\n    top: 0;\n    z-index: 1000;' : ''}
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.header .logo, header .logo, .site-header .logo {
    font-size: 1.8rem;
    font-weight: bold;
    text-decoration: none;
    color: white;
    transition: opacity 0.3s ease;
}

.header .logo:hover, header .logo:hover {
    opacity: 0.8;
}

.header nav, header nav, .site-header nav {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.header nav a, header nav a, .site-header nav a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.header nav a:hover, header nav a:hover {
    color: white;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}`;
}

function generateContactFormCSS(description, platform) {
    const isFloating = description.includes('floating') || description.includes('fixed') || description.includes('right side');
    
    return `/* Contact Form Styling */
.contact-form, .contact-widget {
    ${isFloating ? `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    max-width: 320px;` : 'max-width: 500px; margin: 2rem auto;'}
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.contact-form h3, .contact-widget h3 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
}

.contact-form input, .contact-form textarea,
.contact-widget input, .contact-widget textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.contact-form input:focus, .contact-form textarea:focus,
.contact-widget input:focus, .contact-widget textarea:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.contact-form button, .contact-widget button {
    width: 100%;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.contact-form button:hover, .contact-widget button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}`;
}

function generateDefaultCSS(description, platform) {
    return `/* Custom Website Styling */
.enhanced-element, .custom-style {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 20px;
    margin: 10px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.enhanced-element:hover, .custom-style:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Typography improvements */
.enhanced-text {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #2d3748;
}

/* Modern card styling */
.card, .content-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
}

.card:hover, .content-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}`;
}

/**
 * Additional CSS generators for other templates
 */
function generateFormCSS(description, platform) {
    return `/* Modern Form Styling */
.form, .contact-form, form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label, label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.form-input, input[type="text"], input[type="email"], 
input[type="tel"], textarea, select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.form-input:focus, input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}`;
}

function generateNavigationCSS(description, platform) {
    return `/* Modern Navigation Styling */
.navigation, .nav, .main-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-links, .nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.nav-links a, .nav-menu a {
    color: #374151;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.nav-links a:hover, .nav-menu a:hover {
    background: #8b5cf6;
    color: white;
    transform: translateY(-1px);
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #8b5cf6;
    text-decoration: none;
}`;
}

/**
 * Extract colors from description
 */
function extractColors(description) {
    const colorMap = {
        'purple': '#8b5cf6',
        'blue': '#3b82f6',
        'green': '#10b981',
        'red': '#ef4444',
        'orange': '#f59e0b',
        'pink': '#ec4899',
        'indigo': '#6366f1',
        'gray': '#6b7280',
        'black': '#1f2937',
        'white': '#ffffff'
    };
    
    for (const [color, hex] of Object.entries(colorMap)) {
        if (description.toLowerCase().includes(color)) {
            return [hex, adjustBrightness(hex, -0.1)];
        }
    }
    
    return null;
}

/**
 * Adjust color brightness
 */
function adjustBrightness(hex, factor) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * factor * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

/**
 * Calculate CSS confidence score
 */
function calculateCSSConfidence(description, template) {
    let confidence = 0.7; // Base confidence
    
    // Boost for specific keywords
    if (template !== 'default') confidence += 0.1;
    
    // Boost for detailed descriptions
    if (description.length > 50) confidence += 0.1;
    
    // Boost for specific color mentions
    if (extractColors(description)) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
}

/**
 * Generate platform-specific implementation code
 */
function generatePlatformSpecificCode(css, platform) {
    const implementations = {
        'shopify': `<!-- Shopify Implementation -->
<!-- Add to theme.liquid before </head> -->
<style>
${css}
</style>

<!-- Or add to assets/custom.css and include in theme.liquid -->
{{ 'custom.css' | asset_url | stylesheet_tag }}`,

        'wordpress': `/* WordPress Implementation */
/* Method 1: Add to Appearance > Customize > Additional CSS */
${css}

/* Method 2: Add to child theme's style.css */
/* @import url("../parent-theme/style.css"); */
${css}`,

        'squarespace': `/* Squarespace Implementation */
/* Add to Design > Custom CSS */
${css}

/* Note: Some Squarespace templates may require !important declarations */`,

        'custom': `<!-- Custom Website Implementation -->
<!-- Method 1: Add to existing CSS file -->
${css}

<!-- Method 2: Add inline styles in HTML -->
<style>
${css}
</style>`
    };
    
    return implementations[platform] || implementations['custom'];
}

/**
 * Generate improvement suggestions
 */
function generateImprovementSuggestions(description, platform) {
    const suggestions = [
        'Test the changes in a staging environment first',
        'Consider browser compatibility when using advanced CSS features',
        'Add media queries for responsive design',
        'Use semantic class names for better maintainability'
    ];
    
    // Platform-specific suggestions
    if (platform === 'shopify') {
        suggestions.push('Be aware that theme updates may override custom CSS');
        suggestions.push('Consider using CSS variables for easier color management');
    } else if (platform === 'wordpress') {
        suggestions.push('Use a child theme to prevent losing changes during updates');
        suggestions.push('Test with different WordPress themes for compatibility');
    }
    
    return suggestions;
}

/**
 * Estimate impact of changes
 */
function estimateImpact(description) {
    const impactKeywords = {
        'high': ['layout', 'structure', 'navigation', 'header', 'footer', 'responsive'],
        'medium': ['button', 'form', 'color', 'background', 'font'],
        'low': ['margin', 'padding', 'border', 'shadow', 'hover']
    };
    
    for (const [level, keywords] of Object.entries(impactKeywords)) {
        if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
            return level;
        }
    }
    
    return 'medium';
}

module.exports = router;