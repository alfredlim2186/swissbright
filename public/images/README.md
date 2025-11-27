# SweetB Image Assets

This directory contains image assets for the SweetB website.

## Directory Structure

- `/lifestyle/` - Lifestyle and men's health themed images
- `/ingredients/` - Close-up botanical and ingredient images  
- `/product/` - Product photography and packaging shots

## Replacing Unsplash URLs with Local Images

The website currently uses Unsplash URLs for images. To replace them with your own:

### 1. Benefits Section Images
Replace URLs in `app/components/Benefits.tsx`:
- Energy & Focus: `public/images/lifestyle/energy-focus.jpg` (800x600px recommended)
- Balanced Confidence: `public/images/lifestyle/confidence.jpg` (800x600px recommended)
- Lasting Performance: `public/images/lifestyle/performance.jpg` (800x600px recommended)
- Discreet & Convenient: `public/images/lifestyle/convenience.jpg` (800x600px recommended)

Update image paths from:
```typescript
image: 'https://images.unsplash.com/...'
```
To:
```typescript
image: '/images/lifestyle/energy-focus.jpg'
```

### 2. Ingredients Section Images
Replace URLs in `app/components/Ingredients.tsx`:
- Korean Red Ginseng: `public/images/ingredients/ginseng.jpg` (400x400px recommended)
- Tongkat Ali: `public/images/ingredients/tongkat-ali.jpg` (400x400px recommended)
- Maca Root: `public/images/ingredients/maca-root.jpg` (400x400px recommended)
- L-Arginine: `public/images/ingredients/l-arginine.jpg` (400x400px recommended)
- Tribulus Terrestris: `public/images/ingredients/tribulus.jpg` (400x400px recommended)

### 3. Hero Background
Replace URL in `app/components/Hero.tsx`:
- Hero background: `public/images/product/hero-background.jpg` (1920x1080px recommended)

### 4. Product Showcase
Replace URLs in `app/components/ProductShowcase.tsx`:
- Showcase image 1: `public/images/lifestyle/showcase-1.jpg` (1200x800px recommended)
- Showcase image 2: `public/images/lifestyle/showcase-2.jpg` (1200x800px recommended)

## Image Guidelines

- **Format**: JPEG for photos, PNG for graphics with transparency
- **Optimization**: Compress images before upload (use tools like TinyPNG or ImageOptim)
- **Color grading**: Images are automatically filtered to grayscale with gold tinting to match brand
- **Quality**: High resolution but optimized for web (under 500KB per image recommended)

## Image Filtering

All images are automatically styled with:
- Grayscale filter for brand consistency
- Reduced brightness for matte black aesthetic
- Gold/sepia tint on hover
- Next.js automatic lazy loading

No need to pre-process images - the CSS handles the luxury aesthetic automatically!

