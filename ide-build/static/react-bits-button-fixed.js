// React Bits Components Button - Fixed Positioning
(function() {
    'use strict';
    
    console.log('🎨 React Bits Button: Initializing fixed version...');
    
    function addReactBitsButton() {
        // Check if button already exists
        if (document.getElementById('react-bits-button')) {
            return;
        }
        
        // Create the button
        const button = document.createElement('button');
        button.id = 'react-bits-button';
        button.className = 'react-bits-button';
        
        // Check screen size for text
        if (window.innerWidth < 1200) {
            button.innerHTML = 'React Bits';
        } else {
            button.innerHTML = '<span class="icon">🎨</span> React Bits';
        }
        
        // Style the button with fixed positioning to avoid overlap
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
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
            z-index: 999;
        `;
        
        // Hover effect
        button.onmouseover = function() {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
        };
        
        button.onmouseout = function() {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
        };
        
        // Click handler
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎨 React Bits button clicked!');
            
            // Use absolute path based on current location
            const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            const targetUrl = basePath + '/react-bits-simple.html';
            
            console.log('Target URL:', targetUrl);
            window.location.href = targetUrl;
        };
        
        // Add to body
        document.body.appendChild(button);
        
        // Adjust position based on viewport
        adjustButtonPosition();
    }
    
    function adjustButtonPosition() {
        const button = document.getElementById('react-bits-button');
        if (!button) return;
        
        // Get viewport dimensions
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        
        // On small laptops, position in top-right to avoid settings overlap
        if (vh < 700 || vw < 1400) {
            button.style.bottom = 'auto';
            button.style.top = '20px';
            button.style.right = '20px';
            button.style.left = 'auto';
        } else {
            // On larger screens, keep at bottom-right
            button.style.top = 'auto';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.left = 'auto';
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addReactBitsButton);
    } else {
        addReactBitsButton();
    }
    
    // Listen for window resize
    window.addEventListener('resize', adjustButtonPosition);
    
    console.log('🎨 React Bits Button: Script loaded (fixed version)');
})();