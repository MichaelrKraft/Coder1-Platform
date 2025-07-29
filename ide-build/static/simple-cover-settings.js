// Simple Cover Settings - Add a background div to cover duplicate header
(function() {
    console.log('🎯 Simple Cover Settings: Starting...');
    
    function addCover() {
        // Only add cover if it doesn't exist
        if (document.getElementById('settings-cover')) {
            return;
        }
        
        // Find our settings section
        const settingsSection = document.querySelector('.settings-section');
        if (!settingsSection) {
            console.log('Settings section not found, retrying...');
            return;
        }
        
        // Get the position of our settings section
        const rect = settingsSection.getBoundingClientRect();
        
        // Create a cover div
        const cover = document.createElement('div');
        cover.id = 'settings-cover';
        cover.style.cssText = `
            position: fixed;
            left: ${rect.left - 50}px;
            top: ${rect.top - 200}px;
            width: ${rect.width + 100}px;
            height: 180px;
            background: #1a1b26;
            z-index: 9998;
            pointer-events: none;
        `;
        
        // Add to body
        document.body.appendChild(cover);
        console.log('✅ Added settings cover');
    }
    
    // Run after our settings section is positioned
    setTimeout(addCover, 1000);
    setTimeout(addCover, 2000);
    setTimeout(addCover, 3000);
    
    console.log('🎯 Simple Cover Settings: Loaded');
})();