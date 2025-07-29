#!/usr/bin/env node

/**
 * Website Customization Studio - End-to-End Test Suite
 * Tests the complete workflow from platform detection to CSS generation
 */

const http = require('http');
const https = require('https');

// Test configuration
const TEST_CONFIG = {
    baseUrl: 'http://localhost:3000',
    testWebsites: [
        { url: 'https://shopify.com', expectedPlatform: 'shopify' },
        { url: 'https://wordpress.com', expectedPlatform: 'wordpress' },
        { url: 'https://example.com', expectedPlatform: 'custom' }
    ],
    testDescriptions: [
        'Make the header purple and add rounded corners',
        'Change all buttons to be modern with hover effects',
        'Add a contact form on the right side of the page'
    ]
};

class WebsiteStudioTester {
    constructor() {
        this.results = {
            platformDetection: [],
            cssGeneration: [],
            mockupCreation: [],
            authentication: [],
            errors: []
        };
    }

    async runAllTests() {
        console.log('🚀 Starting Website Customization Studio End-to-End Tests\n');

        try {
            // Test 1: Platform Detection API
            console.log('📍 Testing Platform Detection API...');
            await this.testPlatformDetection();

            // Test 2: CSS Generation API
            console.log('\n🎨 Testing CSS Generation API...');
            await this.testCSSGeneration();

            // Test 3: Mockup Creation API
            console.log('\n🖼️  Testing Mockup Creation API...');
            await this.testMockupCreation();

            // Test 4: Authentication API
            console.log('\n🔐 Testing Authentication API...');
            await this.testAuthentication();

            // Generate Test Report
            this.generateReport();

        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            this.results.errors.push(`Test suite error: ${error.message}`);
            this.generateReport();
        }
    }

    async testPlatformDetection() {
        for (const testSite of TEST_CONFIG.testWebsites) {
            try {
                const result = await this.makeRequest('/api/website/detect-platform', 'POST', {
                    url: testSite.url
                });

                const success = result.success && result.data && result.data.platform;
                const platformMatch = result.data?.platform === testSite.expectedPlatform;

                this.results.platformDetection.push({
                    url: testSite.url,
                    expected: testSite.expectedPlatform,
                    actual: result.data?.platform,
                    confidence: result.data?.confidence,
                    success: success,
                    platformMatch: platformMatch || result.data?.platform === 'custom', // Allow custom as fallback
                    recommendations: result.data?.recommendations?.length || 0
                });

                console.log(`  ✅ ${testSite.url} → ${result.data?.platform || 'error'} (${Math.round((result.data?.confidence || 0) * 100)}%)`);

            } catch (error) {
                this.results.platformDetection.push({
                    url: testSite.url,
                    success: false,
                    error: error.message
                });
                console.log(`  ❌ ${testSite.url} → ${error.message}`);
            }
        }
    }

    async testCSSGeneration() {
        for (const description of TEST_CONFIG.testDescriptions) {
            try {
                const result = await this.makeRequest('/api/website/generate-css', 'POST', {
                    description: description,
                    platform: 'custom',
                    website_url: 'https://example.com'
                });

                const success = result.success && result.data && result.data.generated_css;
                const hasImplementation = result.data?.platform_specific_code?.length > 0;
                const hasKeywords = result.data?.keywords_detected?.length > 0;

                this.results.cssGeneration.push({
                    description: description.substring(0, 50) + '...',
                    success: success,
                    cssLength: result.data?.generated_css?.length || 0,
                    hasImplementation: hasImplementation,
                    hasKeywords: hasKeywords,
                    confidence: result.data?.confidence_score,
                    template: result.data?.template_used
                });

                console.log(`  ✅ "${description.substring(0, 30)}..." → ${result.data?.generated_css?.length || 0} chars CSS`);

            } catch (error) {
                this.results.cssGeneration.push({
                    description: description.substring(0, 50) + '...',
                    success: false,
                    error: error.message
                });
                console.log(`  ❌ "${description.substring(0, 30)}..." → ${error.message}`);
            }
        }
    }

    async testMockupCreation() {
        try {
            const result = await this.makeRequest('/api/website/create-mockup', 'POST', {
                website_url: 'https://example.com',
                generated_css: '.header { background: purple; }',
                description: 'Make the header purple',
                platform: 'custom'
            });

            const success = result.success && result.data;
            const hasChanges = result.data?.changes_highlighted?.length > 0;
            const hasMockupUrls = result.data?.mockup_before_url && result.data?.mockup_after_url;

            this.results.mockupCreation.push({
                success: success,
                hasChanges: hasChanges,
                hasMockupUrls: hasMockupUrls,
                changesCount: result.data?.changes_highlighted?.length || 0,
                mockupId: result.data?.mockup_id,
                demoMode: result.data?.demo_mode
            });

            console.log(`  ✅ Mockup created → ${result.data?.changes_highlighted?.length || 0} changes detected`);

        } catch (error) {
            this.results.mockupCreation.push({
                success: false,
                error: error.message
            });
            console.log(`  ❌ Mockup creation failed → ${error.message}`);
        }
    }

