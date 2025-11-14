# 🔧 Fix Mobile Sign-In on Netlify

## Problem
Google Sign-In fails on mobile with error: "Failed to sign in. Please try again."

## Root Cause
Your Netlify domain is not authorized in Firebase Authentication settings.

---

## ✅ Solution: Authorize Your Netlify Domain in Firebase

### Step 1: Get Your Netlify URL
1. Go to your Netlify dashboard
2. Find your site URL (e.g., `your-app-name.netlify.app`)
3. Copy the full domain

### Step 2: Add Domain to Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **job-drive-10358**
3. Click **Authentication** in the left sidebar
4. Click **Settings** tab at the top
5. Scroll down to **Authorized domains** section
6. Click **Add domain** button
7. Paste your Netlify domain (e.g., `your-app-name.netlify.app`)
8. Click **Add**

### Step 3: Also Add These Domains (if needed)
- `localhost` (already added by default)
- `job-drive-10358.firebaseapp.com` (already added by default)
- Your custom domain (if you have one)

---

## 🚀 After Adding Domain

1. Wait 1-2 minutes for Firebase to update
2. Clear your mobile browser cache
3. Try signing in again on mobile
4. It should work perfectly! ✨

---

## 🆘 Alternative: Emergency Login

If you need immediate access while waiting for domain authorization:

1. Click **⚠️ Emergency Login** button
2. Enter password: **ROOT**
3. Works on all devices immediately!

---

## 📱 How to Test Mobile Sign-In

1. Open your Netlify URL on your phone
2. Click "Sign in with Google"
3. Should redirect to Google account selection
4. Select your account
5. Should redirect back and show your profile
6. Enter your name and proceed!

---

## 🐛 Still Having Issues?

Open browser console (Chrome mobile: `chrome://inspect`) and check for:
- `auth/unauthorized-domain` error → Add domain to Firebase
- `auth/network-request-failed` → Check internet connection
- `auth/operation-not-allowed` → Enable Google sign-in in Firebase

---

## 📋 Quick Checklist

- [ ] Netlify domain added to Firebase authorized domains
- [ ] Waited 1-2 minutes for Firebase to update
- [ ] Cleared mobile browser cache
- [ ] Tested on mobile device
- [ ] Google Sign-In working ✓

---

## 💡 Pro Tips

1. **Always test on actual mobile device** (not just mobile emulator)
2. **Use Emergency Login** as backup when Google fails
3. **Check Firebase Console** for any security alerts
4. **Enable billing** in Firebase if you have high traffic

---

## 🎯 Current Configuration

**Firebase Project:** job-drive-10358  
**Default Domains:**
- localhost
- job-drive-10358.firebaseapp.com

**Need to Add:**
- Your Netlify domain: `[YOUR_APP].netlify.app`

---

**Last Updated:** November 15, 2025
