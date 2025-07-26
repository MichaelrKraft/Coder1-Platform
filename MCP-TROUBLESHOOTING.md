# MCP Server Troubleshooting Guide

## Current Issue: MCP Servers Disconnected

You're experiencing MCP server disconnection errors. Here's what I found and how to fix it:

### Root Causes Identified:

1. **Git MCP Server**: Requires Python 3.10+, but your system has Python 3.9.6
2. **Other servers**: May have dependency or permission issues

### Immediate Fix Applied:

I've simplified your configuration to only include the most likely to work servers:
- ✅ **filesystem** - Should work (Node.js based)
- ✅ **firecrawl** - Should work (npx based)
- ✅ **browser-use** - Should work (uses uv with its own Python)

Temporarily removed:
- ❌ git (Python version conflict)
- ❌ postgres (may need additional setup)
- ❌ supabase (may need additional setup)
- ❌ openai (may need additional setup)

### Step-by-Step Fix:

1. **Restart Claude Desktop Again**
   - Quit completely (Cmd+Q)
   - Reopen Claude Desktop
   - Check if the error persists

2. **If Errors Continue - Test Individual Servers**

   **Test filesystem MCP:**
   ```bash
   # Check if the filesystem server exists and can run
   node /Users/michaelkraft/mcp-servers/src/filesystem/dist/index.js
   ```
   
   **Test browser-use:**
   ```bash
   # Check if uv can run the browser-use server
   /Users/michaelkraft/.local/bin/uv run --project /Users/michaelkraft/browser-use-mcp python -m browser_use_mcp_server
   ```

3. **Fix Python for Git MCP** (optional, for later)
   ```bash
   # Install Python 3.10+ using Homebrew
   brew install python@3.11
   
   # Or use pyenv
   brew install pyenv
   pyenv install 3.11.0
   pyenv global 3.11.0
   ```

4. **Enable Servers One by One**
   
   Start with just filesystem:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "node",
         "args": ["/Users/michaelkraft/mcp-servers/src/filesystem/dist/index.js"],
         "env": {}
       }
     }
   }
   ```
   
   Then add one at a time after verifying each works.

### Alternative Minimal Config:

If all servers fail, try this ultra-minimal config with just Firecrawl:
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "@firecrawl/mcp-server-firecrawl"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-3ba82c32a36249bc832f43a554c1f1b9"
      }
    }
  }
}
```

### Debug Commands:

Run these to check your environment:
```bash
# Check Node.js
node --version  # Should be v20.19.3

# Check npx
npx --version

# Check Python
python3 --version  # Currently 3.9.6, needs upgrade for git MCP

# Check uv
/Users/michaelkraft/.local/bin/uv --version

# Check filesystem MCP
ls -la /Users/michaelkraft/mcp-servers/src/filesystem/dist/index.js

# Test npx can download packages
npx cowsay "Hello MCP"
```

### Backup Configurations:

Your original configs are saved at:
- `/Users/michaelkraft/Library/Application Support/Claude/claude_desktop_config.backup.json`
- `/Users/michaelkraft/Library/Application Support/Claude/claude_desktop_config.backup2.json`

### If Nothing Works:

1. **Check Claude Desktop Developer Settings**
   - Click "Open developer settings" from the error message
   - Look for any error logs
   - Check if MCP is enabled

2. **Try Empty Config**
   ```json
   {
     "mcpServers": {}
   }
   ```
   Then add servers back one by one.

3. **Reinstall MCP Dependencies**
   ```bash
   # For filesystem
   cd /Users/michaelkraft/mcp-servers/src/filesystem
   npm install
   npm run build
   
   # For browser-use
   cd /Users/michaelkraft/browser-use-mcp
   /Users/michaelkraft/.local/bin/uv sync
   ```

### Expected Behavior After Fix:

- No error messages on Claude Desktop startup
- MCP servers available in Claude's capabilities
- Can use commands like "list files in current directory" (filesystem)
- Can use "scrape website" commands (firecrawl)
- Can use "browse to website" commands (browser-use)

### Next Steps:

1. Restart Claude Desktop with the simplified config
2. Test basic commands
3. Report back which servers are working
4. We'll then add back other servers one by one