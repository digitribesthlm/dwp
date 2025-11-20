# Refactoring Summary

## Changes Made

### 1. ✅ Removed Hardcoded Domain References

#### lib/api.js
- ✅ Removed hardcoded `https://digigrowth.se` fallbacks
- ✅ Made `WORDPRESS_API_URL` configurable via environment variable
- ✅ Added `processHomepageData()` to replace placeholders with env values

#### public/homepage-data.json
- ✅ Replaced all `https://www.digigrowth.se/wp-content/uploads/...` with `/wp-content/uploads/...`
- ✅ Replaced email `hej@digigrowth.se` with `${COMPANY_EMAIL}` placeholder
- ✅ Replaced copyright with `${SITE_NAME}` placeholder
- ✅ Replaced canonical URL with `${SITE_BASE_URL}/` placeholder

### 2. ✅ Created Environment Variable System

#### New Files:
- ✅ `.env.example` - Template for all required environment variables
- ✅ `.env.local` - Pre-configured with DigiGrowth values
- ✅ `lib/processHomepageData.js` - Utility to replace placeholders with env values

#### Environment Variables Added:
```bash
# API Configuration
HOMEPAGE_API_URL
HOMEPAGE_API_TOKEN
WORDPRESS_API_URL

# Site Configuration
SITE_NAME
SITE_BASE_URL
SITE_DESCRIPTION

# Company Information
COMPANY_EMAIL
COMPANY_ADDRESS

# SEO & Social
DEFAULT_OG_IMAGE_URL
DEFAULT_OG_IMAGE_ALT

# Navigation
NAV_CTA_LABEL
NAV_CTA_HREF
```

### 3. ✅ Fixed Blog Post Links

#### app/page.js
- ✅ Changed blog post links from `post.link` (WordPress URLs) to `/${post.slug}` (local routes)
- ✅ Removed `target="_blank"` and `rel="noopener noreferrer"` since links are now local
- ✅ Changed from `<a>` tags to Next.js `<Link>` components

---

## Remaining Issues

### ⚠️ Hardcoded Swedish Text

The following files still contain hardcoded Swedish text that may need to be made configurable:

1. **app/page.js**
   - "Från bloggen" (blog section title)
   - "Läs mer →" (read more link)

2. **app/blogg/page.js**
   - "Läs mer →"

3. **app/tjanster/page.js**
   - "Läs mer →"
   - "Läs mer på WordPress →"

4. **app/digitala-tjanster/[slug]/page.js**
   - "Nyfiken på hur den här tjänsten kan appliceras på din situation? Kontakta oss"

5. **app/om-oss/page.js**
   - "Kontakta oss"

**Recommendation:** These could be:
- Left as-is if the site will always be in Swedish
- Moved to environment variables if you want flexibility
- Moved to a translation file if you plan to support multiple languages

---

## Testing Checklist

Before deploying to Vercel:

### Local Testing
- [ ] Run `npm install` or `pnpm install`
- [ ] Verify `.env.local` has all required variables
- [ ] Run `npm run dev` or `pnpm dev`
- [ ] Test homepage loads correctly
- [ ] Test blog post pages load correctly
- [ ] Verify all images display (from WordPress)
- [ ] Check that no hardcoded `digigrowth.se` URLs appear in browser DevTools

### Vercel Deployment
- [ ] Add all environment variables from `.env.local` to Vercel project settings
- [ ] Deploy to Vercel
- [ ] Test production build
- [ ] Verify SEO meta tags are correct
- [ ] Test all routes work correctly

---

## Files Modified

1. `lib/api.js` - Removed hardcoded URLs, added env variable support
2. `lib/processHomepageData.js` - NEW: Processes placeholders in homepage data
3. `public/homepage-data.json` - Replaced URLs with placeholders
4. `app/page.js` - Fixed blog post links to use local routes
5. `.env.example` - NEW: Template for environment variables
6. `.env.local` - NEW: Pre-configured values

---

## Next Steps

1. **Review remaining hardcoded text** - Decide if Swedish text should be configurable
2. **Test locally** - Verify everything works with the new environment variable system
3. **Update GitHub** - Push changes to repository
4. **Configure Vercel** - Add environment variables to Vercel project
5. **Deploy** - Deploy to production

---

## Notes

- All image URLs now use relative paths (`/wp-content/uploads/...`) which get prepended with `SITE_BASE_URL` at runtime
- The `processHomepageData()` function handles all placeholder replacements dynamically
- No hardcoded domain references remain in the codebase
- The site is now portable and can be deployed for any domain by changing environment variables

---

**Status:** ✅ Ready for Vercel deployment after testing
