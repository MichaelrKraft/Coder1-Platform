// React Bits Components Button - Bottom Left with Gap
(function() {
    'use strict';
    
    console.log('🎨 React Bits Button: Initializing...');
    
    function addReactBitsButton() {
        // Check if button already exists
        if (document.getElementById('react-bits-button')) {
            return;
        }
        
        // Create the button
        const button = document.createElement('button');
        button.id = 'react-bits-button';
        button.className = 'react-bits-button';
        button.innerHTML = '<span class="icon">🎨</span> React Bits Components';
        
        // Style the button - smaller size with responsive positioning
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 6px 12px;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        // Hide icon on very small screens
        if (window.innerWidth < 768) {
            button.innerHTML = 'React Bits';
        }
        
        // Hover effect
        button.onmouseover = function() {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
        };
        
        button.onmouseout = function() {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
        };
        
        // Click handler
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎨 React Bits button clicked!');
            console.log('Current location:', window.location.href);
            console.log('Navigating to:', window.location.origin + window.location.pathname.replace(/[^\/]*$/, '') + 'react-bits-standalone.html');
            
            // Use absolute path based on current location
            const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            const targetUrl = basePath + '/react-bits-working.html';
            
            console.log('Target URL:', targetUrl);
            window.location.href = targetUrl;
        };
        
        // Add to body
        document.body.appendChild(button);
        
        // Ensure proper spacing from settings
        adjustSpacing();
    }
    
    function adjustSpacing() {
        const button = document.getElementById('react-bits-button');
        if (!button) return;
        
        // On small screens, position button differently
        if (window.innerHeight < 700) {
            // Move to top-left on very small screens to avoid overlap
            button.style.bottom = 'auto';
            button.style.top = '20px';
            button.style.left = '20px';
            return;
        }
        
        // Find settings section or settings buttons
        const settingsSection = document.querySelector('.settings-section');
        const settingsButtons = document.querySelectorAll('[class*="settings"], [id*="settings"]');
        
        // Find the topmost settings element
        let topSettingsY = window.innerHeight;
        
        if (settingsSection) {
            const rect = settingsSection.getBoundingClientRect();
            topSettingsY = Math.min(topSettingsY, rect.top);
        }
        
        settingsButtons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.5) { // Only consider bottom half
                topSettingsY = Math.min(topSettingsY, rect.top);
            }
        });
        
        // Position React Bits button with gap
        const desiredGap = 60; // Smaller gap for small screens
        const buttonHeight = 35; // Approximate button height
        
        // Calculate position from bottom
        const bottomPosition = Math.max(20, window.innerHeight - topSettingsY + desiredGap);
        
        // Reset positioning
        button.style.top = 'auto';
        button.style.bottom = bottomPosition + 'px';
        button.style.left = '20px';
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addReactBitsButton);
    } else {
        addReactBitsButton();
    }
    
    // Re-check periodically to ensure button stays visible
    setInterval(function() {
        addReactBitsButton();
        adjustSpacing();
    }, 2000);
    
    // Also listen for window resize
    window.addEventListener('resize', adjustSpacing);
    
    console.log('🎨 React Bits Button: Script loaded');
})();