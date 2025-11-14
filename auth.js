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
console.log('Checking for redirect result on page load...');
showLoading(); // Show loading while checking for redirect
getRedirectResult(auth)
    .then(async (result) => {
        console.log('Redirect result:', result);
        if (result && result.user) {
            console.log('User signed in via redirect:', result.user.email);
            const user = result.user;
            
            // Initialize user in Firestore if new
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                console.log('Creating new user in Firestore...');
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
                console.log('User created successfully');
            } else {
                console.log('User already exists in Firestore');
            }
            
            // Store user email
            localStorage.setItem('current_user_email', user.email);
        } else {
            console.log('No redirect result found');
        }
    })
    .catch((error) => {
        console.error('Error getting redirect result:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Only show alert for actual errors, not cancelled operations
        if (error.code !== 'auth/popup-closed-by-user' && 
            error.code !== 'auth/cancelled-popup-request' &&
            error.code !== 'auth/network-request-failed') {
            
            // Show more specific error message
            let errorMessage = 'Sign-in failed. ';
            
            if (error.code === 'auth/unauthorized-domain') {
                errorMessage += 'Your Netlify domain needs to be authorized in Firebase Console. Please add your domain to Firebase Authentication settings.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage += 'Google sign-in is not enabled. Please enable it in Firebase Console.';
            } else if (error.code === 'auth/internal-error') {
                errorMessage += 'Internal error. Please check your Firebase configuration.';
            } else {
                errorMessage += 'Please try again or use Emergency Login.';
            }
            
            alert(errorMessage);
        }
    })
    .finally(() => {
        console.log('Redirect check completed');
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
        
        console.log('Sign-in button clicked');
        console.log('Is mobile device:', isMobile);
        
        showLoading(); // Show loading indicator
        
        if (isMobile) {
            // Use redirect for mobile devices (more reliable)
            console.log('Using redirect sign-in for mobile');
            try {
                await signInWithRedirect(auth, provider);
                console.log('Redirect initiated');
                // Note: Page will redirect, loading will be shown until then
            } catch (redirectError) {
                console.error('Redirect error:', redirectError);
                hideLoading();
                
                if (redirectError.code === 'auth/unauthorized-domain') {
                    alert('⚠️ Domain Authorization Required\n\nYour Netlify domain needs to be added to Firebase:\n\n1. Go to Firebase Console\n2. Authentication > Settings > Authorized domains\n3. Add your Netlify domain\n\nOr use Emergency Login with password: ROOT');
                } else {
                    alert('Failed to sign in: ' + (redirectError.message || 'Unknown error') + '\n\nTry using Emergency Login with password: ROOT');
                }
            }
        } else {
            // Use popup for desktop (better UX)
            console.log('Using popup sign-in for desktop');
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            console.log('Popup sign-in successful:', user.email);
            
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
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        hideLoading(); // Hide loading on error
        
        // Don't show error if user closed popup
        if (error.code !== 'auth/popup-closed-by-user' && 
            error.code !== 'auth/cancelled-popup-request') {
            
            let errorMsg = 'Failed to sign in. ';
            if (error.code === 'auth/unauthorized-domain') {
                errorMsg = '⚠️ Your Netlify domain is not authorized.\n\nAdd your domain to Firebase Console > Authentication > Settings > Authorized domains\n\nOr use Emergency Login (password: ROOT)';
            } else {
                errorMsg += error.message || 'Please try again or use Emergency Login.';
            }
            
            alert(errorMsg);
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
