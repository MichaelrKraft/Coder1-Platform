// Gentle Terminal Width - Subtle adjustments without breaking layout
(function() {
    'use strict';
    
    console.log('📏 Gentle Terminal Width script loading...');
    
    function adjustTerminalWidth() {
        console.log('Checking terminal width...');
        
        // Look for splitter/resizer elements
        const splitters = document.querySelectorAll('[class*="sash"], [class*="Sash"], .splitter, [class*="splitter"]');
        
        splitters.forEach((splitter, index) => {
            const parent = splitter.parentElement;
            if (!parent) return;
            
            const parentWidth = parent.offsetWidth;
            const splitterLeft = splitter.offsetLeft;
            const currentPercent = (splitterLeft / parentWidth) * 100;
            
            // Only adjust if it's around 50% (meaning it's probably the preview splitter)
            if (currentPercent > 45 && currentPercent < 55) {
                console.log(`Found splitter at ${currentPercent.toFixed(1)}%, adjusting to 75%`);
                
                const newPosition = parentWidth * 0.75; // 75% instead of aggressive 80%
                splitter.style.left = `${newPosition}px`;
                
                // Trigger a gentle resize event
                const event = new MouseEvent('mousemove', {
                    clientX: newPosition,
                    bubbles: true
                });
                splitter.dispatchEvent(event);
            }
        });
        
        // Look for panels that might be preview panels (right-most panels)
        const allPanels = document.querySelectorAll('[class*="panel"], [class*="Panel"], [class*="pane"], [class*="Pane"]');
        
        allPanels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            
            // If panel is on the right side and taking significant space
            if (rect.right > windowWidth * 0.6 && rect.width > windowWidth * 0.3) {
                const currentWidthPercent = (rect.width / windowWidth) * 100;
                
                if (currentWidthPercent > 35) {
                    console.log(`Adjusting right panel from ${currentWidthPercent.toFixed(1)}% to 25%`);
                    panel.style.width = '25%';
                    panel.style.maxWidth = '25%';
                    panel.style.flex = '0 0 25%';
                }
            }
        });
        
        console.log('✅ Terminal width adjustment completed');
    }
    
    // Run after page loads
    setTimeout(adjustTerminalWidth, 2000);
    setTimeout(adjustTerminalWidth, 4000);
    
    // Watch for resize events
    window.addEventListener('resize', () => {
        setTimeout(adjustTerminalWidth, 1000);
    });
    
    console.log('✅ Gentle Terminal Width script initialized');
})();