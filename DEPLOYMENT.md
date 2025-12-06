# Vercel Deployment Guide

## Pre-Deployment Checklist

✅ All pages updated with SEO and GEO AI tags
✅ robots.txt created
✅ sitemap.xml created
✅ vercel.json configured
✅ All files committed to git

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect it's a static site
4. Click "Deploy"

### Option 3: Auto-deploy from Git

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch

## Post-Deployment Verification

After deployment, verify:

1. ✅ Homepage loads: `https://qallous.ai/`
2. ✅ All pages accessible:
   - `/pricing.html` or `/pricing`
   - `/industries.html` or `/industries`
   - `/faq.html` or `/faq`
   - `/case-studies.html` or `/case-studies`
3. ✅ robots.txt accessible: `https://qallous.ai/robots.txt`
4. ✅ sitemap.xml accessible: `https://qallous.ai/sitemap.xml`
5. ✅ Assets load correctly (CSS, JS, images)
6. ✅ All CTAs link to `voice.qallous.ai`
7. ✅ SEO meta tags present (check page source)
8. ✅ No console errors

## Environment Variables (if needed)

If you need environment variables for API keys, add them in Vercel dashboard:
- Settings → Environment Variables

## Custom Domain Setup

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add `qallous.ai` and `www.qallous.ai`
4. Update DNS records as instructed

## Troubleshooting

### Issue: 404 errors on pages
- **Solution**: Check vercel.json rewrites are correct
- Verify file names match (case-sensitive)

### Issue: Assets not loading
- **Solution**: Check file paths are relative (not absolute)
- Verify assets folder structure

### Issue: SEO tags not showing
- **Solution**: View page source to verify meta tags
- Check for HTML validation errors

### Issue: Redirect loops
- **Solution**: Check vercel.json cleanUrls and trailingSlash settings

## Rollback

If something breaks:

1. Go to Vercel dashboard
2. Deployments → Find previous working deployment
3. Click "..." → "Promote to Production"

## Notes

- Static HTML site, no build process needed
- Vercel will serve files directly
- All SEO and GEO AI tags are in HTML files
- No server-side rendering required

