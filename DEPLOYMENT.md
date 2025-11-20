# Deploy to Vercel - Simple Guide

## ✅ Concept Verified!

Your Next.js site is working and fetching data from WordPress API!

## The Simple Flow (Just Like You Said)

```
1. Push to GitHub
2. Connect to Vercel
3. Point DNS
4. Done!
```

---

## Step 1: Push to GitHub

```bash
cd /home/ubuntu/digigrowth-demo

# Initialize git (already done)
# git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Hello World with WordPress API"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/digigrowth-demo.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Done! Vercel builds and deploys automatically

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## Step 3: Point DNS to Vercel

### In Vercel Dashboard:

1. Go to your project → Settings → Domains
2. Add your domain (e.g., `digigrowth.se`)
3. Vercel will show you DNS records to add

### In Your DNS Provider:

Add these records (Vercel will show exact values):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Wait 5-60 minutes for DNS propagation

---

## That's It!

Your site is now live at your domain, fetching data from WordPress API.

## What You Get:

- ✅ Lightning-fast Next.js site
- ✅ Automatic deployments (push to GitHub = auto-deploy)
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ SEO-friendly (server-rendered)
- ✅ Real-time WordPress content

## Future Updates:

Just push to GitHub - Vercel automatically rebuilds and deploys!

```bash
# Make changes to your code
git add .
git commit -m "Updated homepage"
git push

# Vercel automatically deploys! 🎉
```

---

## About Site Data (Email, Address, etc.)

You asked about keeping data out of GitHub. Here are your options:

### Option 1: Just Put It in Code (Simplest)

Contact info is public anyway - just put it in the code:

```javascript
const COMPANY_EMAIL = "hej@digigrowth.se";
const COMPANY_ADDRESS = "Kungsholmen - Jaktvarvplan 3";
```

### Option 2: Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_COMPANY_EMAIL=hej@digigrowth.se
```

Then add to Vercel dashboard under Settings → Environment Variables.

### Option 3: Fetch from WordPress

Store everything in WordPress and fetch via API (most flexible).

**Honestly? Option 1 is fine.** Contact info isn't secret.

---

## SEO Status: ✅ Excellent

This setup uses Next.js App Router with automatic server-side rendering:
- Google sees fully rendered HTML
- Meta tags work
- Social sharing works
- Fast page loads = better rankings

---

## Cost: FREE

- Vercel Free Tier: Perfect for this site
- 100GB bandwidth/month
- Unlimited deployments
- Free SSL

Upgrade to Pro ($20/month) only if you get massive traffic.
