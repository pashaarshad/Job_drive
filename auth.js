// Authentication logic
import { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, doc, setDoc, getDoc, updateDoc, db } from './firebase-config.js';

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

// Mark that we're checking for redirect to avoid infinite loops
const isCheckingRedirect = sessionStorage.getItem('checking_redirect');
if (isCheckingRedirect === 'true') {
    console.log('Already checked redirect, skipping...');
    hideLoading();
} else {
    sessionStorage.setItem('checking_redirect', 'true');
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
                
                // Redirect to registration page
                console.log('Redirecting to registration page...');
                window.location.href = 'register.html';
                
                // Clear the checking flag
                sessionStorage.removeItem('checking_redirect');
            } else {
                console.log('No redirect result found');
                sessionStorage.removeItem('checking_redirect');
            }
        })
        .catch((error) => {
            console.error('Error getting redirect result:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            // Clear the checking flag on error
            sessionStorage.removeItem('checking_redirect');
            
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
            sessionStorage.removeItem('checking_redirect');
            hideLoading(); // Hide loading after checking redirect
        });
}

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('User authenticated, redirecting to registration page...');
        currentUser = user;
        
        // Store current user email for watermark
        localStorage.setItem('current_user_email', user.email);
        
        // Redirect to registration page to complete profile
        window.location.href = 'register.html';
    } else {
        googleSignInBtn.style.display = 'flex';
        if (emergencyLoginBtn) emergencyLoginBtn.style.display = 'flex';
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
                // Clear any previous redirect check flags
                sessionStorage.removeItem('checking_redirect');
                
                // Initiate redirect
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
        
        console.log('Emergency user created, redirecting to registration page...');
        
        // Redirect to registration page
        window.location.href = 'register.html';
        
    } else {
        emergencyError.textContent = '❌ Incorrect password. Please try again.';
        emergencyError.style.display = 'block';
        emergencyPassword.value = '';
        emergencyPassword.focus();
    }
});
