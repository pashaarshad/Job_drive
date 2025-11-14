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
    // Check which quizzes are completed
    const itCompleted = localStorage.getItem(`user_${uid}_quiz_it_completed`) === 'true';
    const accountsCompleted = localStorage.getItem(`user_${uid}_quiz_accounts_completed`) === 'true';
    
    const quizCards = document.querySelectorAll('.quiz-card');
    
    // Disable IT quiz if completed
    if (itCompleted) {
        quizCards[0].style.opacity = '0.5';
        quizCards[0].style.pointerEvents = 'none';
        quizCards[0].querySelector('.btn-select').textContent = 'Completed';
    }
    
    // Disable Accounts quiz if completed
    if (accountsCompleted) {
        quizCards[1].style.opacity = '0.5';
        quizCards[1].style.pointerEvents = 'none';
        quizCards[1].querySelector('.btn-select').textContent = 'Completed';
    }
}

window.selectQuiz = function(quizType) {
    if (!currentUser) {
        alert('Please log in first!');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if this specific quiz is already completed
    const quizCompleted = localStorage.getItem(`user_${currentUser.uid}_quiz_${quizType}_completed`) === 'true';
    
    if (quizCompleted) {
        alert('You have already completed this quiz! View the leaderboard on the dashboard.');
        window.location.href = 'dashboard.html';
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
