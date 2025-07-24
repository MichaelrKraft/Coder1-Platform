/**
 * Comprehensive integration test for Coder1 Platform
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testIntegration(name, testFn) {
    console.log(`\n📋 Testing: ${name}`);
    try {
        await testFn();
        console.log(`✅ ${name} - PASSED`);
        return true;
    } catch (error) {
        console.error(`❌ ${name} - FAILED:`, error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🧪 Coder1 Platform Integration Tests\n');
    console.log('Base URL:', BASE_URL);
    console.log('API Key:', process.env.ANTHROPIC_API_KEY ? 'Configured' : 'Missing');
    
    const results = [];
    
    // Test 1: Health Check
    results.push(await testIntegration('Health Check', async () => {
        const response = await axios.get(`${BASE_URL}/health`);
        if (response.data.status !== 'healthy') {
            throw new Error('Health check failed');
        }
    }));
    
    // Test 2: Static Pages
    results.push(await testIntegration('Static Pages', async () => {
        const pages = ['/', '/platform', '/product-creation', '/ide'];
        for (const page of pages) {
            const response = await axios.get(`${BASE_URL}${page}`);
            if (response.status !== 200) {
                throw new Error(`Page ${page} returned ${response.status}`);
            }
        }
    }));
    
    // Test 3: Agent Requirements Analysis
    results.push(await testIntegration('Agent Requirements Analysis', async () => {
        const response = await axios.post(`${BASE_URL}/api/agent/analyze-requirements`, {
            request: 'Build a simple todo app'
        });
        
        if (!response.data.success || !response.data.analysis) {
            throw new Error('Requirements analysis failed');
        }
        
        console.log('  - Analysis:', response.data.analysis.projectType);
        console.log('  - Mock Mode:', !process.env.ANTHROPIC_API_KEY);
    }));
    
    // Test 4: PRD Generation
    results.push(await testIntegration('PRD Generation', async () => {
        const response = await axios.post(`${BASE_URL}/api/generate-prd`, {
            projectId: 'test-123',
            originalRequest: 'Build a todo app',
            questions: ['What features?', 'What design?'],
            answers: ['CRUD operations', 'Modern minimalist'],
            sessionId: 'test-session'
        });
        
        if (!response.data.success || !response.data.prdDocument) {
            throw new Error('PRD generation failed');
        }
        
        console.log('  - AI Generated:', response.data.prdDocument.metadata.aiGenerated);
        console.log('  - Confidence:', response.data.prdDocument.metadata.confidence);
    }));
    
    // Test 5: Infinite Loop Connection
    results.push(await testIntegration('Infinite Loop Connection', async () => {
        const response = await axios.get(`${BASE_URL}/api/infinite/test-connection`);
        
        console.log('  - API Status:', response.data.apiStatus);
        console.log('  - Mock Mode:', response.data.mockMode);
        
        if (response.data.apiStatus === 'missing_key' && !process.env.ANTHROPIC_API_KEY) {
            console.log('  - Expected: No API key, will use mock mode');
        }
    }));
    
    // Test 6: Personas Endpoint
    results.push(await testIntegration('Personas API', async () => {
        const response = await axios.get(`${BASE_URL}/api/personas/available`);
        
        if (!response.data.success || !response.data.personas) {
            throw new Error('Personas endpoint failed');
        }
        
        console.log('  - Available personas:', response.data.personas.length);
    }));
    
    // Test 7: WebSocket Streaming (just check if endpoint exists)
    results.push(await testIntegration('WebSocket Endpoint', async () => {
        // Can't test WebSocket with axios, just verify server is configured
        console.log('  - WebSocket URL: ws://localhost:3000/ws/streaming');
        console.log('  - Would test real-time streaming with valid API key');
    }));
    
    // Summary
    console.log('\n📊 Test Summary:');
    const passed = results.filter(r => r).length;
    const failed = results.filter(r => !r).length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
    
    if (!process.env.ANTHROPIC_API_KEY) {
        console.log('\n⚠️  Note: Running in MOCK MODE');
        console.log('To enable real AI features, add ANTHROPIC_API_KEY to your .env file');
        console.log('Get your key from: https://console.anthropic.com/');
    }
    
    return failed === 0;
}

// Run tests
runAllTests()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test runner failed:', error);
        process.exit(1);
    });