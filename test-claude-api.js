require('dotenv').config();
const { ClaudeCodeAPI } = require('./src/integrations/claude-code-api');

async function testClaudeAPI() {
    console.log('🧪 Testing Claude API Connection...\n');
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error('❌ No ANTHROPIC_API_KEY found in environment');
        return;
    }
    
    console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
    
    const claude = new ClaudeCodeAPI(apiKey);
    
    // Test 1: Health Check
    console.log('\n📋 Test 1: Health Check');
    const health = await claude.healthCheck();
    console.log('Health Status:', health.status);
    if (health.response) {
        console.log('Response:', health.response);
    } else {
        console.log('Error:', health.error);
    }
    
    // Test 2: Basic Message
    console.log('\n📋 Test 2: Basic Message');
    try {
        const response = await claude.sendMessage('What is 2+2?', {
            model: 'claude-3-haiku-20240307',
            maxTokens: 100
        });
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 3: Request Analysis
    console.log('\n📋 Test 3: Request Analysis');
    try {
        const analysis = await claude.analyzeRequest('I need an e-commerce website with payment processing');
        console.log('Analysis:', JSON.stringify(analysis, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('\n✅ Testing complete!');
}

testClaudeAPI().catch(console.error);