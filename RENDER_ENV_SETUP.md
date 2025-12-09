# Render Environment Variables Setup Guide

## 🔐 Required Environment Variables

Add these in your Render service dashboard under **Environment** tab:

### 1. **SESSION_SECRET** (REQUIRED)
```
i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ=
```
**What it does:** Used for encrypting JWT session tokens  
**How to generate:** Use a long random string (32+ characters). The one above was generated securely.

### 2. **DATABASE_URL** (REQUIRED)
```
postgresql://user:password@hostname:5432/database?sslmode=require
```
**What it does:** PostgreSQL connection string for your database  
**How to get:** 
- If you created a PostgreSQL database on Render, go to your database dashboard
- Copy the "Internal Database URL" or "External Database URL"
- Use the Internal URL if your web service is on Render (faster, free)
- Use External URL if connecting from outside Render

### 3. **EMAIL_API_KEY** (REQUIRED)
```
re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**What it does:** Resend.com API key for sending emails (OTP codes, etc.)  
**How to get:** 
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy and paste it here

### 4. **VERIFIER_URL** (OPTIONAL - if using verification service)
```
https://your-verification-service.com/api/verify
```
**What it does:** URL for your third-party product verification service  
**Note:** Only needed if you're using external verification

### 5. **VERIFIER_API_KEY** (OPTIONAL - if using verification service)
```
your-verifier-api-key
```
**What it does:** API key for your verification service  
**Note:** Only needed if you're using external verification

---

## 🔧 Optional Environment Variables

These have defaults but you can customize them:

### **EMAIL_PROVIDER**
```
resend
```
**Default:** `resend`  
**What it does:** Email service provider (currently only Resend is supported)

### **EMAIL_FROM**
```
no-reply@sweetb.co
```
**Default:** `no-reply@sweetb.co`  
**What it does:** The "from" email address for sent emails  
**Note:** Must be verified in your Resend account

### **CRYPTO_SALT**
```
(leave empty to use SESSION_SECRET)
```
**Default:** Uses `SESSION_SECRET` if not set  
**What it does:** Salt for hashing purchase codes and security codes

### **GIFT_THRESHOLD**
```
10
```
**Default:** `10`  
**What it does:** Number of purchases required before a user can redeem a gift

### **ADMIN_BASIC_USERNAME** (Optional - for basic auth)
```
Admin
```
**Default:** `Admin`  
**What it does:** Username for basic authentication (if enabled)

### **ADMIN_BASIC_PASSWORD** (Optional - for basic auth)
```
Admin8899!
```
**Default:** `Admin8899!`  
**What it does:** Password for basic authentication (if enabled)  
**⚠️ WARNING:** Change this in production!

---

## 📋 Quick Setup Checklist

- [ ] Add `SESSION_SECRET` (use the one above or generate your own)
- [ ] Add `DATABASE_URL` (from your Render PostgreSQL database)
- [ ] Add `EMAIL_API_KEY` (from Resend.com)
- [ ] (Optional) Add `VERIFIER_URL` if using verification service
- [ ] (Optional) Add `VERIFIER_API_KEY` if using verification service
- [ ] (Optional) Customize `EMAIL_FROM` if needed
- [ ] (Optional) Set `GIFT_THRESHOLD` if different from 10

---

## 🚀 After Adding Variables

1. **Save** the environment variables in Render dashboard
2. **Redeploy** your service (or it will auto-restart)
3. **Run database migrations:**
   - In Render, go to your service → **Shell**
   - Run: `npx prisma migrate deploy`
   - Run: `npm run db:seed` (to seed admin user)

---

## 🔒 Security Notes

- **Never commit** `.env` files to git (they're already in `.gitignore`)
- **Generate a new SESSION_SECRET** for production (don't reuse the example)
- **Use strong passwords** for database and admin access
- **Rotate secrets** periodically in production
- The `SESSION_SECRET` above is just an example - generate your own for production!

---

## 🆘 Troubleshooting

**Build fails with "SESSION_SECRET required":**
- ✅ Fixed! The code now allows build to proceed without it
- Still add it before the app runs, or it will fail at runtime

**Database connection errors:**
- Check that `DATABASE_URL` is correct
- Ensure database is running on Render
- Use Internal Database URL if both services are on Render

**Email not sending:**
- Verify `EMAIL_API_KEY` is correct
- Check Resend dashboard for API key status
- Ensure `EMAIL_FROM` domain is verified in Resend



