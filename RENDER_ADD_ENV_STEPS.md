# Step-by-Step: Adding Environment Variables on Render

## 📍 Step 1: Log into Render Dashboard

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Log in with your Render account

---

## 📍 Step 2: Navigate to Your Web Service

1. You should see your **Dashboard** with a list of services
2. Find your **Web Service** (the one you're deploying SweetB to)
3. **Click on the service name** to open it

---

## 📍 Step 3: Open Environment Tab

1. In your service page, look at the top navigation tabs:
   - Overview
   - **Environment** ← Click this one
   - Logs
   - Events
   - Settings
   - etc.

2. **Click on "Environment"** tab

---

## 📍 Step 4: Add Environment Variables

You'll see a section with environment variables. There are two ways to add them:

### Option A: Using the Form (Easier)

1. Look for a section that says **"Environment Variables"** or **"Add Environment Variable"**
2. You'll see fields like:
   - **Key** (variable name)
   - **Value** (variable value)

3. For each variable, click **"Add Environment Variable"** or **"+"** button

### Option B: Using the Editor (Faster for multiple)

1. Look for a button that says **"Edit as JSON"** or **"Bulk Edit"**
2. Click it to open a text editor
3. Paste all variables at once (see format below)

---

## 📍 Step 5: Add Each Variable

Add these one by one (or all at once if using JSON editor):

### Variable 1: SESSION_SECRET
- **Key:** `SESSION_SECRET`
- **Value:** `i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ=`
- Click **"Save"** or **"Add"**

### Variable 2: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Get this from your PostgreSQL database:
  1. Go back to Render Dashboard
  2. Find your **PostgreSQL** database service
  3. Click on it
  4. Go to **"Info"** or **"Connections"** tab
  5. Copy the **"Internal Database URL"** (if web service is on Render)
     OR **"External Database URL"** (if connecting from outside)
  6. Paste it as the **Value**
- Click **"Save"** or **"Add"**

### Variable 3: EMAIL_API_KEY
- **Key:** `EMAIL_API_KEY`
- **Value:** Your Resend API key:
  1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
  2. Log in to Resend
  3. Click **"Create API Key"** (or use existing one)
  4. Copy the API key (starts with `re_`)
  5. Paste it as the **Value**
- Click **"Save"** or **"Add"**

### Variable 4: EMAIL_FROM (Optional but Recommended)
- **Key:** `EMAIL_FROM`
- **Value:** `no-reply@sweetb.co` (or your verified domain email)
- Click **"Save"** or **"Add"**

---

## 📍 Step 6: Save All Changes

1. After adding all variables, look for a **"Save Changes"** or **"Save"** button
2. Click it to save all environment variables
3. Render will automatically restart your service with the new variables

---

## 📍 Step 7: Verify Variables Are Added

1. Scroll through the environment variables list
2. You should see:
   - ✅ `SESSION_SECRET`
   - ✅ `DATABASE_URL`
   - ✅ `EMAIL_API_KEY`
   - ✅ `EMAIL_FROM` (if added)

---

## 📍 Step 8: Check Service Status

1. Go to the **"Logs"** tab
2. Watch for the service to restart
3. You should see build logs and then runtime logs
4. If you see errors, check that all variables are correctly set

---

## 📍 Step 9: Run Database Migrations (Important!)

After the service is running:

1. Go to your service page
2. Click on **"Shell"** tab (or look for a terminal/console option)
3. In the shell, run:
   ```bash
   npx prisma migrate deploy
   ```
4. Then run:
   ```bash
   npm run db:seed
   ```
5. This will set up your database tables and create the admin user

---

## 🎯 Quick Reference: All Variables at Once

If using JSON/Bulk Edit mode, paste this (replace values):

```json
{
  "SESSION_SECRET": "i+gFgV0xxXdlz7JmHDg/Eb8UJp3gVYa0VDHBbqlTdgQ=",
  "DATABASE_URL": "postgresql://user:password@hostname:5432/database",
  "EMAIL_API_KEY": "re_your_resend_api_key_here",
  "EMAIL_FROM": "no-reply@sweetb.co"
}
```

---

## ⚠️ Common Issues

**"Can't find Environment tab":**
- Make sure you're in your **Web Service**, not the database service
- Look for tabs at the top of the page

**"Service won't start after adding variables":**
- Check for typos in variable names (case-sensitive!)
- Ensure `DATABASE_URL` is correct
- Check the Logs tab for error messages

**"Database connection fails":**
- Use **Internal Database URL** if both services are on Render
- Ensure database is running (check database service status)
- Verify the connection string format is correct

**"Email not sending":**
- Verify `EMAIL_API_KEY` is correct (starts with `re_`)
- Check Resend dashboard to ensure API key is active
- Verify `EMAIL_FROM` domain is verified in Resend

---

## ✅ Success Checklist

- [ ] All 3-4 environment variables added
- [ ] Variables saved successfully
- [ ] Service restarted automatically
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Service is running (check status is "Live")
- [ ] No errors in logs

---

## 🆘 Need Help?

If you get stuck:
1. Check the **Logs** tab for specific error messages
2. Verify each variable name is exactly as shown (case-sensitive)
3. Make sure there are no extra spaces in variable values
4. Try removing and re-adding variables if they seem incorrect



