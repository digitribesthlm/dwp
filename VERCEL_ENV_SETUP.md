# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in Vercel → Settings → Environment Variables:

### 1. Homepage API Configuration

**`HOMEPAGE_API_URL`**
- Value: `https://www.digigrowth.se/api/homepage-api.php`
- Description: WordPress custom homepage API endpoint

**`HOMEPAGE_API_TOKEN`**
- Value: `[YOUR_API_TOKEN_HERE]`
- Description: Authentication token for homepage API
- **Important:** Get the correct token from WordPress admin or the API configuration

### 2. WordPress REST API

**`WORDPRESS_API_URL`**
- Value: `https://www.digigrowth.se/wp-json/wp/v2`
- Description: WordPress REST API base URL

### 3. Site Configuration

**`SITE_BASE_URL`**
- Value: `https://www.digigrowth.se` (if using www)
- OR: `https://digigrowth.se` (if using non-www)
- Description: Your site's canonical base URL

### 4. Next.js Configuration

**`NEXT_PUBLIC_SITE_URL`** (optional)
- Value: Same as `SITE_BASE_URL`
- Description: Public-facing site URL for client-side code

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** in the top menu
3. Click **Environment Variables** in the left sidebar
4. For each variable:
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Select environments: **Production**, **Preview**, **Development** (check all)
   - Click **Save**

## After Adding Variables

1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **"Redeploy"**
4. Wait for the new deployment to complete

## Troubleshooting

### If you get "Forbidden" errors:

1. **Check the API token** - Make sure `HOMEPAGE_API_TOKEN` matches the token configured in WordPress
2. **Check WordPress firewall** - Ensure Vercel's IPs are not blocked
3. **Test the API manually**:
   ```bash
   curl "https://www.digigrowth.se/api/homepage-api.php?token=YOUR_TOKEN"
   ```

### If build fails:

- The code now has error handling to return empty arrays if APIs fail
- Check Vercel build logs for specific error messages
- Verify all environment variables are set correctly

## Finding Your API Token

The API token should be in one of these places:

1. Your local `.env.local` file (in the project root)
2. WordPress admin panel (custom API settings)
3. The `homepage-api.php` file itself (look for token validation code)

Contact your WordPress administrator if you don't have access to these.
