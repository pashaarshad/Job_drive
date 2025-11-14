// Security measures to prevent cheating
(function() {
    'use strict';
    
    // Prevent right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent keyboard shortcuts for screenshots and developer tools
    document.addEventListener('keydown', function(e) {
        // Prevent F12 (Developer Tools)
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        
        // Prevent PrintScreen
        if (e.keyCode === 44) {
            e.preventDefault();
            alert('Screenshots are not allowed during the quiz!');
            return false;
        }
        
        // Prevent Ctrl+P (Print)
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            alert('Printing is not allowed during the quiz!');
            return false;
        }
        
        // Prevent Windows Key + Shift + S (Windows Screenshot Tool)
        if (e.shiftKey && e.keyCode === 83 && (e.metaKey || e.key === 'Meta')) {
            e.preventDefault();
            alert('Screenshots are not allowed during the quiz!');
            return false;
        }
    });
    
    // Prevent drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent text selection on specific elements
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Detect when user switches tabs or minimizes window
    let quizWarningShown = false;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && window.location.pathname.includes('quiz.html')) {
            if (!quizWarningShown) {
                quizWarningShown = true;
                alert('Warning: Tab switching detected! This activity is being monitored.');
            }
        }
    });
    
    // Detect when window loses focus
    window.addEventListener('blur', function() {
        if (window.location.pathname.includes('quiz.html') && !quizWarningShown) {
            quizWarningShown = true;
            console.log('Warning: Window focus lost during quiz');
        }
    });
    
    // Prevent copying text
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        alert('Copying text is not allowed!');
        return false;
    });
    
    // Prevent cutting text
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable inspect element on all elements
    const allElements = document.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
        allElements[i].addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Watermark to discourage screenshots
    function addWatermark() {
        const watermark = document.createElement('div');
        watermark.style.position = 'fixed';
        watermark.style.bottom = '10px';
        watermark.style.right = '10px';
        watermark.style.fontSize = '12px';
        watermark.style.color = 'rgba(255, 255, 255, 0.3)';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '9999';
        watermark.textContent = `User: ${localStorage.getItem('current_user_email') || 'Anonymous'} | ${new Date().toLocaleString()}`;
        document.body.appendChild(watermark);
    }
    
    // Add watermark when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addWatermark);
    } else {
        addWatermark();
    }
    
    // Detect if developer tools are open
    const devtools = /./;
    devtools.toString = function() {
        quizWarningShown = true;
        alert('Developer tools detected! This activity is being monitored.');
        return 'Developer tools detected';
    };
    
    // Check periodically
    setInterval(function() {
        console.log(devtools);
    }, 1000);
    
})();
