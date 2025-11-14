// Quiz Page Logic
import { auth, onAuthStateChanged, db, doc, setDoc, getDoc, updateDoc } from './firebase-config.js';
import quizQuestions from './questions.js';

let currentUser = null;
let currentQuizType = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = null;
let timerInterval = null;

// Check authentication and load quiz (including emergency login)
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        currentQuizType = sessionStorage.getItem('selectedQuiz');
        
        if (!currentQuizType) {
            window.location.href = 'quiz-selection.html';
            return;
        }
        
        // Check if this quiz is already completed
        const quizCompleted = localStorage.getItem(`user_${user.uid}_quiz_${currentQuizType}_completed`) === 'true';
        if (quizCompleted) {
            alert('You have already completed this quiz!');
            window.location.href = 'dashboard.html';
            return;
        }
        
        loadQuiz();
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
            
            currentQuizType = sessionStorage.getItem('selectedQuiz');
            
            if (!currentQuizType) {
                window.location.href = 'quiz-selection.html';
                return;
            }
            
            // Check if this quiz is already completed
            const quizCompleted = localStorage.getItem(`user_${emergencyUserId}_quiz_${currentQuizType}_completed`) === 'true';
            if (quizCompleted) {
                alert('You have already completed this quiz!');
                window.location.href = 'dashboard.html';
                return;
            }
            
            loadQuiz();
        } else {
            window.location.href = 'login.html';
        }
    }
});

function loadQuiz() {
    // Get questions based on quiz type
    questions = quizQuestions[currentQuizType];
    userAnswers = new Array(questions.length).fill(null);
    
    // Set quiz title
    const title = currentQuizType === 'it' ? 'IT Quiz - Java MCQs' : 'Accountancy Quiz';
    document.getElementById('quizTitle').textContent = title;
    
    // Initialize timer
    startTime = Date.now();
    startTimer();
    
    // Create question palette
    createQuestionPalette();
    
    // Load first question
    loadQuestion(0);
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function createQuestionPalette() {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const paletteItem = document.createElement('div');
        paletteItem.className = 'palette-item';
        paletteItem.textContent = i + 1;
        paletteItem.onclick = () => loadQuestion(i);
        palette.appendChild(paletteItem);
    }
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Update question counter
    document.getElementById('questionCounter').textContent = 
        `Question ${index + 1} of ${questions.length}`;
    
    // Display question
    document.getElementById('questionText').textContent = question.question;
    
    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (userAnswers[index] === optionIndex) {
            optionDiv.classList.add('selected');
        }
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(optionIndex);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index === questions.length - 1 ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = index === questions.length - 1 ? 'block' : 'none';
    
    // Update palette
    updatePalette();
}

function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === optionIndex) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    updatePalette();
}

function updatePalette() {
    const paletteItems = document.querySelectorAll('.palette-item');
    paletteItems.forEach((item, idx) => {
        item.classList.remove('answered', 'current');
        if (userAnswers[idx] !== null) {
            item.classList.add('answered');
        }
        if (idx === currentQuestionIndex) {
            item.classList.add('current');
        }
    });
}

window.previousQuestion = function() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
};

window.nextQuestion = function() {
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
};

window.submitQuiz = async function() {
    // Check if all questions are answered
    const unanswered = userAnswers.filter(ans => ans === null).length;
    
    if (unanswered > 0) {
        const confirm = window.confirm(
            `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
        );
        if (!confirm) return;
    }
    
    // Final confirmation before submission
    const finalConfirm = window.confirm(
        '⚠️ Are you sure you want to submit your quiz? You cannot change your answers after submission.'
    );
    if (!finalConfirm) return;
    
    // Show loading animation
    showSubmitLoading();
    
    // Stop timer
    clearInterval(timerInterval);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate score
    let score = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correct) {
            score++;
        }
    });
    
    const percentage = parseFloat(((score / questions.length) * 100).toFixed(2));
    
    // Mark this quiz as completed
    localStorage.setItem(`user_${currentUser.uid}_quiz_${currentQuizType}_completed`, 'true');
    
    const totalAttempts = parseInt(localStorage.getItem(`user_${currentUser.uid}_total`) || '0');
    localStorage.setItem(`user_${currentUser.uid}_total`, (totalAttempts + 1).toString());
    
    // Store quiz result in local storage
    const quizKey = `user_${currentUser.uid}_quiz_${currentQuizType}`;
    const quizHistory = JSON.parse(localStorage.getItem(quizKey) || '[]');
    const quizResult = {
        score: score,
        total: questions.length,
        percentage: percentage,
        timeTaken: timeTaken,
        date: new Date().toISOString(),
        answers: userAnswers
    };
    quizHistory.push(quizResult);
    localStorage.setItem(quizKey, JSON.stringify(quizHistory));
    
    // Update Firebase
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const quizScores = userData.quizScores || { it: [], accounts: [] };
            
            quizScores[currentQuizType].push(quizResult);
            
            await updateDoc(userRef, {
                totalAttempts: totalAttempts + 1,
                quizScores: quizScores,
                lastAttemptDate: new Date()
            });
        }
        
        // Store in leaderboard
        const leaderboardRef = doc(db, 'leaderboard', `${currentUser.uid}_${Date.now()}`);
        await setDoc(leaderboardRef, {
            uid: currentUser.uid,
            name: localStorage.getItem(`user_${currentUser.uid}_name`) || currentUser.displayName || 'Unknown User',
            email: currentUser.email || 'no-email@local',
            quizType: currentQuizType,
            score: parseInt(score),
            total: parseInt(questions.length),
            percentage: parseFloat(percentage),
            timeTaken: parseInt(timeTaken),
            date: new Date()
        });
    } catch (error) {
        console.error('Error updating Firebase:', error);
    }
    
    // Store results in session storage for results page
    sessionStorage.setItem('lastQuizScore', score.toString());
    sessionStorage.setItem('lastQuizTotal', questions.length.toString());
    sessionStorage.setItem('lastQuizPercentage', percentage.toString());
    sessionStorage.setItem('lastQuizTime', timeTaken.toString());
    
    // Wait for 5 seconds before redirecting
    setTimeout(() => {
        hideSubmitLoading();
        window.location.href = 'results.html';
    }, 5000);
};

function showSubmitLoading() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'submitLoadingOverlay';
    overlay.innerHTML = `
        <div class="submit-loading-content">
            <div class="submit-spinner"></div>
            <h2>Submitting Your Quiz...</h2>
            <p>Please wait while we process your responses</p>
            <div class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideSubmitLoading() {
    const overlay = document.getElementById('submitLoadingOverlay');
    if (overlay) {
        overlay.remove();
    }
};
