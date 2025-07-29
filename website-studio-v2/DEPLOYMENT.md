# Vercel Deployment Guide

This guide will help you deploy the Website Customization Studio v2 to Vercel.

## Prerequisites

- A Vercel account (free at [vercel.com](https://vercel.com))
- Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)

## Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the Project**
   ```bash
   cd website-studio-v2
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N` (first time)
   - Project name: `website-customization-studio` (or your preference)
   - Directory: `./` (current directory)
   - Override settings: `N`

5. **Set Environment Variables**
   ```bash
   vercel env add ANTHROPIC_API_KEY
   ```
   Then paste your API key when prompted.

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Option 2: Deploy via GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Website Customization Studio v2"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` with your API key value

4. **Deploy**
   - Vercel will automatically deploy on push

## Environment Variables

Required environment variables for production:

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Claude API key | Yes |

Future environment variables (not required yet):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Post-Deployment

Once deployed, you'll get a URL like:
- Preview: `https://website-customization-studio-[hash].vercel.app`
- Production: `https://website-customization-studio.vercel.app`

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly

### Preview Issues

Some websites may not preview due to:
- X-Frame-Options restrictions
- CORS policies
- HTTPS requirements

The app handles these gracefully with fallback messages.

### API Rate Limits

The Claude API has rate limits. For production use:
- Consider implementing caching
- Add request throttling
- Monitor usage in Anthropic console

## Security Notes

- Never commit `.env.local` files
- Use Vercel's environment variables for secrets
- The API key is only used server-side (not exposed to client)
- Preview proxy prevents direct client-website communication

## Support

For issues specific to:
- Vercel deployment: [vercel.com/docs](https://vercel.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Claude API: [anthropic.com/docs](https://anthropic.com/docs)