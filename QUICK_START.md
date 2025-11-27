# ⚡ SweetB CRM - Quick Start

## 🚀 5-Minute Setup

```bash
# 1. Install
npm install
npm install tailwindcss-animate

# 2. Setup Database
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# 3. Configure (create .env.local)
echo 'DATABASE_URL="file:./dev.db"' > .env.local
echo 'EMAIL_PROVIDER="resend"' >> .env.local
echo 'EMAIL_FROM="no-reply@sweetb.co"' >> .env.local
echo 'EMAIL_API_KEY="re_123_YOUR_KEY"' >> .env.local
echo 'SESSION_SECRET="dev-secret-change-in-production"' >> .env.local
echo 'VERIFIER_URL="https://verifier.example.com"' >> .env.local
echo 'VERIFIER_API_KEY="key123"' >> .env.local
echo 'GIFT_THRESHOLD="10"' >> .env.local

# 4. Run
npm run dev
```

## 🔑 Default Access

**Admin Login:**
- Email: `admin@sweetb.co`
- Go to: http://localhost:3000/login
- Check terminal for OTP in dev mode

**User Registration:**
- Go to: http://localhost:3000/login
- Enter any email
- Create account automatically

## 📍 Key URLs

| Page | URL | Who Can Access |
|------|-----|----------------|
| Homepage | `/` | Everyone |
| Login/Register | `/login` | Everyone |
| User Account | `/account` | Logged-in users |
| Verify Code | `/verify` | Logged-in users |
| Lucky Draw | `/lucky-draw` | Everyone (if enabled) |
| Admin Dashboard | `/admin` | Admins only |
| User Management | `/admin/users` | Admins only |
| Redemptions | `/admin/redemptions` | Admins only |
| Feature Flags | `/admin/flags` | Admins only |
| Draw Management | `/admin/draws` | Admins only |

## 🎯 Common Tasks

### Enable Lucky Draw
1. Login as admin
2. Go to `/admin/flags`
3. Toggle `lucky_draw_enabled` ON
4. Go to `/admin/draws`
5. Create new draw
6. Click "Open" to accept entries
7. Users can now enter at `/lucky-draw`

### Approve Gift Redemption
1. Login as admin
2. Go to `/admin/redemptions`
3. Filter by "PENDING"
4. Click "Approve" on request
5. Click "Mark Shipped" when sent
6. User sees updated status in `/account`

### Manually Adjust User Purchases
1. Login as admin
2. Go to `/admin/users`
3. Find user (or search by email)
4. Click "Adjust Sales"
5. Enter delta (e.g., +5 or -2)
6. Enter reason
7. Confirm → audit log created

## 🐛 Troubleshooting

**"Database not found"**
```bash
npx prisma migrate dev --name init
```

**"Admin not found"**
```bash
npm run db:seed
```

**"Email not sending"**
- Check `EMAIL_API_KEY` in `.env.local`
- Get key from https://resend.com
- In dev, OTP is logged to terminal

**"Unauthorized"**
- Go to `/login` and sign in
- Session cookies may have expired (7 days)

**"Verifier failed"**
- In development mode, all codes are valid
- Check `VERIFIER_URL` and `VERIFIER_API_KEY` for production

## 📊 Database Tools

```bash
# Browse data visually
npx prisma studio

# View database in browser
# Opens at http://localhost:5555

# Reset everything (WARNING: deletes all data)
npx prisma migrate reset

# Export data
npx prisma db pull
```

## 🎨 Pages Built

**Marketing (Original):**
- ✅ Homepage with hero, ingredients, safety
- ✅ Benefits page (expanded)
- ✅ About Us (brand story)
- ✅ Contact Us (Linktree style)

**CRM (New):**
- ✅ Login/Register
- ✅ User Account Dashboard
- ✅ Purchase Verification
- ✅ Lucky Draw Entry
- ✅ Admin Dashboard
- ✅ User Management
- ✅ Redemption Management
- ✅ Feature Flags
- ✅ Draw Management

## 💪 You're Ready!

Everything is built and ready to use. Just run `npm run dev` and start testing!

For detailed docs, see:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Step-by-step setup
- `CRM_IMPLEMENTATION_COMPLETE.md` - Feature list

