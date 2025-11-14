# 🚀 Quick Start Checklist

Follow these steps IN ORDER to set up your quiz platform:

## ✅ Step 1: Verify Files
- [ ] All HTML files present (index, login, quiz-selection, quiz, dashboard, results)
- [ ] All JS files present (app, auth, quiz-selection, quiz, dashboard, firebase-config, questions)
- [ ] CSS file present (styles.css)
- [ ] Documentation files present (README.md, FIREBASE_SETUP_GUIDE.md)

## ✅ Step 2: Firebase Setup (CRITICAL!)

### 2.1: Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Enter project name (e.g., "quiz-platform")
- [ ] Complete project creation

### 2.2: Enable Google Authentication
- [ ] Go to Authentication → Get Started
- [ ] Click "Sign-in method" tab
- [ ] Enable "Google" provider
- [ ] Add support email
- [ ] Click Save

### 2.3: Create Firestore Database
- [ ] Go to Firestore Database → Create database
- [ ] Start in "Test mode"
- [ ] Choose location (e.g., us-central1)
- [ ] Wait for creation to complete

### 2.4: Update Firestore Rules
- [ ] Go to Firestore Database → Rules tab
- [ ] Copy rules from FIREBASE_SETUP_GUIDE.md
- [ ] Paste and Publish

### 2.5: Register Web App
- [ ] Go to Project Overview
- [ ] Click web icon (</>)
- [ ] Register app with nickname
- [ ] COPY the firebaseConfig object
- [ ] Keep this window open!

## ✅ Step 3: Update Your Code

### 3.1: Update firebase-config.js
- [ ] Open `firebase-config.js`
- [ ] Find the firebaseConfig object
- [ ] Replace ALL placeholder values with your actual Firebase config
- [ ] Save the file

