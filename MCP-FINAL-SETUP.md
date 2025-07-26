# MCP Server Final Setup - Corrected Configuration

## Important Findings:

1. **Firecrawl MCP**: The correct package name is `firecrawl-mcp` (not `@firecrawl/mcp-server-firecrawl`)
2. **Browser-use**: May have Python environment issues
3. **Filesystem**: Should work if the file exists

## Working Configuration:

I've set up a minimal configuration with filesystem and the corrected Firecrawl:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["/Users/michaelkraft/mcp-servers/src/filesystem/dist/index.js"]
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-3ba82c32a36249bc832f43a554c1f1b9"
      }
    }
  }
}
```

## Next Steps:

1. **Restart Claude Desktop** one more time with this corrected configuration
2. **Test commands**:
   - Filesystem: "List files in /Users/michaelkraft/Desktop"
   - Firecrawl: "Scrape the content from https://example.com"

## If Still Having Issues:

### Option 1: Test Just Firecrawl
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-3ba82c32a36249bc832f43a554c1f1b9"
      }
    }
  }
}
```

### Option 2: Use Alternative MCP Servers
There's also `one-search-mcp` which includes Firecrawl support:
```json
{
  "mcpServers": {
    "one-search": {
      "command": "npx",
      "args": ["-y", "one-search-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-3ba82c32a36249bc832f43a554c1f1b9"
      }
    }
  }
}
```

## Browser-Use Alternative Setup:

If browser-use continues to fail, you might need to:

1. **Install browser-use-mcp globally**:
   ```bash
   pip install browser-use-mcp
   ```

2. **Use direct Python configuration**:
   ```json
   "browser-use": {
     "command": "python3",
     "args": ["-m", "browser_use_mcp"],
     "env": {
       "OPENAI_API_KEY": "your-openai-key"
     }
   }
   ```

## Troubleshooting Tips:

1. **Check Claude Desktop Logs**: 
   - In the developer settings, look for specific error messages
   - MCP servers that hang on startup are actually working (they're waiting for input)

2. **Verify Dependencies**:
   ```bash
   # Check Node.js
   node --version
   
   # Check npx
   npx --version
   
   # Test Firecrawl manually
   FIRECRAWL_API_KEY="fc-3ba82c32a36249bc832f43a554c1f1b9" npx -y firecrawl-mcp
   ```

3. **Start with One Server**: If multiple servers fail, start with just one at a time

## Your Firecrawl API Key:
`fc-3ba82c32a36249bc832f43a554c1f1b9`

This key is now correctly configured in the settings.