// Results Page Logic
import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

let currentUser = null;

// Check authentication and load results (including emergency login)
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadResults(user.uid);
    } else {
        // Check for emergency user
        const isEmergency = localStorage.getItem('emergency_user') === 'true';
        const emergencyUserId = localStorage.getItem('emergency_user_id');
        
        if (isEmergency && emergencyUserId) {
            currentUser = {
                uid: emergencyUserId,
                email: 'emergency@quizplatform.local',
                displayName: localStorage.getItem(`user_${emergencyUserId}_name`) || 'Emergency User',
                isEmergency: true
            };
            
            loadResults(emergencyUserId);
        } else {
            window.location.href = 'login.html';
        }
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
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if both quizzes are completed
    const itCompleted = localStorage.getItem(`user_${currentUser.uid}_quiz_it_completed`) === 'true';
    const accountsCompleted = localStorage.getItem(`user_${currentUser.uid}_quiz_accounts_completed`) === 'true';
    
    if (itCompleted && accountsCompleted) {
        alert('You have completed both quizzes! View the leaderboard on the dashboard.');
        window.location.href = 'dashboard.html';
    } else {
        // Go to dashboard where they can choose available quiz
        window.location.href = 'dashboard.html';
    }
};

window.logout = async function() {
    try {
        // Check if emergency user
        const isEmergency = localStorage.getItem('emergency_user') === 'true';
        
        if (isEmergency) {
            // Clear emergency user data
            localStorage.removeItem('emergency_user');
            localStorage.removeItem('emergency_user_id');
            localStorage.removeItem('current_user_email');
        } else {
            await signOut(auth);
        }
        
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
