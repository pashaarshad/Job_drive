// Dashboard Logic
import { auth, onAuthStateChanged, signOut, db, doc, getDoc } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;

// Check authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userName = localStorage.getItem(`user_${user.uid}_name`) || user.displayName;
        document.getElementById('welcomeUser').textContent = `Welcome, ${userName}!`;
        
        // Load dashboard data
        await loadDashboard(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

async function loadDashboard(uid) {
    // Load statistics from local storage
    const totalAttempts = localStorage.getItem(`user_${uid}_total`) || '0';
    const remainingAttempts = localStorage.getItem(`user_${uid}_attempts`) || '1';
    
    document.getElementById('totalAttempts').textContent = totalAttempts;
    document.getElementById('remainingAttempts').textContent = remainingAttempts;
    
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
    
    // Load quiz history
    loadQuizHistory(uid, itQuizHistory, accountsQuizHistory);
    
    // Load leaderboard from Firebase
    await loadLeaderboard();
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

async function loadLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    leaderboardContainer.innerHTML = '<p style="text-align: center;">Loading leaderboard...</p>';
    
    try {
        // Get top scores from Firebase
        const leaderboardRef = collection(db, 'leaderboard');
        const q = query(leaderboardRef, orderBy('percentage', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            leaderboardContainer.innerHTML = '<p style="text-align: center; color: #666;">No leaderboard data yet.</p>';
            return;
        }
        
        leaderboardContainer.innerHTML = '';
        let rank = 1;
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            
            leaderboardItem.innerHTML = `
                <span class="leaderboard-rank">${medal} #${rank}</span>
                <span class="leaderboard-name">${data.name} ${data.uid === currentUser.uid ? '(You)' : ''}</span>
                <span class="leaderboard-score">${data.percentage}%</span>
            `;
            
            leaderboardContainer.appendChild(leaderboardItem);
            rank++;
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        leaderboardContainer.innerHTML = '<p style="text-align: center; color: red;">Failed to load leaderboard.</p>';
    }
}

window.goToQuizSelection = function() {
    window.location.href = 'quiz-selection.html';
};

window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
