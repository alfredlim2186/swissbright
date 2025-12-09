# Local Development Setup Guide

## 🚀 Quick Setup Steps

### Step 1: Get Your Neon Database Connection String

1. Go to [console.neon.tech](https://console.neon.tech)
2. Log in to your account
3. Open your project (the one you created earlier)
4. Look for **"Connection string"** or **"Connection details"**
5. Copy the connection string - it looks like:
   ```
   postgresql://user:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### Step 2: Update `.env.local` File

1. Open the `.env.local` file in your project root
2. Replace the placeholder `DATABASE_URL` with your actual Neon connection string:
   ```env
   DATABASE_URL="postgresql://your-actual-connection-string-here"
   ```
3. Make sure to keep the quotes around the connection string

### Step 3: Add Other Environment Variables (Optional but Recommended)

Update these in `.env.local`:

- **EMAIL_API_KEY**: Get from [resend.com/api-keys](https://resend.com/api-keys)
- **SESSION_SECRET**: Already has a default value, but you can change it
- **EMAIL_FROM**: Your verified email address in Resend

### Step 4: Run Database Migrations

Now that `DATABASE_URL` is set, run:

```bash
# Generate Prisma client (if not already done)
npx prisma generate

# Run migrations to create all tables
npx prisma migrate deploy

# Or if you want to create a new migration:
npx prisma migrate dev --name init_postgresql
```

### Step 5: Seed the Database

Create the admin user and initial data:

```bash
npm run db:seed
```

This will create:
- Admin user: `admin@sweetb.co`
- Feature flags for lucky draw

### Step 6: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## ✅ Verification

After setup, you should be able to:

1. ✅ Run `npx prisma migrate deploy` without errors
2. ✅ Run `npm run db:seed` successfully
3. ✅ Start the dev server with `npm run dev`
4. ✅ Log in at `/login` with `admin@sweetb.co`

---

## 🔍 Troubleshooting

### "Environment variable not found: DATABASE_URL"
- **Fix:** Make sure `.env.local` exists in the project root
- **Fix:** Check that `DATABASE_URL` is spelled correctly (case-sensitive)
- **Fix:** Make sure the connection string is in quotes: `DATABASE_URL="..."`

### "Connection refused" or database connection errors
- **Fix:** Verify your Neon connection string is correct
- **Fix:** Make sure your Neon database is running (check Neon dashboard)
- **Fix:** Check that the connection string includes `?sslmode=require`

### "Prisma Client not generated"
- **Fix:** Run `npx prisma generate` first
- **Fix:** Make sure `DATABASE_URL` is set before running generate

### Migration fails
- **Fix:** Make sure you're using the correct connection string
- **Fix:** Check that the database exists in Neon
- **Fix:** Try `npx prisma migrate reset` (⚠️ This will delete all data!)

---

## 📝 File Structure

Your `.env.local` file should look like this:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
SESSION_SECRET="your-secret-here"
EMAIL_API_KEY="re_your_key_here"
EMAIL_FROM="no-reply@sweetb.co"
```

**Important:** 
- `.env.local` is in `.gitignore` - it won't be committed to git
- Never commit your actual connection strings or API keys
- Use different values for development vs production

---

## 🎯 Next Steps

After local setup is complete:

1. Test your app locally
2. Make sure migrations and seeding worked
3. Test login functionality
4. Then deploy to Vercel (which will use its own environment variables)



