#!/usr/bin/env node

/**
 * Test script to verify Claude Code CLI integration
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function testClaudeCLI() {
    console.log('🧪 Testing Claude Code CLI Integration...\n');
    
    try {
        // Test 1: Check if claude command exists
        console.log('1️⃣ Checking Claude Code CLI installation...');
        const { stdout: whichOutput } = await execPromise('which claude');
        console.log(`   ✅ Claude found at: ${whichOutput.trim()}`);
        
        // Test 2: Check version
        console.log('\n2️⃣ Checking Claude Code CLI version...');
        const { stdout: versionOutput } = await execPromise('claude --version');
        console.log(`   ✅ Version: ${versionOutput.trim()}`);
        
        // Test 3: Simple echo test through claude
        console.log('\n3️⃣ Testing simple command through Claude CLI...');
        const testPrompt = 'Say "Hello from Claude CLI!" and nothing else.';
        const { stdout: echoOutput } = await execPromise(`echo "${testPrompt}" | claude`);
        console.log(`   ✅ Response: ${echoOutput.trim()}`);
        
        // Test 4: Check environment variable
        console.log('\n4️⃣ Checking environment configuration...');
        const useClaudeCLI = process.env.USE_CLAUDE_CODE_CLI;
        console.log(`   ℹ️  USE_CLAUDE_CODE_CLI = ${useClaudeCLI}`);
        
        if (useClaudeCLI === 'true') {
            console.log('   ✅ Claude Code CLI integration is ENABLED');
            console.log('\n🎉 All tests passed! Your terminal will now use your Claude Code Max subscription.');
            console.log('💡 Restart your Node.js server to apply the changes.');
        } else {
            console.log('   ⚠️  Claude Code CLI integration is DISABLED');
            console.log('   💡 Set USE_CLAUDE_CODE_CLI=true in your .env file to enable it.');
        }
        
    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        if (error.message.includes('command not found')) {
            console.log('\n💡 Claude Code CLI is not installed or not in PATH.');
            console.log('   Please install it from: https://claude.ai/code');
        }
    }
}

// Load environment variables
require('dotenv').config();

// Run the test
testClaudeCLI();