**Your config should look like:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",           // Your actual API key
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456:web:abc123"
};
```

## ✅ Step 4: Test Locally

### 4.1: Start Local Server
Choose ONE method:

**Method 1: Python**
- [ ] Open PowerShell in project folder
- [ ] Run: `python -m http.server 8000`
- [ ] Keep terminal open

**Method 2: Node.js**
- [ ] Open PowerShell in project folder
- [ ] Run: `npx http-server -p 8000`
- [ ] Keep terminal open

**Method 3: VS Code Live Server**
- [ ] Install Live Server extension
- [ ] Right-click index.html
- [ ] Click "Open with Live Server"

### 4.2: Open in Browser
- [ ] Go to: http://localhost:8000
- [ ] Bookmark this page!

## ✅ Step 5: Test Features

### 5.1: Authentication Test
- [ ] Landing page loads correctly
- [ ] Click "Start Quiz" → redirects to login
- [ ] Google Sign-In button appears
- [ ] Click Sign-In → Google popup appears
- [ ] Select Google account
- [ ] User info displays after login
- [ ] Name input field appears
- [ ] Enter name and click Proceed

### 5.2: Quiz Selection Test
- [ ] Quiz selection page loads
- [ ] Welcome message shows your name
- [ ] Remaining attempts shows "3"
- [ ] Both quiz cards (IT & Accounts) appear
- [ ] Click IT Quiz card

### 5.3: Quiz Test
- [ ] Quiz page loads with questions
- [ ] Question 1 appears
- [ ] 4 options (a, b, c, d) are visible
- [ ] Can select an option (highlights)
- [ ] Click "Next" → Question 2 loads
- [ ] Question palette shows on right side
- [ ] Click palette number → jumps to that question
- [ ] Timer is running
- [ ] Answer some questions
- [ ] Go to last question (40)
- [ ] "Submit Quiz" button appears
- [ ] Click Submit

### 5.4: Results Test
- [ ] Alert shows your score
- [ ] Redirects to dashboard
- [ ] Dashboard shows statistics
- [ ] Total attempts shows "1"
- [ ] Remaining attempts shows "2"
- [ ] Quiz score appears
- [ ] Quiz history shows your attempt
- [ ] Leaderboard shows your entry

### 5.5: Attempt Limit Test
- [ ] Take quiz again (2nd attempt)
- [ ] Take quiz again (3rd attempt)
- [ ] After 3rd attempt, remaining = 0
- [ ] Try to start another quiz
- [ ] Should show "No attempts remaining" message

## ✅ Step 6: Verify Firebase Data

### 6.1: Check Firestore
- [ ] Go to Firebase Console → Firestore Database
- [ ] Collection "users" exists
- [ ] Your user document exists
- [ ] User data contains: attempts, scores, timestamps
- [ ] Collection "leaderboard" exists
- [ ] Your quiz results are stored

### 6.2: Check Authentication
- [ ] Go to Firebase Console → Authentication
- [ ] Your Google account appears in Users list

### 6.3: Check Local Storage
- [ ] Open browser DevTools (F12)
- [ ] Go to Application tab → Local Storage
- [ ] Find: user_{uid}_attempts
- [ ] Find: user_{uid}_total
- [ ] Find: user_{uid}_name
- [ ] Find: user_{uid}_quiz_it or quiz_accounts

## ✅ Step 7: Common Issues Check

If something doesn't work, check these:

### Issue: Can't sign in
- [ ] Google auth is enabled in Firebase Console
- [ ] Using local server (not file://)
- [ ] Firebase config is correct in firebase-config.js
- [ ] Check browser console for errors (F12)

### Issue: Quiz not loading
- [ ] questions.js file is present
- [ ] Check browser console for errors
- [ ] SessionStorage has 'selectedQuiz' key
- [ ] Clear browser cache and try again

### Issue: Data not saving
- [ ] Firestore rules are updated
- [ ] User is signed in
- [ ] Check browser console for Firebase errors
- [ ] Internet connection is active

### Issue: Attempts not tracking
- [ ] Check Local Storage in DevTools
- [ ] Try in incognito/private mode
- [ ] Clear browser cache
- [ ] Sign out and sign in again

## ✅ Step 8: Deploy (Optional)

### For Production Deployment:

**Firebase Hosting:**
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Init: `firebase init`
- [ ] Select Hosting
- [ ] Deploy: `firebase deploy`

**Netlify:**
- [ ] Create account at netlify.com
- [ ] Drag and drop project folder
- [ ] Site goes live instantly

**GitHub Pages:**
- [ ] Push code to GitHub repo
- [ ] Go to Settings → Pages
- [ ] Select branch → Save
- [ ] Site URL appears

## ✅ Step 9: Final Verification

- [ ] Test on different browsers (Chrome, Firefox, Edge)
- [ ] Test on mobile device
- [ ] Share link with test user
- [ ] Verify test user can take quiz
- [ ] Check leaderboard updates
- [ ] Monitor Firebase Console for activity

## 🎉 Completion Checklist

- [ ] All features working
- [ ] Firebase connected
- [ ] Authentication working
- [ ] Quizzes loading
- [ ] Scores saving
- [ ] Dashboard showing data
- [ ] Leaderboard updating
- [ ] 3-attempt limit enforced
- [ ] Local storage working
- [ ] No console errors

## 📞 Need Help?

If you encounter issues:
1. ✅ Check browser console (F12) for error messages
2. ✅ Read FIREBASE_SETUP_GUIDE.md for detailed instructions
3. ✅ Verify all steps in this checklist
4. ✅ Check Firebase Console for project status
5. ✅ Try in incognito mode
6. ✅ Clear browser cache

---

## 🎯 You're Ready When:

✅ You can sign in with Google
✅ You can take a quiz
✅ Quiz results appear correctly
✅ Dashboard shows your data
✅ Leaderboard displays rankings
✅ Attempt limit is enforced
✅ No errors in browser console

**If all above are ✅ → YOUR PLATFORM IS READY! 🚀**

---

**Time to complete: 15-30 minutes**
**Difficulty: Beginner-Friendly**
**Support: Read FIREBASE_SETUP_GUIDE.md for detailed help**
