// Authentication logic
import { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, doc, setDoc, getDoc, updateDoc, db } from './firebase-config.js';

const googleSignInBtn = document.getElementById('googleSignIn');
const emergencyLoginBtn = document.getElementById('emergencyLoginBtn');
const emergencyModal = document.getElementById('emergencyModal');
const emergencySubmit = document.getElementById('emergencySubmit');
const emergencyPassword = document.getElementById('emergencyPassword');
const emergencyError = document.getElementById('emergencyError');
const closeEmergency = document.getElementById('closeEmergency');
const userInfoDiv = document.getElementById('userInfo');
const nameSection = document.getElementById('nameSection');
const loadingIndicator = document.getElementById('loadingIndicator');

// Registration modal elements
const registrationModal = document.getElementById('registrationModal');
const regUserPhoto = document.getElementById('regUserPhoto');
const regUserEmail = document.getElementById('regUserEmail');
const regDisplayName = document.getElementById('regDisplayName');
const completeRegBtn = document.getElementById('completeRegBtn');

let currentUser = null;
let isEmergencyUser = false;
let pendingRegistration = false;

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
showLoading();

getRedirectResult(auth)
    .then(async (result) => {
        console.log('Redirect result:', result);
        if (result && result.user) {
            console.log('User signed in via redirect:', result.user.email);
            hideLoading();
            
            currentUser = result.user;
            localStorage.setItem('current_user_email', result.user.email);
            
            // Check if already registered
            const userRef = doc(db, 'users', result.user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists() && userDoc.data().registrationComplete) {
                console.log('User already registered, redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                console.log('Opening registration modal...');
                showRegistrationModal(result.user);
            }
        } else {
            console.log('No redirect result');
            hideLoading();
        }
    })
    .catch((error) => {
        console.error('Error getting redirect result:', error);
        hideLoading();
        
        if (error.code === 'auth/unauthorized-domain') {
            alert('⚠️ Add your Netlify domain to Firebase Console > Authentication > Authorized domains');
        } else if (error.code !== 'auth/popup-closed-by-user') {
            console.error('Sign-in error:', error.message);
        }
    });

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user && !pendingRegistration) {
        console.log('User authenticated:', user.email);
        currentUser = user;
        localStorage.setItem('current_user_email', user.email);
        
        // Check if registration is complete
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() && userDoc.data().registrationComplete) {
            console.log('Registration complete, going to dashboard');
            window.location.href = 'dashboard.html';
        }
    }
});

// Google Sign-In
googleSignInBtn.addEventListener('click', async () => {
    try {
        const isMobile = isMobileDevice();
        console.log('Sign-in clicked, mobile:', isMobile);
        
        showLoading();
        
        if (isMobile) {
            // Mobile: Use redirect
            console.log('Using redirect for mobile');
            await signInWithRedirect(auth, provider);
        } else {
            // Desktop: Use popup and show modal
            console.log('Using popup for desktop');
            const result = await signInWithPopup(auth, provider);
            hideLoading();
            
            currentUser = result.user;
            localStorage.setItem('current_user_email', result.user.email);
            
            // Check if already registered
            const userRef = doc(db, 'users', result.user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists() && userDoc.data().registrationComplete) {
                window.location.href = 'dashboard.html';
            } else {
                showRegistrationModal(result.user);
            }
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        hideLoading();
        
        if (error.code !== 'auth/popup-closed-by-user') {
            alert('Sign-in failed. Try Emergency Login.');
        }
    }
});

// Show registration modal
function showRegistrationModal(user) {
    pendingRegistration = true;
    currentUser = user;
    
    regUserPhoto.src = user.photoURL || 'https://via.placeholder.com/80';
    regUserEmail.textContent = user.email;
    regDisplayName.value = user.displayName || '';
    
    registrationModal.style.display = 'flex';
    setTimeout(() => regDisplayName.focus(), 100);
}

// Complete registration from modal
completeRegBtn.addEventListener('click', async () => {
    const displayName = regDisplayName.value.trim();
    
    if (!displayName) {
        alert('Please enter your name');
        return;
    }
    
    try {
        showLoading();
        
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: displayName,
            photoURL: currentUser.photoURL,
            registrationComplete: true,
            isEmergency: isEmergencyUser,
            createdAt: new Date(),
            totalAttempts: 0,
            quizScores: { it: [], accounts: [] }
        };
        
        if (userDoc.exists()) {
            await updateDoc(userRef, {
                displayName: displayName,
                registrationComplete: true,
                lastUpdated: new Date()
            });
        } else {
            await setDoc(userRef, userData);
        }
        
        localStorage.setItem(`user_${currentUser.uid}_name`, displayName);
        
        console.log('Registration complete, redirecting...');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Registration error:', error);
        hideLoading();
        alert('Registration failed. Please try again.');
    }
});

// Emergency Login Modal
emergencyLoginBtn.addEventListener('click', () => {
    emergencyModal.style.display = 'flex';
    emergencyPassword.value = '';
    emergencyError.style.display = 'none';
    setTimeout(() => emergencyPassword.focus(), 100);
});

closeEmergency.addEventListener('click', () => {
    emergencyModal.style.display = 'none';
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
        
        currentUser = emergencyUserData;
        isEmergencyUser = true;
        
        // Close emergency modal and show registration modal
        emergencyModal.style.display = 'none';
        showRegistrationModal(emergencyUserData);
        
    } else {
        emergencyError.textContent = '❌ Incorrect password. Please try again.';
        emergencyError.style.display = 'block';
        emergencyPassword.value = '';
        emergencyPassword.focus();
    }
});
