# SweetB Logo Setup Instructions

## 📸 Adding Your Logo Files

I've updated the entire website to use your actual SweetB logo images. Now you just need to add the logo files:

### Step 1: Locate Your Logo Files
You have two logo variations:
1. **SweetB PERÚ logo** (with "PERÚ" text) - Primary logo
2. **SweetB logo** (without "PERÚ" text) - Alternate logo

### Step 2: Prepare the Logo Files

**Recommended specifications:**
- **Format**: PNG with transparent background
- **Size**: At least 400-600px width for crisp display on high-DPI screens
- **Color**: Your logos already have the gold "Sweet" and light pink "B" - perfect!

### Step 3: Save the Files

Save your logo files to:
```
C:\Users\desmo\Documents\SweetB\public\images\logos\
```

**File names (IMPORTANT - must match exactly):**
- `sweetb-logo-peru.png` - The logo WITH "PERÚ" text
- `sweetb-logo.png` - The logo WITHOUT "PERÚ" text (for future use)

### Step 4: Verify

After adding the files, refresh your browser. Your actual logos will appear in:
- ✅ **Header** (desktop & mobile menu)
- ✅ **Footer**
- ✅ **Contact page**

## 🎨 Where the Logo Appears

### Desktop Header
- Top-left corner
- Clickable link to homepage
- Hover effect (slight fade)
- Max height: 50px

### Mobile Menu
- Center of mobile menu header
- Clickable link to homepage
- Max height: 45px

### Footer
- Center, above links
- Clickable link to homepage
- Max height: 55px

### Contact Page
- Top of page, centered
- Max height: 70px

## 🔧 Currently Using

The website is configured to use **sweetb-logo-peru.png** (with PERÚ text) throughout, as you mentioned it matches your packaging.

## 📝 Notes

- The Next.js Image component automatically optimizes your logos
- Logos are responsive and scale properly on all devices
- Transparent background is recommended for best results
- If you need to change sizes, adjust the CSS in the respective module files

## ❓ If Logos Don't Appear

If after adding the files the logos don't show:
1. Make sure the file names match EXACTLY (case-sensitive)
2. Refresh the browser with `Ctrl + F5` (hard refresh)
3. Restart the development server (`npm run dev`)

---

**Current Status**: ✅ Code ready, awaiting logo files

