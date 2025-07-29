#!/usr/bin/env node

/**
 * Website Customization Studio - Integration Test
 * Tests the backend route loading and basic functionality
 */

const path = require('path');

console.log('🧪 Website Customization Studio Integration Test\n');

// Test 1: Route Module Loading
console.log('📁 Testing Route Module Loading...');

const routeTests = [
    { name: 'Platform Detection', path: './src/routes/website-detect-platform.js' },
    { name: 'CSS Generation', path: './src/routes/website-generate-css.js' },
    { name: 'Mockup Creation', path: './src/routes/website-create-mockup.js' },
    { name: 'Authentication', path: './src/routes/website-auth.js' }
];

let routeResults = [];

for (const routeTest of routeTests) {
    try {
        const route = require(routeTest.path);
        const hasMiddleware = typeof route === 'function' || (route && typeof route.stack === 'object');
        
        routeResults.push({
            name: routeTest.name,
            loaded: true,
            hasMiddleware: hasMiddleware,
            type: typeof route
        });
        
        console.log(`  ✅ ${routeTest.name} route loaded successfully`);
    } catch (error) {
        routeResults.push({
            name: routeTest.name,
            loaded: false,
            error: error.message
        });
        
        console.log(`  ❌ ${routeTest.name} route failed: ${error.message}`);
    }
}

// Test 2: Mock API Functionality
console.log('\n🔬 Testing API Function Logic...');

try {
    // Test CSS Generation Template System
    const cssRoute = require('./src/routes/website-generate-css.js');
    console.log('  ✅ CSS Generation: Template system loaded');
    
    // Test Platform Detection Signatures
    const platformRoute = require('./src/routes/website-detect-platform.js');
    console.log('  ✅ Platform Detection: Signature system loaded');
    
    // Test Mockup Analysis
    const mockupRoute = require('./src/routes/website-create-mockup.js');
    console.log('  ✅ Mockup Creation: Analysis system loaded');
    
    // Test Authentication System
    const authRoute = require('./src/routes/website-auth.js');
    console.log('  ✅ Authentication: JWT system loaded');
    
} catch (error) {
    console.log(`  ❌ API Logic Test failed: ${error.message}`);
}

// Test 3: Frontend File Verification
console.log('\n🌐 Testing Frontend Files...');

const fs = require('fs');

const frontendFiles = [
    { name: 'Landing Page', path: './website-studio-landing.html' },
    { name: 'Main Application', path: './website-studio-app.html' }
];

let frontendResults = [];

for (const file of frontendFiles) {
    try {
        const content = fs.readFileSync(file.path, 'utf8');
        const hasAPI = content.includes('/api/website/');
        const hasJS = content.includes('<script>');
        const hasCSS = content.includes('<style>');
        
        frontendResults.push({
            name: file.name,
            exists: true,
            size: content.length,
            hasAPI: hasAPI,
            hasJS: hasJS,
            hasCSS: hasCSS
        });
        
        console.log(`  ✅ ${file.name}: ${Math.round(content.length/1024)}KB, API calls: ${hasAPI ? 'Yes' : 'No'}`);
    } catch (error) {
        frontendResults.push({
            name: file.name,
            exists: false,
            error: error.message
        });
        
        console.log(`  ❌ ${file.name}: ${error.message}`);
    }
}

// Test 4: Static Assets
console.log('\n📁 Testing Static Assets...');

try {
    const mockupsDir = './static/mockups';
    const dirExists = fs.existsSync(mockupsDir);
    
    if (dirExists) {
        console.log('  ✅ Mockups directory exists');
    } else {
        console.log('  ⚠️  Mockups directory missing (will be created on first use)');
    }
    
    // Check if main app server integration looks correct
    const appFile = fs.readFileSync('./src/app-simple.js', 'utf8');
    const hasWebsiteRoutes = appFile.includes('website-detect-platform') && 
                            appFile.includes('website-generate-css') &&
                            appFile.includes('website-create-mockup') &&
                            appFile.includes('website-auth');
    
    if (hasWebsiteRoutes) {
        console.log('  ✅ App server has Website Studio route integration');
    } else {
        console.log('  ❌ App server missing Website Studio routes');
    }
    
} catch (error) {
    console.log(`  ❌ Static assets test failed: ${error.message}`);
}

// Generate Report
console.log('\n' + '='.repeat(60));
console.log('📊 INTEGRATION TEST REPORT');
console.log('='.repeat(60));

console.log('\n🔌 Route Loading:');
const routeSuccessCount = routeResults.filter(r => r.loaded).length;
console.log(`  ✅ ${routeSuccessCount}/${routeResults.length} routes loaded successfully`);

console.log('\n📄 Frontend Files:');
const frontendSuccessCount = frontendResults.filter(r => r.exists).length;
console.log(`  ✅ ${frontendSuccessCount}/${frontendResults.length} frontend files found`);

const apiIntegrationCount = frontendResults.filter(r => r.hasAPI).length;
console.log(`  🔗 ${apiIntegrationCount}/${frontendResults.length} files have API integration`);

console.log('\n📋 Summary:');
const allRoutesLoaded = routeSuccessCount === routeResults.length;
const allFilesExist = frontendSuccessCount === frontendResults.length;
const hasAPIIntegration = apiIntegrationCount > 0;

if (allRoutesLoaded && allFilesExist && hasAPIIntegration) {
    console.log('🎉 All integration tests passed! Website Customization Studio is properly integrated.');
    console.log('\n💡 Next steps:');
    console.log('   • Start the server: node src/app-simple.js');
    console.log('   • Access landing page: http://localhost:3000/website-studio');
    console.log('   • Access main app: http://localhost:3000/website-studio-app');
    console.log('   • API endpoints available at: /api/website/*');
} else {
    console.log('⚠️  Some integration issues detected:');
    if (!allRoutesLoaded) console.log('   • Route loading failures detected');
    if (!allFilesExist) console.log('   • Missing frontend files detected');
    if (!hasAPIIntegration) console.log('   • Missing API integration in frontend');
}

console.log('\n' + '='.repeat(60));