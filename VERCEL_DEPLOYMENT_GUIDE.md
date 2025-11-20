# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] All hardcoded domain references removed
- [x] Environment variables configured in `.env.local`
- [x] Homepage data uses placeholders (${SITE_BASE_URL}, ${COMPANY_EMAIL}, etc.)
- [x] API endpoints use environment variables
- [x] Blog post links use local routes (`/${slug}`)
- [x] Images load from WordPress via environment-based URLs
- [x] No console errors in development
- [x] Package name updated to generic name

---

## Step 1: Push to GitHub

```bash
cd /home/ubuntu/dwp

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Refactored for production - removed hardcoded references"

# Add remote (replace with your repo)
git remote add origin https://github.com/digitribesthlm/dwp.git

# Push
git push -u origin main
```

---

## Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose **digitribesthlm/dwp**
5. Click **"Import"**

---

## Step 3: Configure Environment Variables in Vercel

**CRITICAL:** Add these environment variables in Vercel project settings:

### Navigate to:
Project Settings → Environment Variables

### Add the following variables:

```bash
# Homepage API Configuration
HOMEPAGE_API_URL=https://digigrowth.se/api/homepage-api.php
HOMEPAGE_API_TOKEN=usdfywe8sdf8sdf

# WordPress API Configuration
WORDPRESS_API_URL=https://digigrowth.se/wp-json/wp/v2

# Site Configuration
SITE_NAME=Digigrowth
SITE_BASE_URL=https://digigrowth.se
SITE_DESCRIPTION=Digital Marknadsföring - Byrå med fokus på enkelhet, sunt förnuft och aktivitet.

# Company Information
COMPANY_EMAIL=hej@digigrowth.se
COMPANY_ADDRESS=Kungsholmen • Jaktvarvsplan 3, Stockholm, Sweden

# SEO & Social
DEFAULT_OG_IMAGE_URL=https://www.digigrowth.se/wp-content/uploads/2025/11/film-2-scaled.jpg
DEFAULT_OG_IMAGE_ALT=Digital Marknadsföring

# Navigation
NAV_CTA_LABEL=TA STEGET MOT FLER NYA KUNDER!
NAV_CTA_HREF=/kontakt/
```

### Important Notes:
- ✅ Add variables to **all environments** (Production, Preview, Development)
- ✅ Do NOT check "Expose to browser" - these are server-side only
- ✅ Click "Save" after adding each variable

---

## Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide a URL like: `https://dwp-xxx.vercel.app`

---

## Step 5: Test Production Deployment

### Check these pages:
- [ ] Homepage: `https://your-vercel-url.vercel.app/`
- [ ] Blog post: `https://your-vercel-url.vercel.app/slarva-inte-med-dina-urler`
- [ ] Contact page: `https://your-vercel-url.vercel.app/kontakt`

### Verify:
- [ ] All images load correctly
- [ ] No hardcoded `digigrowth.se` URLs in source code (check DevTools)
- [ ] Blog posts link to local routes (not WordPress)
- [ ] SEO meta tags are correct
- [ ] Navigation works
- [ ] Footer displays correct email and address

---

## Step 6: Connect Custom Domain

### In Vercel:
1. Go to **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `new.digigrowth.se` or `digigrowth.com`)
4. Vercel will provide DNS records

### In Your DNS Provider:
Add the DNS records provided by Vercel:

**For subdomain (e.g., new.digigrowth.se):**
```
Type: CNAME
Name: new
Value: cname.vercel-dns.com
```

**For root domain (e.g., digigrowth.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

### Wait for DNS propagation (5-30 minutes)

---

## Step 7: Update Environment Variables for Custom Domain

Once your custom domain is connected, update:

```bash
SITE_BASE_URL=https://your-custom-domain.com
```

In Vercel: Project Settings → Environment Variables → Edit `SITE_BASE_URL`

Then **redeploy** the project.

---

## Troubleshooting

### Images not loading
- Check that `SITE_BASE_URL` is correct
- Verify WordPress images are accessible at `https://digigrowth.se/wp-content/uploads/...`
- Check browser console for 404 errors

### Environment variables not working
- Ensure variables are added to **all environments** in Vercel
- Redeploy after adding/changing variables
- Check that variable names match exactly (case-sensitive)

### Build fails
- Check build logs in Vercel
- Verify `package.json` has correct dependencies
- Try building locally: `pnpm build`

### Blog posts 404
- Verify WordPress API is accessible
- Check that `WORDPRESS_API_URL` is correct
- Test API directly: `https://digigrowth.se/wp-json/wp/v2/posts`

---

## Performance Optimization (Optional)

### Enable Edge Functions
In `vercel.json`:
```json
{
  "functions": {
    "app/**/*.js": {
      "runtime": "edge"
    }
  }
}
```

### Add Caching Headers
Already configured in `lib/api.js`:
- Homepage: `cache: 'no-store'` (always fresh)
- Blog posts: `revalidate: 300` (5 minutes)
- Pages: `revalidate: 600` (10 minutes)

---

## Security Checklist

- [x] API tokens not exposed to browser
- [x] Environment variables server-side only
- [x] No hardcoded credentials in code
- [x] CORS handled by WordPress API
- [x] No sensitive data in Git history

---

## Monitoring

### Vercel Analytics (Optional)
1. Go to Project → Analytics
2. Enable Vercel Analytics
3. View real-time traffic and performance

### WordPress API Health
Monitor your WordPress API endpoint:
- `https://digigrowth.se/wp-json/wp/v2/posts`

If it goes down, the blog section will fail to load.

---

## Rollback Plan

If something goes wrong:

1. **Instant rollback** in Vercel:
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Revert Git changes**:
   ```bash
   git revert HEAD
   git push
   ```

---

## Success Criteria

✅ Homepage loads in < 2 seconds  
✅ All images display correctly  
✅ Blog posts load from WordPress  
✅ SEO meta tags are correct  
✅ No console errors  
✅ Mobile responsive  
✅ Custom domain connected  

---

## Next Steps After Deployment

1. **Test thoroughly** on production
2. **Monitor performance** in Vercel Analytics
3. **Set up error tracking** (optional: Sentry)
4. **Configure CDN caching** (Vercel handles this automatically)
5. **Update WordPress** to point to new frontend (if replacing old site)

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project Issues:** Check GitHub repo issues

---

**Deployment Status:** ✅ Ready for Production

**Last Updated:** 2025-11-20  
**Version:** 1.0
