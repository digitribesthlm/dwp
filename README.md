# Headless WordPress + Next.js Starter

A modern, production-ready starter template for building headless WordPress websites with Next.js 15. This template provides a clean separation between content (WordPress) and presentation (Next.js), enabling fast, SEO-friendly, and highly customizable websites.

## Features

- **Next.js 15** with App Router
- **Headless WordPress** integration via REST API
- **Tailwind CSS 4** for styling
- **TypeScript** support
- **Dynamic routing** for blog posts, pages, and services
- **SEO optimized** with proper meta tags and Open Graph support
- **Responsive navigation** with mobile menu
- **Contact form** with webhook integration
- **Environment-based configuration** - fully customizable
- **Image optimization** with Next.js Image component
- **WordPress URL rewriting** for seamless content migration

## Prerequisites

- Node.js 18+ and npm/pnpm
- WordPress installation with REST API enabled
- Custom WordPress API endpoint for homepage data (optional, falls back to local JSON)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd dwp
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure environment variables

Copy the example environment file and update it with your site's information:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# WordPress API Configuration
HOMEPAGE_API_URL=https://wp.your-site.com/api/homepage-api.php
HOMEPAGE_API_TOKEN=your-api-token-here
WORDPRESS_API_URL=https://wp.your-site.com/wp-json/wp/v2

# Site Configuration
SITE_NAME=Your Company Name
SITE_BASE_URL=https://www.your-site.com
SITE_DESCRIPTION='Your site description'

# Company Information
COMPANY_EMAIL=contact@your-site.com
COMPANY_ADDRESS='Your Address, City, Country'

# SEO & Social
DEFAULT_OG_IMAGE_URL=https://wp.your-site.com/wp-content/uploads/your-og-image.jpg
DEFAULT_OG_IMAGE_ALT=Your default image description

# Contact Form
CONTACT_FORM_WEBHOOK=https://your-webhook-service.com/webhook/your-id

# Homepage Evaluation Webhook
WEBHOOK_HOMEPAGE_EVALUATION=https://your-webhook-service.com/webhook/homepage-eval

# Navigation
NAV_CTA_LABEL=Get Started!
NAV_CTA_HREF=/contact/
```

### 4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Build for production

```bash
npm run build
npm start
```

## Environment Variables

All environment variables are documented in `.env.example`. Here's what each one does:

| Variable | Required | Description |
|----------|----------|-------------|
| `HOMEPAGE_API_URL` | Yes | URL to your custom WordPress homepage API endpoint |
| `HOMEPAGE_API_TOKEN` | Yes | Authentication token for homepage API |
| `WORDPRESS_API_URL` | Yes | WordPress REST API base URL |
| `SITE_NAME` | Yes | Your site/company name |
| `SITE_BASE_URL` | Yes | Your site's base URL (without trailing slash) |
| `SITE_DESCRIPTION` | No | Site description for SEO |
| `COMPANY_EMAIL` | No | Contact email displayed in footer |
| `COMPANY_ADDRESS` | No | Physical address for footer |
| `DEFAULT_OG_IMAGE_URL` | No | Default Open Graph image for social sharing |
| `DEFAULT_OG_IMAGE_ALT` | No | Alt text for default OG image |
| `CONTACT_FORM_WEBHOOK` | Yes | Webhook URL for contact form submissions |
| `WEBHOOK_HOMEPAGE_EVALUATION` | Yes | Webhook that receives the homepage test data |
| `NAV_CTA_LABEL` | No | Text for navigation CTA button |
| `NAV_CTA_HREF` | No | Link for navigation CTA button |

## Project Structure

```
dwp/
├── app/                    # Next.js App Router pages
│   ├── [slug]/            # Dynamic blog post pages
│   ├── api/               # API routes
│   ├── blogg/             # Blog listing page
│   ├── category/          # Category pages
│   ├── cookie/            # Cookie policy page
│   ├── digitala-tjanster/ # Service pages
│   ├── hemside-test/      # Homepage evaluation wizard
│   ├── kontakt/           # Contact page
│   ├── om-oss/            # About page
│   ├── tjanster/          # Services listing
│   ├── layout.js          # Root layout
│   └── page.js            # Homepage
├── components/            # React components
│   ├── ContactForm.js     # Contact form component
│   ├── Footer.js          # Footer component
│   └── Navigation.js      # Navigation component
├── lib/                   # Utility libraries
│   ├── api.js             # WordPress API functions
│   ├── processHomepageData.js  # Data processing
│   ├── siteConfig.js      # Site configuration
│   └── urlUtils.js        # URL utilities
├── public/                # Static assets
│   └── homepage-data.json # Fallback homepage data
├── .env.example           # Environment variables template
└── package.json           # Dependencies
```

## WordPress Setup

This template expects your WordPress installation to:

1. Have the REST API enabled (default in WordPress 4.7+)
2. Have a custom homepage API endpoint at `/api/homepage-api.php` (optional)
3. Use proper permalinks (not plain)

### Custom Homepage API

The custom homepage API should return JSON with this structure:

```json
{
  "page_id": 2,
  "page_title": "Homepage Title",
  "hero": {
    "heading": "Main Heading",
    "subheading": "Subheading text",
    "button": {
      "text": "CTA Text",
      "link": "/contact"
    },
    "background_image": {
      "url": "/path/to/image.jpg",
      "alt": "Image description"
    }
  },
  "footer": {
    "company": {
      "name": "Company Name",
      "contact": {
        "email": "contact@example.com"
      }
    }
  }
}
```

If this endpoint isn't available, the app falls back to `/public/homepage-data.json`.

## Customization

### Adding Pages

1. Create a new file in `app/your-page/page.js`
2. Import necessary components
3. Fetch data from WordPress or use static content
4. Export your page component with metadata

### Styling

This template uses Tailwind CSS 4. Modify styles by:

- Editing component className attributes
- Adding custom CSS in `app/globals.css`
- Configuring Tailwind in `tailwind.config.js` (if needed)

### Adding WordPress Content Types

To add custom post types or taxonomies:

1. Add fetch functions in `lib/api.js`
2. Create dynamic routes in `app/[your-type]/[slug]/page.js`
3. Add static generation if needed

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Testing

A Playwright test script is included in `test-services.js` for testing service page links:

```bash
node test-services.js
```

Make sure your dev server is running on `localhost:3000` before running tests.

## Troubleshooting

### Images not loading

Make sure your `next.config.ts` includes your WordPress domain in `images.domains`:

```typescript
const nextConfig = {
  images: {
    domains: ['wp.your-site.com'],
  },
};
```

### API errors

Check that:
- Your WordPress site is accessible
- REST API is enabled
- CORS is configured if needed
- API tokens are correct

### Build errors

Ensure all required environment variables are set in your deployment platform.

## License

MIT

## Support

For issues and questions, please open an issue in the GitHub repository.
