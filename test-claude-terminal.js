// Test script for Claude Terminal AI
const terminalAI = require('./src/services/terminal-ai');

async function runTests() {
    console.log('🧪 Testing Claude Terminal AI Integration\n');

    const tests = [
        { message: "Hello", description: "Basic greeting" },
        { message: "Create a file called HomePage.jsx", description: "File creation" },
        { message: "Help", description: "Help command" },
        { message: "Search for user authentication", description: "Search command" },
        { message: "What can you do?", description: "Capabilities question" }
    ];

    for (const test of tests) {
        console.log(`\n📝 Test: ${test.description}`);
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
    }

    console.log('\n✅ Tests complete!');
    process.exit(0);
}

// Run tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
});