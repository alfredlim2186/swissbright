# 🔑 Admin Access Guide

## Quick Admin Login (Development)

### Method 1: Permanent Bypass Code (Easiest)

**For development only**, you can login as admin with a permanent code:

1. Go to http://localhost:3000/login
2. Enter email: `admin@sweetb.co`
3. Click "Send Verification Code"
4. Enter the permanent bypass code: **`000000`** (six zeros)
5. Click "Verify & Sign In"
6. You'll be redirected to `/admin` dashboard ✅

**Note:** This bypass only works:
- In development mode (`NODE_ENV=development`)
- For the admin account only (`admin@sweetb.co`)
- With the code `000000`

### Method 2: Use Real OTP

1. Go to http://localhost:3000/login
2. Enter: `admin@sweetb.co`
3. Click "Send Verification Code"
4. **Check your terminal** for the generated OTP:
   ```
   🔑 Generated OTP for admin@sweetb.co : 123456
   ```
5. Copy that exact code and enter it
6. Login complete!

### Method 3: Check Email

If you have Resend configured:
1. Request OTP for `admin@sweetb.co`
2. Check the email inbox associated with this account
3. Enter the 6-digit code from the email

---

## 🎯 What You Can Do as Admin

Once logged in at `/admin`, you have access to:

### 📊 Dashboard (`/admin`)
- View total users
- View total verified purchases
- View pending redemptions count
- View active lucky draws

### 👥 User Management (`/admin/users`)
- Search users by email/name
- View purchase and gift counts
- **Adjust Sales**: Add or subtract purchases manually
  - Example: Add 10 purchases to a user for testing
  - Example: Remove 2 purchases if mistake
  - All adjustments are logged in audit trail

### 🎁 Redemption Management (`/admin/redemptions`)
- Filter by status: ALL, PENDING, APPROVED, SHIPPED, REJECTED
- **Approve** pending redemptions
- **Mark as Shipped** when sent
- **Reject** if needed
- All actions logged

### ⚙️ Feature Flags (`/admin/flags`)
- Toggle `lucky_draw_enabled` - Enable/disable lucky draw page
- Toggle `random_draw_enabled` - Enable random draw features
- Changes take effect immediately

### 🎲 Lucky Draws (`/admin/draws`)
- **Create** new lucky draws with title, description, winner count
- **Open** draw to accept entries (users can enter on `/lucky-draw`)
- **Close** draw when ready
- **Draw Winners** - Cryptographically secure random selection
- View entries and winners

---

## 🧪 Testing Admin Features

### Test 1: Adjust User Sales
```
1. Login as admin (000000)
2. Go to /admin/users
3. Find a user (or create one via /login)
4. Click "Adjust Sales"
5. Enter delta: 10 (to add 10 purchases)
6. Enter reason: "Testing gift eligibility"
7. Confirm
8. User now has 10 purchases
9. Check /admin - total purchases updated
```

### Test 2: Approve Gift Redemption
```
1. Login as regular user
2. Verify 10 purchase codes (or use admin to adjust sales to 10)
3. Go to /account - see "Redeem Gift" button
4. Click to redeem
5. Logout, login as admin
6. Go to /admin/redemptions
7. See PENDING redemption
8. Click "Approve"
9. Click "Mark Shipped"
10. User can see status updated
```

### Test 3: Run Lucky Draw
```
1. Login as admin
2. Go to /admin/flags
3. Toggle "lucky_draw_enabled" ON
4. Go to /admin/draws
5. Click "Create New Draw"
6. Title: "January Giveaway"
7. Winners: 3
8. Click "Create"
9. Click "Open" to accept entries
10. Login as different users and enter at /lucky-draw
11. Back to admin, click "Close"
12. Click "🎲 Draw Winners"
13. See 3 randomly selected winners
14. Check audit log for transparency
```

---

## 🔒 Security Notes

### Development Bypass Code
- **Code**: `000000` (six zeros)
- **Email**: `admin@sweetb.co` only
- **Environment**: Development only
- **Production**: Automatically disabled

### Production Admin Access
In production, remove or disable the bypass:
1. The bypass is already guarded by `NODE_ENV === 'development'`
2. In production, admin must use real OTP from email
3. Or you can remove the bypass code from `app/api/auth/verify-otp/route.ts`

### Change Admin Email
To use a different admin email:
1. Edit `prisma/seed.ts`
2. Change `admin@sweetb.co` to your email
3. Run `npm run db:seed` again
4. Or manually update in database via `npx prisma studio`

---

## 💡 Quick Commands

```bash
# View database (including admin user)
npx prisma studio

# Reset admin password (regenerate OTP)
# Just request new OTP at /login with admin@sweetb.co

# Check audit logs
# Open Prisma Studio -> AuditLog table

# See all redemptions
# Open Prisma Studio -> Redemption table
```

---

## ✅ You're Ready!

**Login now with:**
- Email: `admin@sweetb.co`
- Code: `000000`

Access the full admin panel at http://localhost:3000/admin 🎉

