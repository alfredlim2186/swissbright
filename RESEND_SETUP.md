# Resend Email Integration Setup

## ✅ Quick Setup

### 1. Create/Update .env.local

Create a file named `.env.local` in the root directory with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Email Configuration - RESEND
EMAIL_PROVIDER="resend"
EMAIL_FROM="no-reply@sweetb.co"
EMAIL_API_KEY="re_Q1dEnkSK_2Zb3RMXpYTqvDnURr4vT58LZ"

# Authentication
SESSION_SECRET="sweetb-dev-secret-please-change-in-production-use-long-random-string"

# Third-party Verification (for development, codes auto-validate)
VERIFIER_URL="https://thirdparty.example.com/verify"
VERIFIER_API_KEY="verifier_key_replace_me"

# Gift System
GIFT_THRESHOLD="10"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Configure Resend Domain (Important!)

For Resend to work properly, you need to:

**Option A: Use Resend Test Domain (Quick)**
- Resend provides a test domain for development
- Update `EMAIL_FROM` to match: `onboarding@resend.dev`
- This works immediately, no setup needed

**Option B: Use Your Own Domain (Production)**
1. Go to https://resend.com/domains
2. Add your domain (e.g., sweetb.co)
3. Add DNS records as shown
4. Wait for verification
5. Use `no-reply@sweetb.co` or any address from your verified domain

### 3. Update EMAIL_FROM

Edit your `.env.local`:

**For Testing (works immediately):**
```env
EMAIL_FROM="onboarding@resend.dev"
```

**For Production (after domain verification):**
```env
EMAIL_FROM="no-reply@sweetb.co"
```

### 4. Restart Development Server

```bash
# Kill current server (Ctrl+C)
npm run dev
```

## 🧪 Test Email Flow

### Test OTP Email:

1. Go to http://localhost:3000/login
2. Enter your email address
3. Click "Send Verification Code"
4. Check your email inbox
5. You should receive a beautiful branded email with:
   - SweetB logo (Sweet in gold, B with glow)
   - 6-digit code in gold box
   - 10-minute expiry message
   - Black/gold styling matching the brand

### If Email Doesn't Arrive:

**Check 1: Spam Folder**
- Resend test emails may go to spam

**Check 2: Terminal/Console**
- Check for error messages in your terminal
- Look for "Email send error:"

**Check 3: Resend Dashboard**
- Go to https://resend.com/emails
- Check if email appears in logs
- View delivery status

**Check 4: API Key**
- Verify key is correct in `.env.local`
- No extra spaces or quotes
- Restart server after changing

## 📧 Email Template

The OTP email includes:
- SweetB logo (gold "Sweet" + glowing white "B")
- Black background (#0A0A0A)
- Gold accent colors (#C9A86A)
- Large, centered 6-digit code
- Expiry information
- Brand footer

Preview available at: `lib/email.ts` → `generateOtpEmail()` function

## 🔧 Troubleshooting

### Error: "Email send error"
```bash
# Check your terminal for detailed error
# Common issues:
# - Invalid API key
# - Email FROM address not verified
# - Domain not configured
```

**Solution:**
Use Resend test domain:
```env
EMAIL_FROM="onboarding@resend.dev"
```

### Error: "Domain not verified"
- Go to https://resend.com/domains
- Use the test domain `onboarding@resend.dev`
- Or add your domain and verify DNS

### Email Sent But Not Received
- Check spam folder
- Verify email address is correct
- Check Resend dashboard logs
- Some email providers block bulk senders

### Want to See Email Without Sending?
The email template is in `lib/email.ts`:
- HTML with inline styles
- Black/gold SweetB branding
- You can preview by copying HTML to browser

## 🎯 Next Steps

Once email is working:

1. **Test Full Login Flow:**
   - Go to `/login`
   - Enter your email
   - Receive OTP via email
   - Enter code
   - Get redirected to `/account`

2. **Test Admin Access:**
   - Login with `admin@sweetb.co`
   - Receive OTP
   - Access `/admin` dashboard

3. **Test Verification:**
   - Login as user
   - Go to `/verify`
   - Enter any code (in dev, all are valid)
   - See success message
   - Check `/account` - purchases incremented

## 📝 Production Notes

For production deployment:

1. **Use Your Own Domain:**
   - Verify domain in Resend
   - Update `EMAIL_FROM` to your domain

2. **Rate Limits:**
   - Free tier: 100 emails/day
   - Paid tiers: Higher limits
   - Consider rate limiting on `/api/auth/request-otp`

3. **Monitor:**
   - Check Resend dashboard for delivery rates
   - Monitor bounce rates
   - Track spam complaints

## ✅ Checklist

- [ ] Resend API key added to `.env.local`
- [ ] EMAIL_FROM set to `onboarding@resend.dev` (for testing)
- [ ] Server restarted after env changes
- [ ] Tested login flow - received OTP email
- [ ] OTP code works and creates session
- [ ] Ready for full CRM testing!

## 🔗 Resources

- Resend Dashboard: https://resend.com/emails
- Resend Domains: https://resend.com/domains
- Resend Docs: https://resend.com/docs
- API Keys: https://resend.com/api-keys

---

**Your Resend integration is ready to go!** 🚀

Just update `.env.local` with your API key and the `EMAIL_FROM` address, restart the server, and test at `/login`.

