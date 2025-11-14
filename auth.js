// Authentication logic
import { auth, provider, signInWithPopup, onAuthStateChanged, doc, setDoc, getDoc, db } from './firebase-config.js';

const googleSignInBtn = document.getElementById('googleSignIn');
const userInfoDiv = document.getElementById('userInfo');
const nameSection = document.getElementById('nameSection');
const proceedBtn = document.getElementById('proceedBtn');
const attemptsInfo = document.getElementById('attemptsInfo');

let currentUser = null;

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // Store current user email for watermark
        localStorage.setItem('current_user_email', user.email);
        
        googleSignInBtn.style.display = 'none';
        userInfoDiv.style.display = 'block';
        
        document.getElementById('userPhoto').src = user.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('userName').textContent = user.displayName;
        document.getElementById('userEmail').textContent = user.email;
        
        // Check local storage for attempts
        checkUserAttempts(user.uid);
        
        // Show name input section
        nameSection.style.display = 'block';
        document.getElementById('displayName').value = 
            localStorage.getItem(`user_${user.uid}_name`) || user.displayName || '';
    } else {
        googleSignInBtn.style.display = 'flex';
        userInfoDiv.style.display = 'none';
        nameSection.style.display = 'none';
        localStorage.removeItem('current_user_email');
    }
});

// Google Sign-In
googleSignInBtn.addEventListener('click', async () => {
    try {
        // Force account selection on every sign-in
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Initialize user in Firestore if new
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                totalAttempts: 0,
                remainingAttempts: 1,
                quizScores: {
                    it: [],
                    accounts: []
                }
            });
            
            // Initialize local storage
            localStorage.setItem(`user_${user.uid}_attempts`, '1');
            localStorage.setItem(`user_${user.uid}_total`, '0');
        }
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Failed to sign in. Please try again.');
    }
});

// Check user attempts
function checkUserAttempts(uid) {
    // Check if both quizzes are completed
    const itCompleted = localStorage.getItem(`user_${uid}_quiz_it_completed`) === 'true';
    const accountsCompleted = localStorage.getItem(`user_${uid}_quiz_accounts_completed`) === 'true';
    
    if (itCompleted && accountsCompleted) {
        // Both quizzes completed, disable proceed button
        proceedBtn.disabled = true;
    }
}

// Proceed to quiz selection
proceedBtn.addEventListener('click', () => {
    const displayName = document.getElementById('displayName').value.trim();
    
    if (!displayName) {
        alert('Please enter your name to continue.');
        return;
    }
    
    if (currentUser) {
        // Store user name
        localStorage.setItem(`user_${currentUser.uid}_name`, displayName);
        
        // Proceed to quiz selection
        window.location.href = 'quiz-selection.html';
    }
});
