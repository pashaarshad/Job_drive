# 🚀 START HERE - Quick Setup Guide

## 👋 Welcome to Your Quiz Platform!

Everything is **ready to go**! Just follow these simple steps.

---

## ✅ STEP 1: Set Up Firebase (15 minutes)

### 1.1 Create Firebase Project
1. Visit: **https://console.firebase.google.com/**
2. Click **"Add project"**
3. Name it: `quiz-platform`
4. Click through the setup (disable Analytics if you want)
5. Wait for creation → Click **"Continue"**

### 1.2 Enable Google Sign-In
1. Click **"Authentication"** in left menu
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Find **"Google"** → Click it
5. Toggle **"Enable"** to ON
6. Add your email as support email
7. Click **"Save"**

### 1.3 Create Database
1. Click **"Firestore Database"** in left menu
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Click **"Next"**
5. Choose location (e.g., `us-central1`)
6. Click **"Enable"**
7. Wait for creation

### 1.4 Update Security Rules
1. Click **"Rules"** tab in Firestore
2. Copy this and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /leaderboard/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### 1.5 Register Web App
1. Go back to **Project Overview** (home icon)
2. Click the **web icon `</>`** 
3. App nickname: `Quiz Platform`
4. Click **"Register app"**
5. **COPY the firebaseConfig object** - You'll need this!
6. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abc123"
};
```

---

## ✅ STEP 2: Update Your Code (2 minutes)

### 2.1 Open firebase-config.js
1. Find the file in your project folder
2. Look for this section:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2.2 Replace with Your Config
1. **PASTE your actual Firebase config** from Step 1.5
2. Make sure you replace ALL the values
3. **Save the file**

---

## ✅ STEP 3: Run Locally (3 minutes)

### Option 1: Using Python (if installed)
1. Open **PowerShell** or **Command Prompt**
2. Navigate to project folder:
   ```powershell
   cd "C:\Users\Admin\Desktop\CodePlay\Job_drive"
   ```
3. Run:
   ```powershell
   python -m http.server 8000
   ```
4. Keep the window open!

### Option 2: Using VS Code (easiest)
1. Open project folder in **VS Code**
2. Install **"Live Server"** extension
3. Right-click on `index.html`
4. Select **"Open with Live Server"**

### Option 3: Using Node.js (if installed)
1. Open **PowerShell** in project folder
2. Run:
   ```powershell
   npx http-server -p 8000
   ```

---

## ✅ STEP 4: Test Everything (5 minutes)

1. **Open browser** and go to: `http://localhost:8000`

2. **Test Sign-In:**
   - Click "Start Quiz"
   - Click "Sign in with Google"
   - Select your Google account
   - Enter your name
   - Click "Proceed"

3. **Test Quiz:**
   - Select "IT Quiz" or "Accountancy Quiz"
   - Answer a few questions
   - Navigate using Previous/Next
   - Try the question palette
   - Submit the quiz

4. **Check Dashboard:**
   - View your score
   - Check remaining attempts (should be 2)
   - See leaderboard

5. **Test Attempts:**
   - Take 2 more quizzes
   - After 3rd attempt, should show "No attempts remaining"

---

## 🎉 YOU'RE DONE!

If everything above works, your platform is **ready to use**!

---

## 📊 What You've Built

✅ Landing page with company info
✅ Google authentication
✅ IT Quiz (40 Java questions)
✅ Accountancy Quiz (40 questions)
✅ 3-attempt limit system
✅ Results page with scores
✅ Dashboard with statistics
✅ Leaderboard with rankings
✅ Local storage + Firebase sync
✅ Beautiful responsive design

---

## 🚀 Deploy Online (Optional)

### Firebase Hosting
```powershell
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Netlify (Easiest!)
1. Go to: **netlify.com**
2. Sign up for free
3. Drag and drop your project folder
4. Done! Your site is live!

---

## 🆘 Need Help?

### Can't sign in?
- Make sure Google Auth is enabled in Firebase
- Check you're using a local server (not file://)
- Verify firebase-config.js has correct values

### Quiz not loading?
- Open browser console (Press **F12**)
- Check for error messages
- Verify all files are in the folder

### Data not saving?
- Check Firestore security rules are updated
- Make sure you're signed in
- Check internet connection

---

## 📚 More Documentation

- **FIREBASE_SETUP_GUIDE.md** - Detailed Firebase setup
- **QUICK_START_CHECKLIST.md** - Complete testing checklist  
- **PROJECT_SUMMARY.md** - Everything about the project
- **README.md** - Project overview and features

---

## ⏱️ Time Breakdown

- Firebase Setup: ~15 minutes
- Update Config: ~2 minutes
- Run & Test: ~5 minutes
- **Total: ~22 minutes**

---

## 🎯 Your Next Action

**RIGHT NOW:**
1. Open this link: **https://console.firebase.google.com/**
2. Follow Step 1 above
3. Come back and do Step 2
4. You're done!

---

**Good luck! Your quiz platform is awesome! 🎉**

*Questions? Check the other documentation files!*
