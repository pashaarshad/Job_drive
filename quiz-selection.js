// Quiz Selection Page Logic
import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

let currentUser = null;

// Check authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        const userName = localStorage.getItem(`user_${user.uid}_name`) || user.displayName;
        document.getElementById('welcomeUser').textContent = `Welcome, ${userName}!`;
        
        // Update remaining attempts display
        updateAttemptsDisplay(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

function updateAttemptsDisplay(uid) {
    const attempts = localStorage.getItem(`user_${uid}_attempts`) || '3';
    document.getElementById('remainingAttempts').textContent = attempts;
    
    if (parseInt(attempts) <= 0) {
        // Disable quiz cards
        const quizCards = document.querySelectorAll('.quiz-card');
        quizCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
        
        alert('You have exhausted all your attempts!');
    }
}

window.selectQuiz = function(quizType) {
    if (!currentUser) {
        alert('Please log in first!');
        window.location.href = 'login.html';
        return;
    }
    
    const attempts = parseInt(localStorage.getItem(`user_${currentUser.uid}_attempts`) || '3');
    
    if (attempts <= 0) {
        alert('You have no remaining attempts!');
        return;
    }
    
    // Store selected quiz type
    sessionStorage.setItem('selectedQuiz', quizType);
    
    // Redirect to quiz page
    window.location.href = 'quiz.html';
};

window.viewDashboard = function() {
    window.location.href = 'dashboard.html';
};

window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
