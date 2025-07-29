// Simple Button Positioning - Just position buttons without modifying Explorer
(function() {
    console.log('🔧 Simple Button Positioning: Initializing...');
    
    function positionButtons() {
        const settingsSection = document.querySelector('.settings-section');
        const reactBitsButton = document.getElementById('react-bits-button');
        
        if (settingsSection) {
            // Keep settings in default position
            settingsSection.style.position = 'fixed';
            settingsSection.style.bottom = '100px';
            settingsSection.style.left = '20px';
            settingsSection.style.zIndex = '1000';
        }
        
        if (reactBitsButton) {
            // Position React Bits button at bottom
            reactBitsButton.style.position = 'fixed';
            reactBitsButton.style.bottom = '20px';
            reactBitsButton.style.left = '20px';
            reactBitsButton.style.zIndex = '999';
            
            // Ensure visibility
            reactBitsButton.style.display = 'block';
            reactBitsButton.style.visibility = 'visible';
            reactBitsButton.style.opacity = '1';
        }
    }
    
    // Run positioning
    positionButtons();
    setTimeout(positionButtons, 500);
    setTimeout(positionButtons, 1000);
    
    console.log('🔧 Simple Button Positioning: Complete');
})();