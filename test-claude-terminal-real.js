// Test script for Claude Terminal AI with proper env loading
require('dotenv').config();
const terminalAI = require('./src/services/terminal-ai');

async function runTests() {
    console.log('🧪 Testing Claude Terminal AI Integration (Real API)\n');

    const tests = [
        { message: "Hello", description: "Basic greeting" },
        { message: "Create a file called HomePage.jsx", description: "File creation" },
        { message: "Help me build a login form", description: "Complex request" }
    ];

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(`\n📝 Test ${i + 1}: ${test.description}`);
        console.log(`   Input: "${test.message}"`);
        
        try {
            const result = await terminalAI.processMessage(test.message, {
                sessionId: 'test-session',
                context: 'terminal'
            });
            
            console.log(`   Response: "${result.response}"`);
            
            if (result.toolCalls && result.toolCalls.length > 0) {
                console.log(`   Tool Calls:`);
                result.toolCalls.forEach(tool => {
                    console.log(`     - ${tool.type}: ${JSON.stringify(tool.args)}`);
                });
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        // Add delay to avoid rate limiting
        if (i < tests.length - 1) {
            console.log('   ⏳ Waiting 3 seconds...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    console.log('\n✅ Tests complete!');
    process.exit(0);
}

// Run tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
});