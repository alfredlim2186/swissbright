# Git Commands to Push Cloudinary Update

Run these commands in your terminal (PowerShell or Git Bash):

## Step 1: Install Cloudinary Package
```bash
npm install cloudinary
```

## Step 2: Stage Changes
```bash
git add app/api/admin/content/upload/route.ts
git add app/api/admin/media/route.ts
git add app/admin/media/MediaManager.tsx
git add package.json
git add package-lock.json
```

## Step 3: Commit Changes
```bash
git commit -m "Migrate file uploads and media library to Cloudinary for Vercel compatibility"
```

## Step 4: Push to Repository
```bash
git push
```

---

## After Pushing - Important!

Don't forget to add Cloudinary environment variables in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these three variables:
   - **CLOUDINARY_CLOUD_NAME** = Your Cloudinary cloud name
   - **CLOUDINARY_API_KEY** = Your Cloudinary API key  
   - **CLOUDINARY_API_SECRET** = Your Cloudinary API secret

3. Get your credentials from: https://cloudinary.com/console

4. After adding variables, Vercel will automatically redeploy

---

## Quick Copy-Paste (All at once)

```bash
npm install cloudinary && git add app/api/admin/content/upload/route.ts app/api/admin/media/route.ts app/admin/media/MediaManager.tsx package.json package-lock.json && git commit -m "Migrate file uploads and media library to Cloudinary for Vercel compatibility" && git push
```

