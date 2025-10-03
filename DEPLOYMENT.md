# Deployment Guide for Hostinger

This guide will help you deploy your All Apps Free website to Hostinger.

## Prerequisites

1. A Hostinger account with hosting plan
2. Node.js installed on your local machine
3. Git (optional, for version control)

## Deployment Steps

### 1. Build the Project

```bash
# Install dependencies
npm install

# Build the project for production
npm run build
```

This will create a `out` folder with all the static files ready for deployment.

### 2. Upload to Hostinger

1. **Access your Hostinger control panel**
2. **Go to File Manager**
3. **Navigate to the `public_html` folder** (or your domain's root folder)
4. **Upload all contents from the `out` folder** to `public_html`

### 3. File Structure on Hostinger

Your Hostinger `public_html` folder should contain:
```
public_html/
├── _next/
├── tools/
├── index.html
├── robots.txt
├── sitemap.xml
└── ... (other static files)
```

### 4. Configure Domain (if needed)

- If using a subdomain, make sure it points to the correct folder
- If using the main domain, ensure files are in `public_html`

### 5. Test Your Deployment

1. Visit your domain
2. Test navigation between pages
3. Verify all tools are accessible
4. Check mobile responsiveness

## Alternative: Using Hostinger's Git Integration

If you prefer using Git:

1. **Push your code to GitHub/GitLab**
2. **In Hostinger control panel, go to Git Version Control**
3. **Connect your repository**
4. **Set build command**: `npm run build`
5. **Set output directory**: `out`

## Troubleshooting

### Common Issues:

1. **404 errors on refresh**: Make sure you're using static export mode (already configured)
2. **Images not loading**: Check that images are in the correct path
3. **CSS not loading**: Verify that all files were uploaded correctly

### Performance Optimization:

1. **Enable Gzip compression** in Hostinger control panel
2. **Set up caching** for static assets
3. **Use CDN** if available in your Hostinger plan

## Updating Your Site

To update your site:

1. Make changes to your code
2. Run `npm run build`
3. Upload the new `out` folder contents to Hostinger
4. Clear any caches if needed

## Support

If you encounter issues:
1. Check Hostinger's documentation
2. Verify file permissions
3. Check browser console for errors
4. Ensure all files were uploaded completely
