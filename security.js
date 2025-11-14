// Security measures to prevent cheating
(function() {
    'use strict';
    
    // Warning counters - limit alerts to 2 times only
    let warningCounts = {
        screenshot: 0,
        print: 0,
        copy: 0,
        devtools: 0,
        tabSwitch: 0
    };
    
    const MAX_WARNINGS = 2;
    
    function showWarning(type, message) {
        if (warningCounts[type] < MAX_WARNINGS) {
            warningCounts[type]++;
            alert(`⚠️ Warning ${warningCounts[type]}/${MAX_WARNINGS}: ${message}`);
            
            if (warningCounts[type] === MAX_WARNINGS) {
                console.warn(`Final warning for ${type}. Further attempts will be silently logged.`);
            }
        } else {
            // Silent logging after max warnings
            console.warn(`${type} attempt detected (warning limit reached)`);
        }
    }
    
    // Prevent right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent keyboard shortcuts for screenshots and developer tools
    document.addEventListener('keydown', function(e) {
        // Prevent F12 (Developer Tools) - no alert, just block
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+I (Developer Tools) - no alert, just block
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+Shift+J (Console) - no alert, just block
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+U (View Source) - no alert, just block
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        
        // Prevent Ctrl+S (Save Page) - no alert, just block
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        
        // Prevent PrintScreen - show warning
        if (e.keyCode === 44) {
            e.preventDefault();
            showWarning('screenshot', 'Screenshots are not allowed during the quiz!');
            return false;
        }
        
        // Prevent Ctrl+P (Print) - show warning
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            showWarning('print', 'Printing is not allowed during the quiz!');
            return false;
        }
        
        // Prevent Windows Key + Shift + S (Windows Screenshot Tool) - show warning
        if (e.shiftKey && e.keyCode === 83 && (e.metaKey || e.key === 'Meta')) {
            e.preventDefault();
            showWarning('screenshot', 'Screenshots are not allowed during the quiz!');
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
    
    // Detect when user switches tabs or minimizes window - limited warnings
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && window.location.pathname.includes('quiz.html')) {
            showWarning('tabSwitch', 'Tab switching detected! This activity is being monitored.');
        }
    });
    
    // Detect when window loses focus - limited warnings
    window.addEventListener('blur', function() {
        if (window.location.pathname.includes('quiz.html') && warningCounts.tabSwitch < MAX_WARNINGS) {
            console.warn('Window focus lost during quiz - logged');
        }
    });
    
    // Prevent copying text - show warning
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showWarning('copy', 'Copying text is not allowed!');
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
    
    // Detect if developer tools are open - NO ALERTS, just silent logging
    const devtools = /./;
    devtools.toString = function() {
        if (warningCounts.devtools < MAX_WARNINGS) {
            warningCounts.devtools++;
            console.warn(`Developer tools detected (${warningCounts.devtools}/${MAX_WARNINGS})`);
        }
        return 'devtools';
    };
    
    // Check periodically - silent
    setInterval(function() {
        console.log(devtools);
    }, 3000);
    
})();
