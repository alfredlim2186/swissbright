# 🗄️ Database Setup Guide

## Quick Fix: Missing DATABASE_URL Error

You're getting this error because the `DATABASE_URL` environment variable is not set. Here's how to fix it:

## Option 1: Use Neon (Free PostgreSQL - Recommended)

1. **Sign up at [Neon](https://neon.tech)** (free tier available)
2. **Create a new project**
3. **Copy your connection string** - it looks like:
   ```
   postgresql://user:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. **Create `.env.local` file** in your project root:
   ```env
   DATABASE_URL="your-neon-connection-string-here"
   SESSION_SECRET="i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ="
   ```

## Option 2: Use Supabase (Free PostgreSQL)

1. **Sign up at [Supabase](https://supabase.com)** (free tier available)
2. **Create a new project**
3. **Go to Settings → Database**
4. **Copy the connection string** (use the "Connection string" tab)
5. **Create `.env.local` file** in your project root:
   ```env
   DATABASE_URL="your-supabase-connection-string-here"
   SESSION_SECRET="i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ="
   ```

## Option 3: Use Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/swissbright?sslmode=disable"
SESSION_SECRET="i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ="
```

## Step-by-Step Setup

### 1. Create `.env.local` File

Create a file named `.env.local` in your project root (same folder as `package.json`):

```env
DATABASE_URL="postgresql://user:password@hostname:5432/database?sslmode=require"
SESSION_SECRET="i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ="
EMAIL_API_KEY="re_your_key_here"
EMAIL_FROM="no-reply@swissbright.com"
```

### 2. Run Database Migrations

After setting `DATABASE_URL`, run:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# Or create a new migration
npx prisma migrate dev --name init
```

### 3. Seed the Database

Create the admin user:

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@swissbright.com`
- Feature flags
- SEO settings

### 4. Restart Your Dev Server

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## ✅ Verify It Works

After setup, you should be able to:

1. ✅ Run `npx prisma migrate deploy` without errors
2. ✅ Run `npm run db:seed` successfully  
3. ✅ Login at `/adminlogin` with:
   - Username: `Admin`
   - Password: `Admin8899!`

## 🔍 Troubleshooting

### "Environment variable not found: DATABASE_URL"
- ✅ Make sure `.env.local` exists in project root
- ✅ Check spelling: `DATABASE_URL` (case-sensitive)
- ✅ Make sure connection string is in quotes: `DATABASE_URL="..."`
- ✅ Restart your dev server after creating `.env.local`

### "Connection refused" or database errors
- ✅ Verify your connection string is correct
- ✅ Check that your database is running (Neon/Supabase dashboard)
- ✅ Make sure connection string includes `?sslmode=require` (for cloud databases)

### "Prisma Client not generated"
- ✅ Run `npx prisma generate` first
- ✅ Make sure `DATABASE_URL` is set before running generate

## 📝 Example `.env.local` File

```env
# Required: Database Connection
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Required: Session Secret (for JWT)
SESSION_SECRET="i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ="

# Optional: Email (for OTP codes)
EMAIL_API_KEY="re_your_resend_key"
EMAIL_FROM="no-reply@swissbright.com"

# Optional: Admin Login
ADMIN_BASIC_USERNAME="Admin"
ADMIN_BASIC_PASSWORD="Admin8899!"

# Development Only
NODE_ENV="development"
ALLOW_DEV_BYPASS="true"
```

## 🚀 Quick Start (Neon)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up/login
3. Create new project
4. Copy connection string
5. Create `.env.local` with `DATABASE_URL="your-string"`
6. Run `npx prisma migrate deploy`
7. Run `npm run db:seed`
8. Restart dev server

That's it! 🎉

