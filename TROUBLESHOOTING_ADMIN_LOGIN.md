# 🔧 Troubleshooting Admin Basic Login

## Issue: "Invalid credentials" error

If you're getting "Invalid credentials" when trying to use the basic login, follow these steps:

## ✅ Step 1: Verify Default Credentials

**Default credentials:**
- **Username:** `Admin` (exact case, no spaces)
- **Password:** `Admin8899!` (exact case, includes exclamation mark)

**Important:**
- Make sure there are no extra spaces before or after
- Username is case-sensitive: `Admin` (capital A, rest lowercase)
- Password includes the exclamation mark at the end

## ✅ Step 2: Check Environment Variables

The credentials can be overridden by environment variables. Check your `.env.local` file:

```env
ADMIN_BASIC_USERNAME=Admin
ADMIN_BASIC_PASSWORD=Admin8899!
```

If these are set differently, use those values instead.

**To check your environment variables:**
1. Look for `.env.local` file in the project root
2. Check if `ADMIN_BASIC_USERNAME` or `ADMIN_BASIC_PASSWORD` are set
3. If they are set, use those values instead of the defaults

## ✅ Step 3: Check Development Console

In development mode, the server will log detailed information. Check your terminal/console where the Next.js server is running. You should see:

```
🔐 Admin login attempt: {
  receivedUsername: 'Admin',
  expectedUsername: 'Admin',
  usernameMatch: true,
  passwordLength: 10,
  expectedPasswordLength: 10,
  passwordMatch: true/false
}
```

This will help you see exactly what's being compared.

## ✅ Step 4: Verify Admin User Exists

The basic login requires an admin user to exist in the database. Make sure you've run the database seed:

```bash
npm run db:seed
```

Or manually check if an admin user exists with:
```bash
npx prisma studio
```

Look for a user with:
- Email: `admin@swissbright.com`
- Role: `ADMIN`

## ✅ Step 5: Try Alternative Login Methods

If basic login still doesn't work, try these alternatives:

### Option A: OTP Login (Recommended)
1. Go to `/login`
2. Enter email: `admin@swissbright.com`
3. Click "Send Verification Code"
4. Check your email or terminal for the OTP code
5. Enter the code and login

### Option B: Development Bypass (Development Only)
1. Go to `/login`
2. Enter email: `admin@swissbright.com`
3. Click "Send Verification Code"
4. Enter: `000000` (six zeros)
5. **Note:** Requires `ALLOW_DEV_BYPASS=true` in `.env.local`

## 🔍 Common Issues

### Issue: Username field is uppercase
- The CSS makes it look uppercase, but the actual value is `Admin`
- This is just visual styling, the comparison uses the actual value

### Issue: Password has special characters
- The password `Admin8899!` includes an exclamation mark
- Make sure you're typing it exactly: `Admin8899!`

### Issue: Environment variables not loading
- Restart your Next.js development server after changing `.env.local`
- Make sure `.env.local` is in the project root (same level as `package.json`)

### Issue: Admin user doesn't exist
- Run `npm run db:seed` to create the admin user
- Or manually create via Prisma Studio

## 📝 Quick Test

Try this exact sequence:
1. Go to `/adminlogin`
2. Username field should show `Admin` (you can edit it if needed)
3. Type password: `Admin8899!` (watch for typos)
4. Click "Enter Console"
5. Check terminal for debug logs if it fails

## 🆘 Still Not Working?

If you're still having issues:

1. **Check the browser console** for any JavaScript errors
2. **Check the server terminal** for detailed debug logs (in development)
3. **Verify the admin user exists** in the database
4. **Try the OTP login method** as an alternative
5. **Check network tab** in browser dev tools to see the exact request/response

## 💡 Pro Tip

The most common issue is:
- Typo in password (especially the exclamation mark)
- Environment variables overriding defaults
- Admin user not existing in database

Start by checking these three things first!

