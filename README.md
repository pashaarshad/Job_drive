# Online Quiz Platform - Direct Company Recruitment

A complete online quiz platform for recruitment with IT Quiz (Java MCQs) and Accountancy Quiz. Built with HTML, CSS, JavaScript, and Firebase.

## 🎯 Features

- ✅ Google Sign-In Authentication
- ✅ Two Quiz Categories: IT (Java) & Accountancy
- ✅ 40 Questions per quiz
- ✅ Maximum 3 Attempts per User
- ✅ Local Storage for Attempt Tracking (Anti-Cheat)
- ✅ Real-time Dashboard with Statistics
- ✅ Leaderboard with Top Rankers
- ✅ Quiz History Tracking
- ✅ Timer for Each Quiz
- ✅ Question Palette Navigation
- ✅ Responsive Design

## 📁 Project Structure

```
Job_drive/
│
├── index.html              # Landing page with company info
├── login.html              # Google authentication page
├── quiz-selection.html     # Choose IT or Accounts quiz
├── quiz.html               # Quiz interface
├── dashboard.html          # Results and leaderboard
│
├── styles.css              # Complete styling
│
├── app.js                  # Landing page logic
├── firebase-config.js      # Firebase configuration
├── auth.js                 # Authentication logic
├── quiz-selection.js       # Quiz selection logic
├── quiz.js                 # Quiz functionality
├── dashboard.js            # Dashboard logic
├── questions.js            # All quiz questions
│
├── FIREBASE_SETUP_GUIDE.md # Step-by-step Firebase setup
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Set Up Firebase

**Read the complete guide:** `FIREBASE_SETUP_GUIDE.md`

**Quick Steps:**
1. Create Firebase project at https://console.firebase.google.com/
2. Enable Google Authentication
3. Create Firestore Database
4. Copy your Firebase config
5. Update `firebase-config.js` with your config

### 2. Run Locally

You MUST use a local server (Firebase requires it):

**Option 1: Python**
```powershell
python -m http.server 8000
```

**Option 2: Node.js**
```powershell
npx http-server -p 8000
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 3. Open in Browser

Navigate to: `http://localhost:8000`

## 🎮 How to Use

1. **Landing Page**
   - Shows company recruitment information
   - Click "Start Quiz" to begin

2. **Login Page**
   - Sign in with Google account
   - Enter your name
   - System checks available attempts

3. **Quiz Selection**
   - Choose between IT Quiz or Accountancy Quiz
   - View remaining attempts (max 3)

4. **Take Quiz**
   - 40 questions with multiple choices
   - Navigate using Previous/Next buttons
   - Use question palette to jump to any question
   - Timer tracks your time
   - Submit when complete

5. **Dashboard**
   - View your scores and statistics
   - See quiz history
   - Check leaderboard rankings

## 🔒 Anti-Cheat Features

- **Local Storage Tracking**: Stores attempts in browser's local storage
- **User-Specific Data**: Each user has separate attempt counter
- **Maximum 3 Attempts**: Hard limit enforced
- **Firebase Backup**: All attempts also tracked in Firestore
- **Authentication Required**: Must be signed in to take quiz

## 📊 Data Storage

### Local Storage (Primary)
- `user_{uid}_attempts` - Remaining attempts
- `user_{uid}_total` - Total attempts taken
- `user_{uid}_name` - User's display name
- `user_{uid}_quiz_it` - IT quiz history
- `user_{uid}_quiz_accounts` - Accounts quiz history

### Firestore Database (Backup & Sync)
- `users` collection - User profiles and scores
- `leaderboard` collection - All quiz results for ranking

## 🎨 Customization

### Change Colors
Edit `styles.css` - look for gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Questions
Edit `questions.js` and add to the respective array:
```javascript
quizQuestions.it.push({
    question: "Your question?",
    options: ["a) Option 1", "b) Option 2", "c) Option 3", "d) Option 4"],
    correct: 0 // Index of correct answer (0-3)
});
```

### Change Attempt Limit
Update initial value in `auth.js` and `quiz-selection.js`:
```javascript
localStorage.setItem(`user_${user.uid}_attempts`, '5'); // Change 3 to 5
```

## 🌐 Deployment

### Firebase Hosting (Recommended)
```powershell
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Other Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable in repository settings

## 📋 Quiz Content

### IT Quiz (40 Questions)
- Java Programming fundamentals
- Object-Oriented Programming concepts
- Java syntax and semantics
- Exception handling
- Collections and data structures

### Accountancy Quiz (40 Questions)
- Accounting principles
- Book keeping concepts
- Financial management
- Double entry system
- Balance sheets and accounts

## 🔧 Troubleshooting

### Firebase Auth Error
- Check if domain is authorized in Firebase Console
- Verify Firebase config is correct
- Use local server (not file://)

### Quiz Not Loading
- Check browser console (F12) for errors
- Verify questions.js is loading
- Clear browser cache

### Data Not Saving
- Check Firestore security rules
- Verify you're signed in
- Check browser console for errors

## 📱 Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ IE11 (Not supported - use modern browsers)

## 🛡️ Security

- Firebase Authentication for secure login
- Firestore security rules restrict data access
- Local storage is browser-specific
- No sensitive data stored client-side

## 📞 Support

For issues or questions:
1. Check `FIREBASE_SETUP_GUIDE.md`
2. Review browser console (F12)
3. Verify Firebase Console settings
4. Test with different browser

## 📄 License

Free to use for educational and commercial purposes.

## 🎉 Credits

Created for Direct Company Recruitment Platform

---

**Ready to recruit! Start your quiz platform now! 🚀**
