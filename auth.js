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
        googleSignInBtn.style.display = 'none';
        userInfoDiv.style.display = 'block';
        
        document.getElementById('userPhoto').src = user.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('userName').textContent = user.displayName;
        document.getElementById('userEmail').textContent = user.email;
        
        // Check local storage for attempts
        checkUserAttempts(user.uid);
        
        // Show name input section
        nameSection.style.display = 'block';
        document.getElementById('displayName').value = user.displayName || '';
    } else {
        googleSignInBtn.style.display = 'flex';
        userInfoDiv.style.display = 'none';
        nameSection.style.display = 'none';
    }
});

// Google Sign-In
googleSignInBtn.addEventListener('click', async () => {
    try {
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
                remainingAttempts: 3,
                quizScores: {
                    it: [],
                    accounts: []
                }
            });
            
            // Initialize local storage
            localStorage.setItem(`user_${user.uid}_attempts`, '3');
            localStorage.setItem(`user_${user.uid}_total`, '0');
        }
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Failed to sign in. Please try again.');
    }
});

// Check user attempts
function checkUserAttempts(uid) {
    const attempts = localStorage.getItem(`user_${uid}_attempts`) || '3';
    const total = localStorage.getItem(`user_${uid}_total`) || '0';
    
    if (parseInt(attempts) <= 0) {
        attemptsInfo.textContent = 'You have exhausted all 3 attempts. No more quizzes available.';
        attemptsInfo.style.color = 'red';
        proceedBtn.disabled = true;
    } else {
        attemptsInfo.textContent = `You have ${attempts} attempt(s) remaining out of 3.`;
        attemptsInfo.style.color = 'green';
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
        
        // Check attempts one more time
        const attempts = parseInt(localStorage.getItem(`user_${currentUser.uid}_attempts`) || '3');
        
        if (attempts > 0) {
            window.location.href = 'quiz-selection.html';
        } else {
            alert('You have exhausted all your attempts!');
        }
    }
});
