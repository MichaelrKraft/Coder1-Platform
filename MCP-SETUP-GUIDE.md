# MCP Server Setup Guide for Claude Desktop

This guide will help you set up browser-use and Firecrawl MCP servers for Claude Desktop.

## Current Status

### ✅ Working MCP Servers:
- **filesystem** - File operations
- **git** - Version control operations
- **postgres** - PostgreSQL database operations
- **supabase** - Supabase backend operations
- **openai** - OpenAI API integration

### 🔧 Newly Configured:
- **browser-use** - Browser automation (requires restart)
- **firecrawl** - Web scraping (needs API key)

## Setup Instructions

### 1. Browser-Use MCP Server

The browser-use MCP server is already configured in your Claude Desktop settings. It allows Claude to:
- Navigate websites
- Take screenshots
- Extract content from web pages
- Interact with web elements

**Configuration:**
```json
"browser-use": {
  "command": "/Users/michaelkraft/.local/bin/uv",
  "args": ["run", "--project", "/Users/michaelkraft/browser-use-mcp", "python", "-m", "browser_use_mcp_server"],
  "env": {
    "OPENAI_API_KEY": "your-key-here"
  }
}
```

**To verify it's working:**
1. Restart Claude Desktop
2. Ask Claude: "Can you browse to https://example.com and describe what you see?"

### 2. Firecrawl MCP Server

Firecrawl provides advanced web scraping capabilities:
- Extract structured data from websites
- Convert web pages to markdown
- Crawl multiple pages
- Handle JavaScript-rendered content

**To complete setup:**

1. **Get a Firecrawl API Key:**
   - Visit https://app.firecrawl.dev/sign-up
   - Sign up for a free account
   - Copy your API key from the dashboard

2. **Update your API key:**
   ```bash
   # Edit the Claude Desktop config
   open "/Users/michaelkraft/Library/Application Support/Claude/claude_desktop_config.json"
   
   # Replace YOUR_FIRECRAWL_API_KEY_HERE with your actual API key
   ```

3. **Restart Claude Desktop**

**Configuration:**
```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "@firecrawl/mcp-server-firecrawl"],
  "env": {
    "FIRECRAWL_API_KEY": "fc-your-actual-api-key-here"
  }
}
```

## Testing the MCP Servers

### Run the Setup Check Script
```bash
./setup-mcp-servers.sh
```

### Test Browser-Use
After restarting Claude, try these commands:
- "Browse to https://github.com and tell me what's on the homepage"
- "Go to https://news.ycombinator.com and list the top 5 stories"
- "Navigate to a website and take a screenshot"

### Test Firecrawl
After adding your API key and restarting:
- "Scrape the content from https://example.com"
- "Extract all the links from https://news.ycombinator.com"
- "Convert this webpage to markdown: [URL]"

## Troubleshooting

### Browser-Use Issues

**Problem:** Browser-use commands fail
**Solutions:**
1. Ensure uv is installed: `/Users/michaelkraft/.local/bin/uv --version`
2. Check Python environment in browser-use-mcp directory
3. Verify OPENAI_API_KEY is valid
4. Check Claude Desktop logs for errors

### Firecrawl Issues

**Problem:** Firecrawl commands return "API key not found"
**Solution:** 
1. Ensure you've replaced YOUR_FIRECRAWL_API_KEY_HERE with your actual key
2. Restart Claude Desktop after updating the config

**Problem:** Rate limit errors
**Solution:** 
- Free tier has limits, consider upgrading if needed
- Space out requests to avoid hitting limits

### General MCP Issues

**Problem:** MCP servers not available after configuration
**Solution:**
1. Fully quit Claude Desktop (Cmd+Q, not just close window)
2. Restart Claude Desktop
3. Check if servers appear in Claude's capabilities

**Problem:** Permission errors
**Solution:**
1. Check file permissions on MCP executables
2. Ensure paths in config are correct
3. Verify all dependencies are installed

## Advanced Usage

### Browser-Use Advanced Features
```python
# The browser-use MCP supports advanced automation:
- Form filling
- Button clicking
- JavaScript execution
- Cookie management
- Multi-tab browsing
```

### Firecrawl Advanced Features
```python
# Firecrawl supports:
- Crawling entire websites
- Custom extraction rules
- Structured data output
- Sitemap generation
- PDF extraction
```

## Security Notes

1. **API Keys:** Keep your API keys secure and never commit them to version control
2. **Permissions:** MCP servers only have access to what you explicitly allow
3. **Network Access:** Both browser-use and Firecrawl require internet access
4. **Data Privacy:** Be mindful of what websites you scrape and respect robots.txt

## Configuration Backup

Your original configuration has been backed up to:
```
/Users/michaelkraft/Library/Application Support/Claude/claude_desktop_config.backup.json
```

To restore if needed:
```bash
cp "/Users/michaelkraft/Library/Application Support/Claude/claude_desktop_config.backup.json" \
   "/Users/michaelkraft/Library/Application Support/Claude/claude_desktop_config.json"
```

## Next Steps

1. ✅ Browser-use is configured and ready (just needs Claude restart)
2. ⏳ Add your Firecrawl API key to the configuration
3. 🔄 Restart Claude Desktop
4. 🧪 Test both MCP servers with the examples above
5. 🚀 Start using advanced web automation and scraping features!

## Additional Resources

- [MCP Documentation](https://github.com/modelcontextprotocol)
- [Browser-Use MCP](https://github.com/browser-use/browser-use-mcp)
- [Firecrawl Documentation](https://docs.firecrawl.dev)
- [Claude Desktop MCP Guide](https://claude.ai/docs/mcp)