# SweetB CRM Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.local.example` to `.env.local` and update:
- `EMAIL_API_KEY` - Get from Resend.com
- `SESSION_SECRET` - Generate long random string
- `VERIFIER_URL` and `VERIFIER_API_KEY` - Your third-party verifier

### 3. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed admin user and feature flags
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### 5. Login as Admin
1. Go to `/login`
2. Enter: `admin@sweetb.co`
3. Check your email for the OTP code (or terminal in dev mode)
4. Enter the 6-digit code
5. You'll be redirected to `/admin` dashboard

### 6. Create a User Account
1. Go to `/login`
2. Enter any email and optional name
3. Check email for OTP code
4. Enter code to create account and sign in
5. You'll be redirected to `/account` (needs to be created)

## 📁 What's Been Built

### ✅ Core Infrastructure
- Prisma schema with all models
- Database utilities (`lib/db.ts`)
- Authentication system (`lib/auth.ts`) - JWT sessions
- Email system (`lib/email.ts`) - Resend integration
- Crypto utilities (`lib/crypto.ts`) - OTP & code hashing
- Tailwind + shadcn/ui setup

### ✅ API Routes (Complete)
- `POST /api/auth/request-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP & create session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Destroy session
- `POST /api/verify/forward` - Verify purchase codes

### ✅ Database Seed
- Admin user: `admin@sweetb.co`
- Feature flags: `lucky_draw_enabled`, `random_draw_enabled`

## 🔨 What Still Needs Building

### Priority 1: User-Facing Pages

#### 1. Login Page (`app/login/page.tsx`)
```tsx
// Form with email input
// Call POST /api/auth/request-otp
// Show OTP input field
// Call POST /api/auth/verify-otp
// Redirect to /account or /admin based on role
```

#### 2. Account Page (`app/account/page.tsx`)
```tsx
// Show user.totalPurchases, totalGifts
// Progress bar to next gift (threshold from env)
// "Redeem Gift" button if eligible
// Purchase history table
// Call GET /api/auth/me for user data
```

#### 3. Verify Page (`app/verify/page.tsx`)
```tsx
// Input or camera for code
// Call POST /api/verify/forward
// Show result: Valid (green), Already Used, Invalid (red)
```

### Priority 2: Gift Redemption API

#### `app/api/redeem/route.ts`
```typescript
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Check: floor(totalPurchases / threshold) > totalGifts
// Create Redemption with status PENDING
// Return { status: "PENDING" }
```

### Priority 3: Admin Dashboard

#### `app/admin/page.tsx`
```tsx
// Metrics cards:
// - Total users
// - Total purchases (verified codes)
// - Pending redemptions
// - Active draws
// Use GET requests to fetch data
```

#### `app/admin/users/page.tsx`
```tsx
// Table of all users
// Search by email
// Show totalPurchases, totalGifts
// "Adjust Sales" button -> modal
```

#### `app/admin/redemptions/page.tsx`
```tsx
// Table of redemptions by status
// Actions: Approve, Ship, Reject
// Call POST /api/admin/redemptions/[id]/status
```

#### `app/admin/flags/page.tsx`
```tsx
// Toggle switches for feature flags
// Call POST /api/admin/flags
```

### Priority 4: Admin APIs

#### `app/api/admin/users/[id]/adjust-sales/route.ts`
```typescript
// requireAdmin()
// Update user.totalPurchases += delta
// Create AuditLog
```

#### `app/api/admin/redemptions/[id]/status/route.ts`
```typescript
// requireAdmin()
// Update redemption.status
// Create AuditLog
```

#### `app/api/admin/flags/route.ts`
```typescript
// requireAdmin()
// Update FeatureFlag.enabled
```

### Priority 5: Lucky Draw (Optional)

#### `app/lucky-draw/page.tsx`
```tsx
// Check if lucky_draw_enabled
// Show active draw (status=OPEN)
// "Enter Draw" button
```

#### `app/api/draws/[id]/enter/route.ts`
```typescript
// requireAuth()
// Create LuckyDrawEntry
```

#### Admin Draw Management
- `POST /api/admin/draws` - Create draw
- `POST /api/admin/draws/[id]/open` - Open draw
- `POST /api/admin/draws/[id]/close` - Close draw
- `POST /api/admin/draws/[id]/draw` - Pick winners

## 🎨 UI Components Needed

Create these in `components/ui/`:
- `button.tsx` - Primary/secondary/outline variants
- `input.tsx` - Text input with label
- `card.tsx` - Container with border
- `table.tsx` - Data table
- `badge.tsx` - Status badges
- `dialog.tsx` - Modal/dialog
- `toast.tsx` - Notifications

Use SweetB colors:
- Black: `#0A0A0A`
- Gold: `#C9A86A`
- White: `#F8F8F8`
- Gray: `#B8B8B8`

## 🔐 Security Checklist

- [x] OTP hashing with bcrypt
- [x] Code hashing with SHA-256
- [x] HTTP-only session cookies
- [x] JWT token signing
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection
- [ ] Input validation with Zod
- [ ] SQL injection prevention (Prisma handles this)

## 🧪 Testing

```bash
# 1. Test OTP Flow
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Check terminal for OTP code

curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# 2. Test Verification (after login)
curl -X POST http://localhost:3000/api/verify/forward \
  -H "Content-Type: application/json" \
  -H "Cookie: sweetb_session=YOUR_SESSION_TOKEN" \
  -d '{"code":"ABC123XYZ"}'
```

## 📊 Database Schema

- **User** - Email, role, purchase/gift counts
- **EmailOtp** - Temporary OTP storage
- **Purchase** - Verified codes (hashed)
- **Redemption** - Gift requests
- **FeatureFlag** - Toggle features
- **LuckyDraw** - Draw campaigns
- **LuckyDrawEntry** - User entries
- **LuckyDrawWinner** - Draw results
- **AuditLog** - Admin actions

## 🚢 Production Deployment

1. Update `DATABASE_URL` to Postgres connection string
2. Set all environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm run start`

## 📝 Notes

- In development, verification accepts any code
- OTP codes expire after 10 minutes
- Gift threshold is configurable via env
- All purchase codes are hashed before storage
- Admin user is seeded automatically

