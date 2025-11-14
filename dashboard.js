// Dashboard Logic
import { auth, onAuthStateChanged, signOut, db, doc, getDoc } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;

// Check authentication (including emergency login)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userName = localStorage.getItem(`user_${user.uid}_name`) || user.displayName;
        document.getElementById('welcomeUser').textContent = `Welcome, ${userName}!`;
        
        // Load dashboard data
        await loadDashboard(user.uid);
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
            
            const userName = localStorage.getItem(`user_${emergencyUserId}_name`) || 'Emergency User';
            document.getElementById('welcomeUser').textContent = `Welcome, ${userName}!`;
            
            // Load dashboard data
            await loadDashboard(emergencyUserId);
        } else {
            window.location.href = 'login.html';
        }
    }
});

async function loadDashboard(uid) {
    // Load statistics from local storage
    const totalAttempts = localStorage.getItem(`user_${uid}_total`) || '0';
    
    // Load IT Quiz scores
    const itQuizHistory = JSON.parse(localStorage.getItem(`user_${uid}_quiz_it`) || '[]');
    if (itQuizHistory.length > 0) {
        const bestIT = itQuizHistory.reduce((max, curr) => 
            curr.percentage > max.percentage ? curr : max
        );
        document.getElementById('itScore').textContent = 
            `${bestIT.score}/${bestIT.total} (${bestIT.percentage}%)`;
    }
    
    // Load Accounts Quiz scores
    const accountsQuizHistory = JSON.parse(localStorage.getItem(`user_${uid}_quiz_accounts`) || '[]');
    if (accountsQuizHistory.length > 0) {
        const bestAccounts = accountsQuizHistory.reduce((max, curr) => 
            curr.percentage > max.percentage ? curr : max
        );
        document.getElementById('accountsScore').textContent = 
            `${bestAccounts.score}/${bestAccounts.total} (${bestAccounts.percentage}%)`;
    }
    
    // Update quiz button states
    updateQuizButtons(uid);
    
    // Load quiz history
    loadQuizHistory(uid, itQuizHistory, accountsQuizHistory);
    
    // Load leaderboard from Firebase
    await loadLeaderboard();
}

function updateQuizButtons(uid) {
    const itCompleted = localStorage.getItem(`user_${uid}_quiz_it_completed`) === 'true';
    const accountsCompleted = localStorage.getItem(`user_${uid}_quiz_accounts_completed`) === 'true';
    
    const itBtn = document.getElementById('itQuizBtn');
    const accountsBtn = document.getElementById('accountsQuizBtn');
    
    if (itCompleted) {
        itBtn.disabled = true;
        itBtn.textContent = 'IT Quiz Completed ✓';
        itBtn.style.opacity = '0.6';
        itBtn.style.cursor = 'not-allowed';
    }
    
    if (accountsCompleted) {
        accountsBtn.disabled = true;
        accountsBtn.textContent = 'Accountancy Quiz Completed ✓';
        accountsBtn.style.opacity = '0.6';
        accountsBtn.style.cursor = 'not-allowed';
    }
}

function loadQuizHistory(uid, itHistory, accountsHistory) {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';
    
    const allHistory = [
        ...itHistory.map(h => ({ ...h, type: 'IT Quiz' })),
        ...accountsHistory.map(h => ({ ...h, type: 'Accounts Quiz' }))
    ];
    
    // Sort by date (most recent first)
    allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allHistory.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #666;">No quiz attempts yet.</p>';
        return;
    }
    
    allHistory.forEach(attempt => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(attempt.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const timeStr = `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s`;
        
        historyItem.innerHTML = `
            <h4>${attempt.type}</h4>
            <p>Score: ${attempt.score}/${attempt.total} (${attempt.percentage}%)</p>
            <p>Time: ${timeStr} | Date: ${dateStr}</p>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

let currentLeaderboardType = 'it'; // Default to IT Quiz

async function loadLeaderboard(quizType = 'it') {
    currentLeaderboardType = quizType;
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    
    if (!leaderboardContainer) {
        console.error('Leaderboard container not found');
        return;
    }
    
    leaderboardContainer.innerHTML = '<p style="text-align: center;">Loading leaderboard...</p>';
    
    try {
        // Get top scores from Firebase filtered by quiz type
        const leaderboardRef = collection(db, 'leaderboard');
        const q = query(leaderboardRef, orderBy('percentage', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            leaderboardContainer.innerHTML = '<p style="text-align: center; color: #666;">No leaderboard data yet.</p>';
            return;
        }
        
        // Filter by quiz type
        const filteredData = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.quizType === quizType && data.percentage != null) {
                // Ensure percentage is a number
                data.percentage = parseFloat(data.percentage);
                filteredData.push(data);
            }
        });
        
        // Sort by percentage (handle NaN) and take top 10
        filteredData.sort((a, b) => {
            const aPerc = isNaN(a.percentage) ? 0 : a.percentage;
            const bPerc = isNaN(b.percentage) ? 0 : b.percentage;
            return bPerc - aPerc;
        });
        const top10 = filteredData.slice(0, 10);
        
        if (top10.length === 0) {
            leaderboardContainer.innerHTML = '<p style="text-align: center; color: #666;">No leaderboard data yet for this quiz.</p>';
            return;
        }
        
        leaderboardContainer.innerHTML = '';
        let rank = 1;
        
        top10.forEach((data) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            const displayName = data.name || 'Anonymous';
            const displayPercentage = isNaN(data.percentage) ? '0' : data.percentage.toFixed(2);
            const isCurrentUser = currentUser && data.uid === currentUser.uid;
            
            leaderboardItem.innerHTML = `
                <span class="leaderboard-rank">${medal} #${rank}</span>
                <span class="leaderboard-name">${displayName} ${isCurrentUser ? '(You)' : ''}</span>
                <span class="leaderboard-score">${displayPercentage}%</span>
            `;
            
            leaderboardContainer.appendChild(leaderboardItem);
            rank++;
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        leaderboardContainer.innerHTML = '<p style="text-align: center; color: red;">Failed to load leaderboard.</p>';
    }
}

window.takeQuiz = function(quizType) {
    if (!currentUser) {
        alert('Please log in first!');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if this specific quiz is already completed
    const quizCompleted = localStorage.getItem(`user_${currentUser.uid}_quiz_${quizType}_completed`) === 'true';
    
    if (quizCompleted) {
        alert('You have already completed this quiz!');
        return;
    }
    
    // Store selected quiz type
    sessionStorage.setItem('selectedQuiz', quizType);
    
    // Redirect to quiz page
    window.location.href = 'quiz.html';
};

window.goToQuizSelection = function() {
    window.location.href = 'quiz-selection.html';
};

window.switchLeaderboard = function(quizType) {
    // Update active tab
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load leaderboard for selected quiz type
    loadLeaderboard(quizType);
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
