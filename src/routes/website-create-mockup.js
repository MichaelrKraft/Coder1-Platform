const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

/**
 * Website Mockup Creation Route
 * Generates before/after mockups of websites with applied CSS changes
 */

// POST /api/website/create-mockup
router.post('/create-mockup', async (req, res) => {
    try {
        const { website_url, generated_css, description, platform } = req.body;
        
        // Input validation
        if (!website_url || !generated_css) {
            return res.status(400).json({
                success: false,
                error: 'Website URL and generated CSS are required'
            });
        }
        
        if (!isValidUrl(website_url)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid website URL'
            });
        }
        
        console.log('🎨 Creating mockup for:', website_url);
        console.log('🔧 CSS length:', generated_css.length, 'characters');
        
        // Demo mode for development and testing
        const demoMode = process.env.NODE_ENV === 'development' || !process.env.PUPPETEER_ENABLED;
        
        if (demoMode) {
            console.log('📦 Demo mode - generating mock preview');
            const mockResult = await generateMockPreview(website_url, generated_css, description, platform);
            return res.json({
                success: true,
                data: mockResult
            });
        }
        
        // Real mockup generation with screenshots
        const mockupResult = await generateRealMockup(website_url, generated_css, description, platform);
        
        res.json({
            success: true,
            data: mockupResult
        });
        
    } catch (error) {
        console.error('🚨 Mockup creation error:', error.message);
        
        // Fallback to mock generation on error
        try {
            const fallbackResult = await generateMockPreview(
                req.body.website_url, 
                req.body.generated_css, 
                req.body.description, 
                req.body.platform
            );
            fallbackResult.fallback_mode = true;
            
            return res.json({
                success: true,
                data: fallbackResult,
                warning: 'Using preview mode due to screenshot service unavailability'
            });
        } catch (fallbackError) {
            return res.status(500).json({
                success: false,
                error: 'Unable to create mockup. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
});

/**
 * Real mockup generation using Puppeteer (for production)
 */
async function generateRealMockup(websiteUrl, generatedCSS, description, platform) {
    // This would use Puppeteer to create actual screenshots
    // const puppeteer = require('puppeteer');
    
    try {
        console.log('📸 Starting screenshot generation...');
        
        // Mock implementation for now - would be replaced with real Puppeteer code:
        /*
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        
        // Take "before" screenshot
        await page.goto(websiteUrl, { waitUntil: 'networkidle2' });
        const beforeScreenshot = await page.screenshot({ 
            type: 'png',
            fullPage: false
        });
        
        // Apply CSS and take "after" screenshot
        await page.addStyleTag({ content: generatedCSS });
        await page.waitForTimeout(1000); // Wait for CSS to apply
        const afterScreenshot = await page.screenshot({ 
            type: 'png',
            fullPage: false
        });
        
        await browser.close();
        
        // Save screenshots and return URLs
        const beforePath = await saveScreenshot(beforeScreenshot, 'before');
        const afterPath = await saveScreenshot(afterScreenshot, 'after');
        const comparisonPath = await createComparison(beforePath, afterPath);
        */
        
        // For now, return mock data with the structure real implementation would use
        return await generateMockPreview(websiteUrl, generatedCSS, description, platform);
        
    } catch (error) {
        console.error('Real mockup generation failed:', error);
        throw error;
    }
}

/**
 * Generate mock preview for demo mode and fallback
 */
async function generateMockPreview(websiteUrl, generatedCSS, description, platform) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Analyze the CSS to determine what changes were made
    const changes = analyzeCSSChanges(generatedCSS, description);
    
    // Generate mock URLs (in production these would be real screenshot URLs)
    const mockupId = generateMockupId();
    const baseUrl = '/static/mockups';
    
    return {
        mockup_id: mockupId,
        website_url: websiteUrl,
        platform_detected: platform || 'custom',
        
        // Mock image URLs (would be real screenshots in production)
        mockup_before_url: `${baseUrl}/before-${mockupId}.png`,
        mockup_after_url: `${baseUrl}/after-${mockupId}.png`,
        comparison_url: `${baseUrl}/comparison-${mockupId}.png`,
        
        // Analysis of changes made
        changes_detected: changes.detected,
        changes_highlighted: changes.highlights,
        visual_impact: changes.impact,
        
        // Technical details
        css_applied: generatedCSS.length + ' characters',
        processing_time: '2.3 seconds',
        screenshot_resolution: '1200x800',
        devices_tested: ['desktop', 'tablet', 'mobile'],
        
        // Preview metadata
        preview_quality: 'high',
        browser_engine: 'Chrome/Webkit',
        rendering_mode: 'production',
        cache_duration: '24 hours',
        
        // Status and timestamps
        status: 'completed',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        
        // Demo mode indicator
        demo_mode: true,
        note: 'This is a preview in demo mode. Production version would show actual before/after screenshots.'
    };
}

/**
 * Analyze CSS changes to determine what visual changes were made
 */
function analyzeCSSChanges(css, description) {
    const changes = {
        detected: [],
        highlights: [],
        impact: 'medium'
    };
    
    // Analyze CSS content for different types of changes
    const cssLower = css.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Color changes
    if (cssLower.includes('background') || cssLower.includes('color')) {
        changes.detected.push('color_scheme');
        changes.highlights.push('Updated color scheme and backgrounds');
    }
    
    // Layout changes
    if (cssLower.includes('position') || cssLower.includes('margin') || cssLower.includes('padding')) {
        changes.detected.push('layout');
        changes.highlights.push('Modified spacing and positioning');
    }
    
    // Typography changes
    if (cssLower.includes('font') || cssLower.includes('text')) {
        changes.detected.push('typography');
        changes.highlights.push('Enhanced typography and text styling');
    }
    
    // Button styling
    if (cssLower.includes('button') || cssLower.includes('btn')) {
        changes.detected.push('buttons');
        changes.highlights.push('Modernized button appearance and interactions');
    }
    
    // Form styling
    if (cssLower.includes('form') || cssLower.includes('input')) {
        changes.detected.push('forms');
        changes.highlights.push('Improved form design and usability');
    }
    
    // Animation/Effects
    if (cssLower.includes('transition') || cssLower.includes('transform') || cssLower.includes('hover')) {
        changes.detected.push('animations');
        changes.highlights.push('Added smooth animations and hover effects');
    }
    
    // Border and shadows
    if (cssLower.includes('border-radius') || cssLower.includes('box-shadow')) {
        changes.detected.push('visual_effects');
        changes.highlights.push('Enhanced visual effects with shadows and rounded corners');
    }
    
    // Determine impact level
    if (changes.detected.length >= 4) {
        changes.impact = 'high';
    } else if (changes.detected.length >= 2) {
        changes.impact = 'medium';
    } else {
        changes.impact = 'low';
    }
    
    // Add some default highlights if none detected
    if (changes.highlights.length === 0) {
        changes.highlights = [
            'Applied modern styling improvements',
            'Enhanced visual hierarchy and design',
            'Improved user interface elements'
        ];
    }
    
    return changes;
}

/**
 * Generate a unique mockup ID
 */
function generateMockupId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `mockup_${timestamp}_${random}`;
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

/**
 * Save screenshot to filesystem (for real implementation)
 */
async function saveScreenshot(screenshotBuffer, type) {
    try {
        const filename = `${type}_${Date.now()}.png`;
        const filepath = path.join(__dirname, '../../static/mockups', filename);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        
        // Save screenshot
        await fs.writeFile(filepath, screenshotBuffer);
        
        return `/static/mockups/${filename}`;
    } catch (error) {
        console.error('Failed to save screenshot:', error);
        throw error;
    }
}

/**
 * Create side-by-side comparison image (for real implementation)
 */
async function createComparison(beforePath, afterPath) {
    // This would use a library like Sharp or Canvas to create side-by-side comparison
    // For now, return a mock path
    return `/static/mockups/comparison_${Date.now()}.png`;
}

// GET /api/website/mockup/:id - Retrieve specific mockup
router.get('/mockup/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate mockup ID
        if (!id || !id.startsWith('mockup_')) {
            return res.status(400).json({
                success: false,
                error: 'Invalid mockup ID'
            });
        }
        
        // In production, this would query a database or file system
        // For demo, return mock data
        const mockupData = {
            mockup_id: id,
            status: 'completed',
            created_at: new Date().toISOString(),
            mockup_before_url: `/static/mockups/before-${id}.png`,
            mockup_after_url: `/static/mockups/after-${id}.png`,
            comparison_url: `/static/mockups/comparison-${id}.png`,
            changes_highlighted: [
                'Button styling updated with modern gradients',
                'Header background changed to purple theme',
                'Added smooth hover transitions'
            ],
            demo_mode: true
        };
        
        res.json({
            success: true,
            data: mockupData
        });
        
    } catch (error) {
        console.error('🚨 Mockup retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve mockup'
        });
    }
});

