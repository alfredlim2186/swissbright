# 🔑 Swiss Bright Admin Access Guide

## Admin Login Credentials

### Method 1: Basic Login (Admin Console)

**URL:** `/adminlogin`

**Credentials:**
- **Username:** `Admin` (or set via `ADMIN_BASIC_USERNAME` env variable)
- **Password:** `Admin8899!` (or set via `ADMIN_BASIC_PASSWORD` env variable)

**Note:** These credentials are stored in environment variables. Default values are shown above.

---

### Method 2: OTP Login (Standard User Login)

**URL:** `/login`

**Admin Email:** `admin@swissbright.com`

**Steps:**
1. Go to `/login`
2. Enter email: `admin@swissbright.com`
3. Click "Send Verification Code"
4. Check your email for the 6-digit OTP code
5. Enter the code and click "Verify & Sign In"
6. You'll be redirected to `/admin` dashboard

---

### Method 3: Development Bypass (Development Only)

**⚠️ Only works in development mode with bypass enabled**

**URL:** `/login`

**Steps:**
1. Go to `/login`
2. Enter email: `admin@swissbright.com`
3. Click "Send Verification Code"
4. Enter the bypass code: **`000000`** (six zeros)
5. Click "Verify & Sign In"

**Requirements:**
- `NODE_ENV=development`
- `ALLOW_DEV_BYPASS=true` (must be set in environment)
- Only works for `admin@swissbright.com`

**Note:** This bypass is automatically disabled in production.

---

## 🎯 Admin Dashboard Access

Once logged in, you'll have access to:

- **Dashboard** (`/admin`) - Overview of users, orders, redemptions
- **User Management** (`/admin/users`) - Manage users and adjust sales
- **Order Management** (`/admin/orders`) - View and manage orders
- **Redemption Management** (`/admin/redemptions`) - Approve/reject gift redemptions
- **Shop Management** (`/admin/shop`) - Manage products
- **Settings** (`/admin/settings`) - SEO and site configuration
- **Content Management** (`/admin/content`) - Edit site content
- **Media Management** (`/admin/media`) - Upload and manage images
- **Feature Flags** (`/admin/flags`) - Toggle features on/off
- **Lucky Draws** (`/admin/draws`) - Manage lucky draw campaigns
- **Verification Codes** (`/admin/verification-codes`) - Manage product verification codes
- **Analytics** (`/admin/analytics`) - View visitor analytics

---

## 🔒 Security Notes

### Environment Variables

Set these in your `.env.local` file:

```env
# Basic Admin Login (optional - defaults shown)
ADMIN_BASIC_USERNAME=Admin
ADMIN_BASIC_PASSWORD=Admin8899!

# Development Bypass (only for development)
NODE_ENV=development
ALLOW_DEV_BYPASS=true
```

### Production Security

- The development bypass (`000000`) is automatically disabled in production
- In production, admins must use real OTP codes from email
- Consider changing the default admin password via environment variables
- The admin user is created during database seeding with email `admin@swissbright.com`

---

## 📝 Quick Reference

**Basic Login:**
- Username: `Admin`
- Password: `Admin8899!`
- URL: `/adminlogin`

**OTP Login:**
- Email: `admin@swissbright.com`
- Code: Check email (or `000000` in dev with bypass enabled)
- URL: `/login`

**Admin Dashboard:**
- URL: `/admin`

---

## ✅ You're Ready!

**Quick Login (Development):**
1. Go to `/adminlogin`
2. Username: `Admin`
3. Password: `Admin8899!`
4. Click "Enter Console"

Or use OTP login at `/login` with `admin@swissbright.com` 🎉

