// Registration Page Logic
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc, updateDoc } from './firebase-config.js';

let currentUser = null;

// Check authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('User authenticated:', user.email);
        currentUser = user;
        
        // Display user info
        document.getElementById('userPhoto').src = user.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('userEmail').textContent = user.email;
        
        // Pre-fill name if available
        const savedName = localStorage.getItem(`user_${user.uid}_name`) || user.displayName || '';
        document.getElementById('displayName').value = savedName;
        
        // Check if user already completed registration
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() && userDoc.data().registrationComplete) {
            console.log('Registration already complete, redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        }
    } else {
        // Check for emergency user
        const isEmergency = localStorage.getItem('emergency_user') === 'true';
        const emergencyUserId = localStorage.getItem('emergency_user_id');
        
        if (isEmergency && emergencyUserId) {
            console.log('Emergency user detected:', emergencyUserId);
            currentUser = {
                uid: emergencyUserId,
                email: 'emergency@quizplatform.local',
                displayName: localStorage.getItem(`user_${emergencyUserId}_name`) || 'Emergency User',
                photoURL: 'https://via.placeholder.com/80?text=Emergency',
                isEmergency: true
            };
            
            // Display emergency user info
            document.getElementById('userPhoto').src = currentUser.photoURL;
            document.getElementById('userEmail').textContent = currentUser.email;
            
            const savedName = localStorage.getItem(`user_${emergencyUserId}_name`) || '';
            document.getElementById('displayName').value = savedName;
        } else {
            console.log('No authenticated user, redirecting to login...');
            window.location.href = 'login.html';
        }
    }
});

// Complete registration
document.getElementById('completeBtn').addEventListener('click', async () => {
    const displayName = document.getElementById('displayName').value.trim();
    
    if (!displayName) {
        alert('Please enter your name to continue.');
        return;
    }
    
    if (!currentUser) {
        alert('Authentication error. Please sign in again.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Store name in local storage
        localStorage.setItem(`user_${currentUser.uid}_name`, displayName);
        localStorage.setItem('current_user_email', currentUser.email || 'emergency@quizplatform.local');
        
        // Update Firebase
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            // Update existing user
            await updateDoc(userRef, {
                displayName: displayName,
                registrationComplete: true,
                lastUpdated: new Date()
            });
            console.log('User registration updated in Firebase');
        } else {
            // Create new user document
            await setDoc(userRef, {
                uid: currentUser.uid,
                email: currentUser.email || 'emergency@quizplatform.local',
                displayName: displayName,
                photoURL: currentUser.photoURL || 'https://via.placeholder.com/80',
                isEmergency: currentUser.isEmergency || false,
                registrationComplete: true,
                createdAt: new Date(),
                totalAttempts: 0,
                quizScores: {
                    it: [],
                    accounts: []
                }
            });
            console.log('New user created in Firebase');
        }
        
        // Registration complete, redirect to dashboard
        console.log('Registration complete, redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Error completing registration:', error);
        alert('Failed to complete registration. Please try again.');
    }
});
