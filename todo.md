# Project TODO

## Completed Features
- [x] Basic Next.js site structure with all major pages
- [x] Homepage with JSON API integration
- [x] Blog pages with WordPress REST API integration
- [x] Contact page with Google Maps
- [x] Cookie policy page
- [x] SEO optimization
- [x] Remove WordPress metadata and hardcoded URLs
- [x] Fix kontakt page syntax error
- [x] Remove Growth Hacks link from footer

## New Features
- [x] Add contact form to kontakt page
- [x] Implement webhook POST integration for form submissions
- [x] Add spam protection (honeypot + rate limiting)
- [x] Improve kontakt page layout with form, contact info, and map
- [x] Add form validation and user feedback

## SEO Fixes
- [x] Fix social share buttons to use frontend URLs instead of WordPress URLs
- [x] Canonical URLs already correct in blog posts metadata

## Bug Fixes
- [x] Create category pages to fix 404 errors and enable browsing posts by category

## Deployment Fixes
- [x] Fix WordPress API 403 Forbidden errors during Vercel build
- [x] Make generateStaticParams handle API failures gracefully
- [ ] Configure correct environment variables in Vercel (see VERCEL_ENV_SETUP.md)

## Critical Fixes
- [x] Fix homepage 500 error when WordPress API fails
- [x] Add fallback data for homepage when API is unreachable

## Page Fixes
- [x] Add trailing slash configuration to Next.js
- [x] Fix /kontakt page to handle null data
- [x] Fix /digitala-tjanster/[slug] pages to handle null data
- [x] Fix /om-oss page to handle null data
- [x] Fix /tjanster page to handle null data
- [ ] Fix /category/[slug] pages to handle null data
- [ ] Fix /[slug] blog post pages to handle null data
