# Vercel Deployment Setup Guide

## 🚀 Step 1: Push Your Code to Git

Vercel automatically deploys when you push to your repository. Here's how:

### If you haven't initialized git yet:
```bash
git init
git add .
git commit -m "Initial commit - SweetB website"
```

### Connect to your Git repository (GitHub, GitLab, or Bitbucket):
```bash
# If using GitHub (example):
git remote add origin https://github.com/yourusername/sweetb.git
git branch -M main
git push -u origin main
```

### If you already have a git repository:
```bash
git add .
git commit -m "Fix build errors and add PostgreSQL support"
git push
```

---

## 🔗 Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will detect it's a Next.js project automatically

---

## ⚙️ Step 3: Configure Build Settings

Vercel should auto-detect Next.js, but verify:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or leave default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

---

## 🔐 Step 4: Add Environment Variables

**Before deploying**, add these environment variables in Vercel:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add each variable:

### Required Variables:

**1. DATABASE_URL**
- **Key:** `DATABASE_URL`
- **Value:** Your Neon connection string
  - Go to [console.neon.tech](https://console.neon.tech)
  - Open your project
  - Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
- **Environment:** Production, Preview, Development (select all)

**2. SESSION_SECRET**
- **Key:** `SESSION_SECRET`
- **Value:** `i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ=` (or generate your own)
- **Environment:** Production, Preview, Development (select all)

**3. EMAIL_API_KEY**
- **Key:** `EMAIL_API_KEY`
- **Value:** Your Resend API key (from [resend.com/api-keys](https://resend.com/api-keys))
- **Environment:** Production, Preview, Development (select all)

### Optional Variables:

**4. EMAIL_FROM**
- **Key:** `EMAIL_FROM`
- **Value:** `no-reply@sweetb.co` (or your verified email)
- **Environment:** Production, Preview, Development (select all)

**5. VERIFIER_URL** (if using verification service)
- **Key:** `VERIFIER_URL`
- **Value:** Your verification service URL

**6. VERIFIER_API_KEY** (if using verification service)
- **Key:** `VERIFIER_API_KEY`
- **Value:** Your verification service API key

---

## 🗄️ Step 5: Set Up Database (After First Deploy)

After your first successful deployment:

1. Go to your Vercel project → **Deployments** tab
2. Click on the latest deployment
3. Click **"View Function Logs"** or use Vercel CLI

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Run migrations:
   ```bash
   vercel env pull .env.local  # Pull environment variables
   npx prisma migrate deploy
   npm run db:seed
   ```

### Option B: Using Vercel Dashboard

1. Go to your project → **Settings** → **Functions**
2. You can't run commands directly, but you can:
   - Create a one-time API route to run migrations
   - Or use Vercel's database integration

### Option C: Run Migrations Locally (Easiest)

1. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```
2. Run migrations locally (they'll apply to your Neon database):
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

---

## ✅ Step 6: Deploy

1. After adding environment variables, Vercel will automatically:
   - Detect the push to your git repository
   - Start a new deployment
   - Run `npm install`
   - Run `prisma generate` (via postinstall script)
   - Run `npm run build`
   - Deploy your app

2. Watch the deployment in the **Deployments** tab

3. Once deployed, your app will be live at: `https://your-project.vercel.app`

---

## 🔍 Step 7: Verify Everything Works

1. **Check build logs:**
   - Go to **Deployments** → Click on latest deployment
   - Check for any errors

2. **Test your app:**
   - Visit your Vercel URL
   - Try logging in at `/login`
   - Check that database connections work

3. **Check function logs:**
   - Go to **Functions** tab
   - Monitor for any runtime errors

---

## 🐛 Troubleshooting

### Build Fails with "Prisma Client not generated"
- **Fix:** The `postinstall` script should handle this automatically
- If not, add `prisma generate` to your build command manually

### Build Fails with "DATABASE_URL not found"
- **Fix:** Make sure you added `DATABASE_URL` in Vercel environment variables
- Check that it's enabled for the correct environment (Production/Preview)

### Database Connection Errors
- **Fix:** 
  - Verify `DATABASE_URL` is correct in Vercel
  - Make sure Neon database is running
  - Check that migrations have been run: `npx prisma migrate deploy`

### "Failed to collect page data" Errors
- **Fix:** We already fixed this by adding `export const dynamic = 'force-dynamic'` to API routes
- Make sure you've pushed the latest code

### Environment Variables Not Working
- **Fix:**
  - Make sure variables are added for the correct environment
  - Redeploy after adding variables (Vercel should auto-redeploy)
  - Check variable names are exact (case-sensitive)

---

## 📝 Quick Checklist

- [ ] Code pushed to Git repository
- [ ] Project connected to Vercel
- [ ] `DATABASE_URL` added (Neon connection string)
- [ ] `SESSION_SECRET` added
- [ ] `EMAIL_API_KEY` added
- [ ] `EMAIL_FROM` added (optional)
- [ ] First deployment successful
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] App is working on Vercel URL

---

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (optional):
   - Go to **Settings** → **Domains**
   - Add your custom domain

2. **Monitor performance:**
   - Check **Analytics** tab
   - Monitor **Functions** for API performance

3. **Set up preview deployments:**
   - Every branch/PR automatically gets a preview URL
   - Great for testing before merging

---

## 💡 Pro Tips

- **Use Vercel CLI** for easier database migrations
- **Enable preview deployments** to test changes before production
- **Monitor function logs** to catch errors early
- **Set up alerts** for failed deployments
- **Use environment-specific variables** (different values for dev/prod)

Your app should now be live on Vercel! 🎉

