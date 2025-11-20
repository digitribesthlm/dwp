# Headless WordPress + Next.js Frontend

A production-ready headless WordPress frontend built with Next.js 16, featuring server-side rendering, dynamic content from WordPress REST API, and full environment variable configuration.

## Features

✅ **Fully Dynamic Content**
- Homepage data from JSON API
- Blog posts from WordPress REST API
- No hardcoded domain references

✅ **SEO Optimized**
- Server-side rendering (SSR)
- Dynamic meta tags
- OpenGraph and Twitter cards
- Canonical URLs

✅ **Environment-Based Configuration**
- All site-specific data in environment variables
- Portable across domains
- Secure API token handling

✅ **Modern Stack**
- Next.js 16 with App Router
- React 19
- Tailwind CSS 4
- TypeScript support

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

See `.env.example` for all required variables.

### Required:
- `HOMEPAGE_API_URL` - URL to your homepage JSON API
- `HOMEPAGE_API_TOKEN` - API authentication token
- `WORDPRESS_API_URL` - WordPress REST API endpoint
- `SITE_NAME` - Your site name
- `SITE_BASE_URL` - Your site's base URL
- `COMPANY_EMAIL` - Contact email

### Optional:
- `SITE_DESCRIPTION` - Meta description
- `COMPANY_ADDRESS` - Footer address
- `DEFAULT_OG_IMAGE_URL` - Default social share image
- `NAV_CTA_LABEL` - Navigation CTA button text
- `NAV_CTA_HREF` - Navigation CTA button link

---

## Project Structure

```
├── app/
│   ├── [slug]/          # Dynamic blog post pages
│   ├── blogg/           # Blog listing page
│   ├── kontakt/         # Contact page
│   ├── om-oss/          # About page
│   ├── tjanster/        # Services page
│   ├── digitala-tjanster/[slug]/  # Service detail pages
│   ├── page.js          # Homepage
│   ├── layout.js        # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── Navigation.js    # Header navigation
│   └── Footer.js        # Footer component
├── lib/
│   ├── api.js           # API functions
│   ├── siteConfig.js    # Site configuration
│   └── processHomepageData.js  # Data processing utility
└── public/
    └── homepage-data.json  # Static homepage data (optional)
```

---

## Deployment

### Deploy to Vercel

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/digitribesthlm/dwp)

---

## API Integration

### Homepage Data

Fetched from `HOMEPAGE_API_URL`:

```javascript
{
  "hero": { ... },
  "mrr_section": { ... },
  "case_studies_section": { ... },
  "footer": { ... }
}
```

Placeholders like `${SITE_BASE_URL}` and `${COMPANY_EMAIL}` are automatically replaced with environment variable values.

### WordPress Posts

Fetched from `WORDPRESS_API_URL/posts`:

- Blog listing: Latest posts
- Single post: By slug (`/[slug]`)
- Embedded media: Featured images

---

## Customization

### Update Styles

Edit `app/globals.css` for global styles or use Tailwind classes inline.

### Add Pages

Create new files in `app/` directory:

```javascript
// app/new-page/page.js
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

### Modify Navigation

Update `lib/siteConfig.js` or use `NAV_PRIMARY` environment variable (JSON format).

---

## Development

### Build for Production

```bash
pnpm build
pnpm start
```

### Type Checking

```bash
npx tsc --noEmit
```

---

## Troubleshooting

### Images not loading
- Check `SITE_BASE_URL` is correct
- Verify WordPress images are accessible

### API errors
- Verify `HOMEPAGE_API_URL` and `WORDPRESS_API_URL`
- Check API tokens are correct
- Test APIs directly in browser

### Build fails
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

---

## Performance

- **Homepage:** No caching (always fresh)
- **Blog posts:** 5-minute cache
- **Pages:** 10-minute cache

Adjust in `lib/api.js` as needed.

---

## Security

- ✅ API tokens server-side only
- ✅ No hardcoded credentials
- ✅ Environment variables not exposed to browser
- ✅ CORS handled by WordPress

---

## License

MIT

---

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and WordPress**
