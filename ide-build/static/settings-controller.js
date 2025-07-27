// Settings Controller - Manage settings panel visibility for special views
(function() {
    console.log('⚙️ Settings Controller Loading...');
    
    let specialViewActive = false;
    
    // Function to hide settings panel
    function hideSettings() {
        const settings = document.querySelector('.settings-section');
        if (settings) {
            settings.style.display = 'none';
            console.log('✅ Settings hidden');
        }
    }
    
    // Function to show settings panel
    function showSettings() {
        const settings = document.querySelector('.settings-section');
        if (settings && !specialViewActive) {
            settings.style.display = '';
            console.log('✅ Settings shown');
        }
    }
    
    // Monitor for special view buttons
    function monitorButtons() {
        const specialViewButtons = [
            'Parallel Agents',
            'Sleep Mode', 
            'Supervision',
            'Infinite Loop'
        ];
        
        document.addEventListener('click', function(e) {
            const target = e.target;
            
            // Check if it's a special view button
            if (target.tagName === 'BUTTON') {
                const buttonText = target.textContent.trim();
                
                for (const btnName of specialViewButtons) {
                    if (buttonText.includes(btnName)) {
                        console.log(`🎯 Special view button clicked: ${btnName}`);
                        specialViewActive = true;
                        
                        // Hide settings after a small delay to ensure view loads
                        setTimeout(hideSettings, 100);
                        setTimeout(hideSettings, 500);
                        setTimeout(hideSettings, 1000);
                        
                        break;
                    }
                }
            }
            
            // Check for close buttons
            if (target.classList.contains('special-view-close') || 
                target.textContent.includes('Close') ||
                target.textContent.includes('Stop All Agents')) {
                console.log('🎯 Close button clicked');
                specialViewActive = false;
                setTimeout(showSettings, 100);
            }
        });
    }
    
    // Monitor for special view containers
    function monitorDOM() {
        const observer = new MutationObserver((mutations) => {
            // Check if special view is present
            const specialView = document.querySelector('.coder1-special-view-container, .special-view-overlay, .special-view-container');
            
            if (specialView) {
                if (!specialViewActive) {
                    console.log('🎯 Special view detected in DOM');
                    specialViewActive = true;
                    hideSettings();
                }
            } else {
                if (specialViewActive) {
                    console.log('🎯 Special view removed from DOM');
                    specialViewActive = false;
                    showSettings();
                }
            }
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Initialize
    function initialize() {
        monitorButtons();
        monitorDOM();
        
        // Also check periodically
        setInterval(() => {
            if (specialViewActive) {
                hideSettings();
            }
        }, 500);
    }
    
    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    console.log('✅ Settings Controller Ready');
})();