// Authentication logic
import { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, doc, setDoc, getDoc, db } from './firebase-config.js';

const googleSignInBtn = document.getElementById('googleSignIn');
const emergencyLoginBtn = document.getElementById('emergencyLoginBtn');
const emergencyModal = document.getElementById('emergencyModal');
const emergencySubmit = document.getElementById('emergencySubmit');
const emergencyPassword = document.getElementById('emergencyPassword');
const emergencyError = document.getElementById('emergencyError');
const closeModal = document.querySelector('.close-modal');
const userInfoDiv = document.getElementById('userInfo');
const nameSection = document.getElementById('nameSection');
const proceedBtn = document.getElementById('proceedBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

let currentUser = null;
let isEmergencyUser = false;

// Detect if on mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

// Show loading indicator
function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    if (googleSignInBtn) {
        googleSignInBtn.style.display = 'none';
    }
}

// Hide loading indicator
function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    if (googleSignInBtn && !currentUser) {
        googleSignInBtn.style.display = 'flex';
    }
}

// Check for redirect result (important for mobile)
showLoading(); // Show loading while checking for redirect
getRedirectResult(auth)
    .then(async (result) => {
        if (result && result.user) {
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
                    quizScores: {
                        it: [],
                        accounts: []
                    }
                });
            }
            
            // Store user email
            localStorage.setItem('current_user_email', user.email);
        }
    })
    .catch((error) => {
        console.error('Error getting redirect result:', error);
        if (error.code !== 'auth/popup-closed-by-user') {
            alert('Sign-in failed. Please try again.');
        }
    })
    .finally(() => {
        hideLoading(); // Hide loading after checking redirect
    });

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
        const isMobile = isMobileDevice();
        
        showLoading(); // Show loading indicator
        
        if (isMobile) {
            // Use redirect for mobile devices (more reliable)
            console.log('Using redirect sign-in for mobile');
            await signInWithRedirect(auth, provider);
            // Note: Page will redirect, loading will be shown until then
        } else {
            // Use popup for desktop (better UX)
            console.log('Using popup sign-in for desktop');
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
                    quizScores: {
                        it: [],
                        accounts: []
                    }
                });
            }
            
            // Store user email
            localStorage.setItem('current_user_email', user.email);
            hideLoading();
        }
    } catch (error) {
        console.error('Error signing in:', error);
        hideLoading(); // Hide loading on error
        
        // Don't show error if user closed popup
        if (error.code !== 'auth/popup-closed-by-user' && 
            error.code !== 'auth/cancelled-popup-request') {
            alert('Failed to sign in. Please try again.');
        }
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

// Emergency Login Modal
emergencyLoginBtn.addEventListener('click', () => {
    emergencyModal.style.display = 'flex';
    emergencyPassword.value = '';
    emergencyError.style.display = 'none';
    setTimeout(() => emergencyPassword.focus(), 100);
});

closeModal.addEventListener('click', () => {
    emergencyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === emergencyModal) {
        emergencyModal.style.display = 'none';
    }
});

// Emergency password submission
emergencyPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        emergencySubmit.click();
    }
});

emergencySubmit.addEventListener('click', async () => {
    const password = emergencyPassword.value.trim();
    
    if (password === 'ROOT') {
        emergencyError.style.display = 'none';
        
        // Create emergency user object
        const emergencyUserId = 'emergency_user_' + Date.now();
        const emergencyUserData = {
            uid: emergencyUserId,
            email: 'emergency@quizplatform.local',
            displayName: 'Emergency User',
            photoURL: 'https://via.placeholder.com/80?text=Emergency',
            isEmergency: true
        };
        
        currentUser = emergencyUserData;
        isEmergencyUser = true;
        
        // Store in local storage
        localStorage.setItem('current_user_email', emergencyUserData.email);
        localStorage.setItem('emergency_user', 'true');
        localStorage.setItem('emergency_user_id', emergencyUserId);
        
        // Initialize Firebase data for emergency user
        try {
            const userRef = doc(db, 'users', emergencyUserId);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    uid: emergencyUserId,
                    email: emergencyUserData.email,
                    displayName: emergencyUserData.displayName,
                    photoURL: emergencyUserData.photoURL,
                    isEmergency: true,
                    createdAt: new Date(),
                    totalAttempts: 0,
                    quizScores: {
                        it: [],
                        accounts: []
                    }
                });
            }
        } catch (error) {
            console.error('Error creating emergency user in Firebase:', error);
        }
        
        // Update UI
        emergencyModal.style.display = 'none';
        googleSignInBtn.style.display = 'none';
        emergencyLoginBtn.style.display = 'none';
        userInfoDiv.style.display = 'block';
        nameSection.style.display = 'block';
        
        document.getElementById('userPhoto').src = emergencyUserData.photoURL;
        document.getElementById('userName').textContent = emergencyUserData.displayName;
        document.getElementById('userEmail').textContent = emergencyUserData.email;
        document.getElementById('displayName').value = 
            localStorage.getItem(`user_${emergencyUserId}_name`) || 'Emergency User';
        
        // Check user attempts
        checkUserAttempts(emergencyUserId);
        
    } else {
        emergencyError.textContent = '❌ Incorrect password. Please try again.';
        emergencyError.style.display = 'block';
        emergencyPassword.value = '';
        emergencyPassword.focus();
    }
});
