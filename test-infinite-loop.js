/**
 * Test script for Infinite Loop integration
 */

require('dotenv').config();
const InfiniteLoopManager = require('./src/services/InfiniteLoopManager');

async function testInfiniteLoop() {
    console.log('🧪 Testing Infinite Loop Integration\n');
    
    const manager = new InfiniteLoopManager();
    
    // Test 1: Connection Test
    console.log('📋 Test 1: Claude Connection');
    const connectionTest = await manager.testClaudeConnection();
    console.log('Result:', JSON.stringify(connectionTest, null, 2));
    
    if (!connectionTest.success && connectionTest.apiStatus === 'missing_key') {
        console.log('\n⚠️  No API key found. The system will run in mock mode.');
        console.log('To enable real AI generation, add ANTHROPIC_API_KEY to your .env file');
    }
    
    // Test 2: Generate a single wave
    if (connectionTest.mockMode) {
        console.log('\n📋 Test 2: Mock Wave Generation');
        
        // Create a test session
        const session = {
            id: 'test-session',
            projectPath: './test-output',
            currentWave: 0,
            totalGenerated: 0,
            buffer: '',
            spec: 'Button components',
            outputDir: 'test-components',
            waves: []
        };
        
        // Test mock wave generation
        await manager.generateMockWave(session);
        
        console.log('Generated components:', session.totalGenerated);
        console.log('Output:', session.buffer);
    } else {
        console.log('\n📋 Test 2: Real AI Wave Generation');
        console.log('(Skipping to avoid API costs in test)');
    }
    
    console.log('\n✅ Testing complete!');
}

testInfiniteLoop().catch(console.error);