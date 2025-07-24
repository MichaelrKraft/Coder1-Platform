// Debug Claude initialization
require('dotenv').config();

console.log('🔍 Debug Claude API Initialization\n');

console.log('Environment variables:');
console.log('- ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Found (length: ' + process.env.ANTHROPIC_API_KEY.length + ')' : 'Not found');
console.log('- CLAUDE_CODE_API_KEY:', process.env.CLAUDE_CODE_API_KEY ? 'Found (length: ' + process.env.CLAUDE_CODE_API_KEY.length + ')' : 'Not found');

try {
    const { ClaudeCodeAPI } = require('./src/integrations/claude-code-api');
    console.log('\n✅ ClaudeCodeAPI imported successfully');
    
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY;
    console.log('- Using API key:', apiKey ? apiKey.substring(0, 15) + '...' : 'None');
    
    if (apiKey) {
        console.log('- Attempting to initialize ClaudeCodeAPI...');
        const claude = new ClaudeCodeAPI(apiKey, {
            timeout: 30000,
            useCLI: false
        });
        console.log('✅ ClaudeCodeAPI initialized successfully');
        
        // Try a simple health check
        console.log('- Running health check...');
        claude.healthCheck().then(result => {
            console.log('Health check result:', result);
        }).catch(error => {
            console.log('❌ Health check failed:', error.message);
        });
    } else {
        console.log('❌ No API key found');
    }
    
} catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
}