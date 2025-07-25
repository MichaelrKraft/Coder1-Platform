// Force Special Views Override - Ensures coder1-special-views-v2.js functions work
(function() {
    'use strict';
    
    console.log('🚀 Special Views Force Override - Starting...');
    
    // Function to override buttons with correct special view calls
    function forceOverrideButtons() {
        const buttonMappings = [
            { selector: 'button[title="Supervision"]', viewType: 'supervision', label: 'Supervision' },
            { selector: 'button[title="Sleep Mode"]', viewType: 'sleep-mode', label: 'Sleep Mode' },
            { selector: 'button[title="Infinite Loop"]', viewType: 'infinite-loop', label: 'Infinite Loop' },
            { selector: 'button[title="Infinite"]', viewType: 'infinite-loop', label: 'Infinite' },
            { selector: 'button[title="Parallel Agents"]', viewType: 'parallel-agents', label: 'Parallel Agents' }
        ];
        
        buttonMappings.forEach(mapping => {
            const buttons = document.querySelectorAll(mapping.selector);
            buttons.forEach(button => {
                // Remove all existing event listeners by cloning
                const newButton = button.cloneNode(true);
                
                // Add our handler
                newButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    console.log(`🎯 ${mapping.label} button clicked - calling showSpecialView('${mapping.viewType}')`);
                    
                    if (typeof window.showSpecialView === 'function') {
                        window.showSpecialView(mapping.viewType);
                    } else {
                        console.error('❌ showSpecialView function not found! Waiting for it to load...');
                        // Try again after a delay
                        setTimeout(() => {
                            if (typeof window.showSpecialView === 'function') {
                                window.showSpecialView(mapping.viewType);
                            } else {
                                console.error('❌ showSpecialView still not available');
                            }
                        }, 500);
                    }
                    
                    return false;
                };
                
                // Also add addEventListener for extra safety
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }, true);
                
                // Replace the button
                if (button.parentNode) {
                    button.parentNode.replaceChild(newButton, button);
                    console.log(`✅ Overrode ${mapping.label} button`);
                }
            });
        });
        
        // Also check for buttons by text content
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            const text = button.textContent?.trim() || '';
            const title = button.getAttribute('title') || '';
            
            let viewType = null;
            if (text.includes('Supervision') || title.includes('Supervision')) {
                viewType = 'supervision';
            } else if (text.includes('Sleep') || title.includes('Sleep')) {
                viewType = 'sleep-mode';
            } else if (text.includes('Infinite') || title.includes('Infinite')) {
                viewType = 'infinite-loop';
            } else if (text.includes('Parallel') || title.includes('Parallel')) {
                viewType = 'parallel-agents';
            }
            
            if (viewType && !button.hasAttribute('data-force-override')) {
                button.setAttribute('data-force-override', 'true');
                button.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🎯 Button clicked (by text) - calling showSpecialView('${viewType}')`);
                    if (typeof window.showSpecialView === 'function') {
                        window.showSpecialView(viewType);
                    }
                    return false;
                };
            }
        });
    }
    
    // Wait for showSpecialView to be available
    function waitForSpecialViews() {
        if (typeof window.showSpecialView === 'function') {
            console.log('✅ showSpecialView function is available');
            forceOverrideButtons();
            
            // Continue checking periodically
            setInterval(forceOverrideButtons, 2000);
        } else {
            console.log('⏳ Waiting for showSpecialView function...');
            setTimeout(waitForSpecialViews, 100);
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSpecialViews);
    } else {
        waitForSpecialViews();
    }
    
    // Also listen for any new buttons added dynamically
    const observer = new MutationObserver(() => {
        forceOverrideButtons();
    });
    
    // Start observing when body is available
    const startObserving = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('✅ Started observing for new buttons');
        } else {
            setTimeout(startObserving, 100);
        }
    };
    startObserving();
    
})();