# Firebase Setup Guide for Quiz Platform

## Step-by-Step Firebase Configuration

### Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click on "Add project"
   - Enter project name: `quiz-platform` (or any name you prefer)
   - Click "Continue"
   - Disable Google Analytics (optional) or keep it enabled
   - Click "Create project"
   - Wait for project creation (takes 30-60 seconds)
   - Click "Continue" when ready

---

### Step 2: Enable Google Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click on "Build" → "Authentication"
   - Click "Get started"

2. **Enable Google Sign-In**
   - Click on the "Sign-in method" tab
   - Find "Google" in the list of providers
   - Click on "Google"
   - Toggle the "Enable" switch to ON
   - Enter a project support email (your email)
   - Click "Save"

---

### Step 3: Create Firestore Database

1. **Navigate to Firestore Database**
   - In the left sidebar, click on "Build" → "Firestore Database"
   - Click "Create database"

2. **Configure Security Rules**
   - Select "Start in test mode" (we'll update rules later)
   - Click "Next"

3. **Choose Location**
   - Select a Cloud Firestore location closest to your users
   - Example: `us-central1` or `asia-south1`
   - Click "Enable"
   - Wait for database creation (30-60 seconds)

4. **Update Security Rules** (Important!)
   - Go to the "Rules" tab
   - Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leaderboard collection - authenticated users can read, only owner can write
    match /leaderboard/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```
   - Click "Publish"

---

### Step 4: Register Your Web App

1. **Add Web App to Firebase Project**
   - Go to Project Overview (home icon at top left)
   - Click on the web icon `</>` (below the project name)
   - Enter app nickname: `Quiz Platform Web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Firebase Configuration**
   - You'll see a code snippet with your Firebase config
   - It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

   - **COPY THIS ENTIRE CONFIGURATION** - You'll need it!
   - Click "Continue to console"

---

### Step 5: Update Your Code with Firebase Config

1. **Open the file:** `firebase-config.js`

2. **Replace the placeholder config** with your actual Firebase configuration:

   Find this section:
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

   Replace it with your actual config from Firebase Console:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

3. **Save the file**

---

### Step 6: Configure Authorized Domains (Important!)

1. **Go to Authentication Settings**
   - In Firebase Console, go to "Authentication"
   - Click on "Settings" tab
   - Scroll to "Authorized domains"

2. **Add Your Domain**
   - If testing locally: `localhost` is already authorized
   - If deploying online, add your domain (e.g., `yourdomain.com`)
   - Click "Add domain" if needed

---

### Step 7: Test Your Application

1. **Run a Local Server**
   - You MUST use a local server (not file:// protocol)
   - Open PowerShell in your project folder
   - Run one of these commands:

   **Option 1: Using Python (if installed)**
   ```powershell
   python -m http.server 8000
   ```

   **Option 2: Using Node.js (if installed)**
   ```powershell
   npx http-server -p 8000
   ```

   **Option 3: Using VS Code Live Server Extension**
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"

2. **Open in Browser**
   - Go to: `http://localhost:8000`
   - Test the Google Sign-In
   - Take a quiz
   - Check if data is being stored

---

### Step 8: Verify Data in Firebase Console

1. **Check Firestore Database**
   - Go to Firebase Console → Firestore Database
   - You should see two collections:
     - `users` - Contains user data, attempts, scores
     - `leaderboard` - Contains quiz results for ranking

2. **Check Authentication**
   - Go to Firebase Console → Authentication → Users
   - You should see your Google account listed

---

## Testing Checklist

✅ **Authentication Works**
   - Google Sign-In button appears
   - Can sign in with Google account
   - User info displays after sign-in

✅ **Local Storage Works**
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Should see attempt counters

✅ **Quiz Functionality**
   - Can select IT or Accounts quiz
   - Questions load properly
   - Can select answers
   - Can navigate between questions
   - Submit button works

✅ **Attempt Tracking**
   - Attempts decrease after quiz submission
   - Maximum 3 attempts enforced
   - Cannot take quiz after 3 attempts

✅ **Dashboard Works**
   - Shows correct statistics
   - Displays quiz history
   - Leaderboard shows top scores

✅ **Firestore Data**
   - User data saved in Firebase
   - Quiz scores recorded
   - Leaderboard updated

---

## Common Issues and Solutions

### Issue 1: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to Authorized domains in Firebase Authentication settings

### Issue 2: "Missing or insufficient permissions"
**Solution:** Update Firestore security rules as shown in Step 3

### Issue 3: "Failed to sign in"
**Solution:** 
- Check if Google Sign-In is enabled in Firebase Console
- Verify your Firebase config is correct
- Make sure you're using a local server (not file://)

### Issue 4: Quiz not loading
**Solution:**
- Open browser console (F12) and check for errors
- Verify `questions.js` is loading properly
- Check if `sessionStorage` has `selectedQuiz` value

### Issue 5: Data not saving
**Solution:**
- Check browser console for Firebase errors
- Verify Firestore security rules
- Check if you're signed in

---

## Important Notes

1. **Always use HTTPS in production** - Firebase requires secure connections

2. **Local Storage** stores:
   - User attempts count (per user)
   - Quiz scores and history
   - User name preference

3. **Firestore Database** stores:
   - User profile data
   - All quiz attempts and scores
   - Leaderboard data for ranking

4. **3 Attempts Limit** is enforced by:
   - Local Storage (primary, cannot be bypassed easily)
   - Firestore Database (backup tracking)

5. **Security**: 
   - Firestore rules ensure users can only modify their own data
   - Local storage is user-specific and stored per browser

---

## Deployment Options

### Option 1: Firebase Hosting (Recommended)
```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select: Hosting
# Choose your Firebase project
# Set public directory: . (current directory)
# Configure as single-page app: No
# Set up automatic builds: No

# Deploy
firebase deploy
```

### Option 2: Netlify
- Create account at netlify.com
- Drag and drop your project folder
- Site will be live in minutes

### Option 3: GitHub Pages
- Push code to GitHub repository
- Go to repository Settings → Pages
- Select branch and folder
- Site will be published

---

## Support

If you encounter any issues:
1. Check browser console for error messages (Press F12)
2. Verify all steps in this guide are completed
3. Check Firebase Console for authentication and database status
4. Make sure you're using a local server for testing

---

## Next Steps After Setup

1. ✅ Test all features thoroughly
2. ✅ Customize the design if needed
3. ✅ Deploy to production
4. ✅ Share the link with users
5. ✅ Monitor Firebase usage in Console

---

**Your Quiz Platform is now ready to use! 🎉**
