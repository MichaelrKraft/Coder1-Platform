# Claude Integration Options

The Coder1 Platform supports two methods for integrating Claude AI:

## Option 1: Anthropic SDK (Default)

This uses the official Anthropic API with direct SDK integration.

**Pros:**
- Direct API access with predictable pricing
- Full streaming support
- Better error handling and retries
- More reliable for production use

**Cons:**
- Requires separate Anthropic API subscription
- Pay-per-token pricing model

**Setup:**
1. Get an API key from https://console.anthropic.com/
2. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-api03-...`
3. Leave `USE_CLAUDE_CODE_CLI=false` (default)

## Option 2: Claude Code CLI Bridge

This leverages your existing Claude Code Max subscription by interfacing with the Claude Code CLI.

**Pros:**
- Uses your existing Claude Code Max subscription
- No additional API costs
- Access to Claude Code's specialized features

**Cons:**
- Requires Claude Code desktop app installed
- Slightly slower due to CLI overhead
- Less suitable for production deployments

**Setup:**
1. Ensure Claude Code is installed and logged in
2. Make sure `claude` command is available in your PATH
3. Set in `.env`: `USE_CLAUDE_CODE_CLI=true`
4. Optionally set custom path: `CLAUDE_CODE_CLI_PATH=/path/to/claude`

## Switching Between Options

You can switch between options by changing the `USE_CLAUDE_CODE_CLI` environment variable:

```bash
# Use Anthropic SDK (default)
USE_CLAUDE_CODE_CLI=false

# Use Claude Code CLI
USE_CLAUDE_CODE_CLI=true
```

## Current Configuration

Based on your `.env` file, you're currently configured to use:
- **Anthropic SDK** (USE_CLAUDE_CODE_CLI=false)

However, your API key appears to be invalid. You have two choices:

1. **Get a valid Anthropic API key** from https://console.anthropic.com/
2. **Switch to Claude Code CLI** by setting `USE_CLAUDE_CODE_CLI=true` to use your Max subscription

## Testing Your Configuration

Run the test script to verify your setup:

```bash
node test-claude-api.js
```

This will test whichever integration method you have configured.