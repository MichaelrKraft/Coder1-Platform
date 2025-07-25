# Render Deployment Guide for Coder1 Platform

## Prerequisites
1. A Render account (https://render.com)
2. Your GitHub repository connected to Render

## Step-by-Step Deployment

### 1. Connect Your GitHub Repository
1. Log in to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select the `MichaelrKraft/Coder1-Platform` repository
5. Click "Connect"

### 2. Configure Your Web Service
Fill in these settings:

- **Name**: `coder1-platform` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or your preferred tier)

### 3. Add Environment Variables
In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000

# Add these if you're using AI features:
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
```

⚠️ **Important**: Never commit API keys to your repository!

### 4. Deploy
1. Click "Create Web Service"
2. Render will automatically deploy your app
3. Wait for the build to complete (usually 2-5 minutes)

### 5. Access Your App
Once deployed, you'll get a URL like:
- `https://coder1-platform.onrender.com`

Your app structure will be:
- Main page: `https://coder1-platform.onrender.com/`
- Smart PRD Generator: `https://coder1-platform.onrender.com/smart-prd-generator.html`
- IDE: `https://coder1-platform.onrender.com/ide-build/`

## Auto-Deploy Setup
Render automatically deploys when you push to your main branch by default.

To verify auto-deploy is enabled:
1. Go to your service Settings
2. Check that "Auto-Deploy" is set to "Yes"
3. Verify the branch is set to `main`

## Monitoring
- Health check endpoint: `/health`
- Logs: Available in Render dashboard
- Metrics: Available in Render dashboard

## Troubleshooting

### If deployment fails:
1. Check build logs in Render dashboard
2. Verify all dependencies are in package.json
3. Ensure PORT environment variable is set to 10000

### If app doesn't load:
1. Check that static files are being served correctly
2. Verify the health check is passing
3. Check browser console for errors

## Notes
- The free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- For always-on service, upgrade to a paid tier

## Current Configuration
The `render.yaml` file in your repository defines:
- Node.js web service
- Health check at `/health`
- Static file serving from root directory
- Production environment settings