// Results Page Logic
import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

let currentUser = null;

// Check authentication and load results
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadResults(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

function loadResults(uid) {
    // Get last quiz result from sessionStorage
    const lastScore = sessionStorage.getItem('lastQuizScore');
    const lastTotal = sessionStorage.getItem('lastQuizTotal');
    const lastPercentage = sessionStorage.getItem('lastQuizPercentage');
    const lastTime = sessionStorage.getItem('lastQuizTime');
    
    if (lastScore && lastTotal) {
        document.getElementById('scoreText').textContent = `Score: ${lastScore}/${lastTotal}`;
        document.getElementById('percentageText').textContent = `Percentage: ${lastPercentage}%`;
        
        const minutes = Math.floor(lastTime / 60);
        const seconds = lastTime % 60;
        document.getElementById('timeText').textContent = 
            `Time Taken: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Display message based on score
        displayResultMessage(parseFloat(lastPercentage));
    }
    
    // Update remaining attempts
    const remainingAttempts = localStorage.getItem(`user_${uid}_attempts`) || '3';
    document.getElementById('remainingAttempts').textContent = remainingAttempts;
    
    // Clear session storage
    sessionStorage.removeItem('lastQuizScore');
    sessionStorage.removeItem('lastQuizTotal');
    sessionStorage.removeItem('lastQuizPercentage');
    sessionStorage.removeItem('lastQuizTime');
}

function displayResultMessage(percentage) {
    const messageDiv = document.getElementById('resultMessage');
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
        emoji = '🌟';
        message = 'Outstanding Performance! You have excellent knowledge!';
    } else if (percentage >= 75) {
        emoji = '🎉';
        message = 'Great Job! You have strong understanding of the subject!';
    } else if (percentage >= 60) {
        emoji = '👍';
        message = 'Good Work! Keep practicing to improve further!';
    } else if (percentage >= 50) {
        emoji = '📚';
        message = 'Fair Attempt! Review the topics and try again!';
    } else {
        emoji = '💪';
        message = 'Keep Learning! Practice more to improve your score!';
    }
    
    messageDiv.innerHTML = `<h2>${emoji}</h2><p>${message}</p>`;
}

window.viewDashboard = function() {
    window.location.href = 'dashboard.html';
};

window.takeAnotherQuiz = function() {
    const remainingAttempts = parseInt(localStorage.getItem(`user_${currentUser.uid}_attempts`) || '0');
    
    if (remainingAttempts > 0) {
        window.location.href = 'quiz-selection.html';
    } else {
        alert('You have no remaining attempts!');
        window.location.href = 'dashboard.html';
    }
};

window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