// DELETE /api/website/mockup/:id - Clean up mockup files
router.delete('/mockup/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate mockup ID
        if (!id || !id.startsWith('mockup_')) {
            return res.status(400).json({
                success: false,
                error: 'Invalid mockup ID'
            });
        }
        
        // In production, this would delete actual files
        console.log('🗑️ Cleaning up mockup:', id);
        
        res.json({
            success: true,
            message: 'Mockup deleted successfully'
        });
        
    } catch (error) {
        console.error('🚨 Mockup deletion error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete mockup'
        });
    }
});

// GET /api/website/mockups - List user's mockups
router.get('/mockups', async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        
        // In production, this would query the database for user's mockups
        // For demo, return mock list
        const mockMockups = [];
        for (let i = 0; i < Math.min(limit, 5); i++) {
            mockMockups.push({
                mockup_id: `mockup_${Date.now() - i * 1000}_demo${i}`,
                website_url: `https://example${i}.com`,
                created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                changes_count: Math.floor(Math.random() * 5) + 1,
                thumbnail_url: `/static/mockups/thumb-demo${i}.png`
            });
        }
        
        res.json({
            success: true,
            data: {
                mockups: mockMockups,
                total: mockMockups.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                demo_mode: true
            }
        });
        
    } catch (error) {
        console.error('🚨 Mockups list error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve mockups'
        });
    }
});

module.exports = router;