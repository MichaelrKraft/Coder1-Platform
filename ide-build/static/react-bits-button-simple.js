// React Bits Button - Simplified Version
console.log('🎨 React Bits Button: Loading simple version...');

// Add button immediately
function addReactBitsButton() {
    // Remove any existing button
    const existing = document.getElementById('react-bits-button');
    if (existing) {
        existing.remove();
    }
    
    // Create button
    const button = document.createElement('button');
    button.id = 'react-bits-button';
    button.innerHTML = '🎨 React Bits';
    
    // Simple inline styles - locked to bottom left
    button.style.position = 'fixed';
    button.style.bottom = '20px'; // Bottom with proper spacing
    button.style.left = '20px';
    button.style.right = 'auto';
    button.style.top = 'auto';
    button.style.padding = '8px 16px';
    button.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.fontSize = '14px';
    button.style.fontWeight = '500';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
    button.style.display = 'block';
    button.style.visibility = 'visible';
    button.style.opacity = '1';
    
    // Hover effects
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
        console.log('🎨 React Bits clicked!');
        window.location.href = './react-bits-dual-preview.html';
    };
    
    // Add to body
    document.body.appendChild(button);
    console.log('✅ React Bits button added');
    
    // Let the explorer-scrollable script handle positioning
    console.log('✅ React Bits button will be positioned by explorer-scrollable script');
}

// Try multiple times to ensure button is added
setTimeout(addReactBitsButton, 100);
setTimeout(addReactBitsButton, 500);
setTimeout(addReactBitsButton, 1000);
setTimeout(addReactBitsButton, 2000);

// Also add on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addReactBitsButton);
} else {
    addReactBitsButton();
}

console.log('🎨 React Bits Button: Script loaded');