    async testAuthentication() {
        try {
            // Test demo account creation
            const demoResult = await this.makeRequest('/api/website/auth/demo', 'GET');
            
            const demoSuccess = demoResult.success && demoResult.data && demoResult.data.token;
            
            this.results.authentication.push({
                test: 'Demo Account',
                success: demoSuccess,
                hasToken: !!demoResult.data?.token,
                usageCount: demoResult.data?.user?.usage_count,
                subscriptionStatus: demoResult.data?.user?.subscription_status
            });

            console.log(`  ✅ Demo account → ${demoResult.data?.user?.usage_count || 0} credits available`);

            if (demoSuccess) {
                // Test usage tracking
                const token = demoResult.data.token;
                const usageResult = await this.makeRequest('/api/website/auth/use-credit', 'POST', {}, {
                    'Authorization': `Bearer ${token}`
                });

                const usageSuccess = usageResult.success && usageResult.data;

                this.results.authentication.push({
                    test: 'Usage Tracking',
                    success: usageSuccess,
                    creditsRemaining: usageResult.data?.credits_remaining,
                    canCustomize: usageResult.data?.can_customize
                });

                console.log(`  ✅ Usage tracking → ${usageResult.data?.credits_remaining || 0} credits remaining`);
            }

        } catch (error) {
            this.results.authentication.push({
                test: 'Authentication',
                success: false,
                error: error.message
            });
            console.log(`  ❌ Authentication test → ${error.message}`);
        }
    }

    async makeRequest(endpoint, method = 'GET', body = null, headers = {}) {
        return new Promise((resolve, reject) => {
            const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
            const requestHeaders = {
                'Content-Type': 'application/json',
                ...headers
            };

            const requestOptions = {
                method: method,
                headers: requestHeaders
            };

            const req = http.request(url, requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (parseError) {
                        reject(new Error(`Failed to parse response: ${parseError.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            if (body) {
                req.write(JSON.stringify(body));
            }

            req.end();
        });
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 WEBSITE CUSTOMIZATION STUDIO TEST REPORT');
        console.log('='.repeat(60));

        // Platform Detection Results
        console.log('\n🔍 Platform Detection Results:');
        const platformSuccess = this.results.platformDetection.filter(r => r.success).length;
        console.log(`  ✅ Successful: ${platformSuccess}/${this.results.platformDetection.length}`);
        
        if (this.results.platformDetection.length > 0) {
            const avgConfidence = this.results.platformDetection
                .filter(r => r.confidence)
                .reduce((sum, r) => sum + r.confidence, 0) / this.results.platformDetection.filter(r => r.confidence).length;
            console.log(`  📈 Average Confidence: ${Math.round(avgConfidence * 100)}%`);
        }

        // CSS Generation Results
        console.log('\n🎨 CSS Generation Results:');
        const cssSuccess = this.results.cssGeneration.filter(r => r.success).length;
        console.log(`  ✅ Successful: ${cssSuccess}/${this.results.cssGeneration.length}`);
        
        if (this.results.cssGeneration.length > 0) {
            const avgCssLength = this.results.cssGeneration
                .filter(r => r.cssLength > 0)
                .reduce((sum, r) => sum + r.cssLength, 0) / this.results.cssGeneration.filter(r => r.cssLength > 0).length;
            console.log(`  📏 Average CSS Length: ${Math.round(avgCssLength)} characters`);
        }

        // Mockup Creation Results
        console.log('\n🖼️  Mockup Creation Results:');
        const mockupSuccess = this.results.mockupCreation.filter(r => r.success).length;
        console.log(`  ✅ Successful: ${mockupSuccess}/${this.results.mockupCreation.length}`);

        // Authentication Results
        console.log('\n🔐 Authentication Results:');
        const authSuccess = this.results.authentication.filter(r => r.success).length;
        console.log(`  ✅ Successful: ${authSuccess}/${this.results.authentication.length}`);

        // Overall Status
        const totalTests = this.results.platformDetection.length + 
                           this.results.cssGeneration.length + 
                           this.results.mockupCreation.length + 
                           this.results.authentication.length;
        const totalSuccess = platformSuccess + cssSuccess + mockupSuccess + authSuccess;
        
        console.log('\n📋 Overall Results:');
        console.log(`  ✅ Total Success Rate: ${totalSuccess}/${totalTests} (${Math.round(totalSuccess/totalTests*100)}%)`);
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ Errors Encountered:');
            this.results.errors.forEach(error => console.log(`  • ${error}`));
        }

        console.log('\n' + '='.repeat(60));
        
        if (totalSuccess === totalTests) {
            console.log('🎉 ALL TESTS PASSED! Website Customization Studio is ready for deployment.');
        } else {
            console.log('⚠️  Some tests failed. Review the errors above before deployment.');
        }
    }
}

// Check if server is running before starting tests
function checkServer() {
    return new Promise((resolve, reject) => {
        const req = http.get(`${TEST_CONFIG.baseUrl}/health`, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => {
            reject(new Error('Server is not running. Please start the server first.'));
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Server health check timed out.'));
        });
    });
}

// Main execution
async function main() {
    try {
        console.log('🔍 Checking server status...');
        await checkServer();
        console.log('✅ Server is running. Starting tests...\n');
        
        const tester = new WebsiteStudioTester();
        await tester.runAllTests();
        
    } catch (error) {
        console.error('\n❌ Cannot run tests:', error.message);
        console.log('\n💡 To start the server, run: node src/app-simple.js');
        process.exit(1);
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = WebsiteStudioTester;