// Ensure Special Views Work - Aggressive Override Script
console.log('🛡️ Ensure Special Views Script - Starting aggressive override...');

// This script ensures that coder1-special-views work properly by:
// 1. Disabling conflicting handlers
// 2. Re-establishing proper button handlers
// 3. Overriding any functions that might interfere

(function() {
    'use strict';
    
    // Wait for all scripts to load
    function ensureSpecialViews() {
        console.log('🔍 Checking for special views function...');
        
        if (!window.showSpecialView) {
            console.error('❌ showSpecialView not found! Waiting...');
            setTimeout(ensureSpecialViews, 500);
            return;
        }
        
        console.log('✅ Found showSpecialView function');
        
        // Override any conflicting functions
        window.startSupervision = function() {
            console.log('🔄 Redirecting startSupervision to showSpecialView');
            window.showSpecialView('supervision');
        };
        
        window.startSleepMode = function() {
            console.log('🔄 Redirecting startSleepMode to showSpecialView');
            window.showSpecialView('sleep-mode');
        };
        
        window.startInfiniteLoop = function() {
            console.log('🔄 Redirecting startInfiniteLoop to showSpecialView');
            window.showSpecialView('infinite-loop');
        };
        
        window.startParallelAgents = function() {
            console.log('🔄 Redirecting startParallelAgents to showSpecialView');
            window.showSpecialView('parallel-agents');
        };
        
        // Force override all terminal buttons
        function overrideAllButtons() {
            console.log('🎯 Force overriding all terminal buttons...');
            
            const buttonMappings = {
                'Supervision': 'supervision',
                'Sleep Mode': 'sleep-mode',
                'Infinite': 'infinite-loop',
                'Parallel Agents': 'parallel-agents'
            };
            
            Object.entries(buttonMappings).forEach(([title, viewType]) => {
                // Find all buttons that might match
                const selectors = [
                    `button[title="${title}"]`,
                    `button[title*="${title}"]`,
                    `button:contains("${title}")` // jQuery-style, might not work
                ];
                
                selectors.forEach(selector => {
                    try {
                        const buttons = document.querySelectorAll(selector);
                        buttons.forEach(button => {
                            // Remove ALL event listeners by cloning
                            const newButton = button.cloneNode(true);
                            button.parentNode.replaceChild(newButton, button);
                            
                            // Add our handler
                            newButton.onclick = function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                console.log(`✨ Special view button clicked: ${title}`);
                                window.showSpecialView(viewType);
                                return false;
                            };
                            
                            // Also add as event listener
                            newButton.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                console.log(`✨ Special view button clicked (listener): ${title}`);
                                window.showSpecialView(viewType);
                                return false;
                            }, true); // Use capture phase
                            
                            console.log(`✅ Force overrode button: ${title}`);
                        });
                    } catch (e) {
                        // Ignore selector errors
                    }
                });
                
                // Also try finding by text content
                const allButtons = document.querySelectorAll('button');
                allButtons.forEach(button => {
                    const text = button.textContent?.trim() || '';
                    const buttonTitle = button.getAttribute('title') || '';
                    
                    if (text.includes(title) || buttonTitle.includes(title)) {
                        // Clone to remove all handlers
                        const newButton = button.cloneNode(true);
                        button.parentNode.replaceChild(newButton, button);
                        
                        newButton.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            console.log(`✨ Special view button clicked by text: ${title}`);
                            window.showSpecialView(viewType);
                            return false;
                        };
                        
                        console.log(`✅ Force overrode button by text: ${title}`);
                    }
                });
            });
        }
        
        // Run override immediately
        overrideAllButtons();
        
        // Run again after a delay to catch late-loading buttons
        setTimeout(overrideAllButtons, 1000);
        setTimeout(overrideAllButtons, 2000);
        setTimeout(overrideAllButtons, 5000);
        
        // Also run periodically to catch any new buttons
        setInterval(overrideAllButtons, 10000);
        
        // Test function for debugging
        window.testSpecialViews = function() {
            console.log('🧪 Testing special views...');
            const views = ['supervision', 'sleep-mode', 'infinite-loop', 'parallel-agents'];
            let index = 0;
            
            function showNext() {
                if (index < views.length) {
                    console.log(`🧪 Showing: ${views[index]}`);
                    window.showSpecialView(views[index]);
                    index++;
                    setTimeout(() => {
                        const overlay = document.querySelector('.coder1-special-view-overlay');
                        if (overlay) overlay.remove();
                        setTimeout(showNext, 500);
                    }, 2000);
                } else {
                    console.log('✅ Test complete!');
                }
            }
            
            showNext();
        };
        
        console.log('🛡️ Special views protection active!');
        console.log('💡 Run window.testSpecialViews() to test all views');
    }
    
    // Start the ensure process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureSpecialViews);
    } else {
        ensureSpecialViews();
    }
})();