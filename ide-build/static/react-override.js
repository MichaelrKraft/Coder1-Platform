// React Override - Properly intercept React's button clicks
(function() {
    console.log('🎯 React Override Loading...');
    
    let interceptActive = false;
    
    // Function to intercept React props
    function interceptReactProps(element) {
        if (!element || typeof element !== 'object') return;
        
        // Look for React's internal props
        const keys = Object.keys(element);
        const reactPropsKey = keys.find(key => 
            key.startsWith('__reactProps') || 
            key.startsWith('__reactEventHandlers')
        );
        
        if (reactPropsKey && element[reactPropsKey]) {
            const props = element[reactPropsKey];
            
            // Check if this is a Parallel Agents button
            if (props.children === 'Parallel Agents' || 
                (props.className && props.className.includes('parallel-agents'))) {
                
                console.log('Found React Parallel Agents button, intercepting...');
                
                // Store original onClick
                const originalOnClick = props.onClick;
                
                // Replace with our handler
                props.onClick = function(e) {
                    console.log('Intercepted Parallel Agents click!');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Hide settings
                    const settings = document.querySelector('.settings-section');
                    if (settings) {
                        settings.style.display = 'none';
                    }
                    
                    // Show our simple overlay
                    showSimpleOverlay('parallel-agents');
                    
                    // Don't call original React handler
                    return false;
                };
            }
        }
        
        // Also check children
        if (element.children) {
            for (let child of element.children) {
                interceptReactProps(child);
            }
        }
    }
    
    // Simple overlay function
    function showSimpleOverlay(type) {
        // Remove existing
        const existing = document.getElementById('react-override-overlay');
        if (existing) existing.remove();
        
        // Create new overlay
        const overlay = document.createElement('div');
        overlay.id = 'react-override-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #1a1a1a;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Inter, sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h1 style="font-size: 48px; margin-bottom: 20px;">🤖 Parallel Agents</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">Settings are now hidden!</p>
                <button onclick="
                    document.getElementById('react-override-overlay').remove(); 
                    const s = document.querySelector('.settings-section'); 
                    if(s) s.style.display = '';"
                    style="padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    // Intercept at the event capture phase
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check if it's a button with Parallel Agents
        if (target.tagName === 'BUTTON' && 
            (target.textContent.includes('Parallel Agents') || 
             target.className.includes('parallel-agents'))) {
            
            console.log('Captured Parallel Agents click at document level');
            e.stopPropagation();
            e.preventDefault();
            
            // Hide settings
            const settings = document.querySelector('.settings-section');
            if (settings) {
                settings.style.display = 'none';
            }
            
            // Show overlay
            showSimpleOverlay('parallel-agents');
            
            return false;
        }
    }, true); // Use capture phase
    
    // Also intercept other special view buttons
    const buttonMappings = {
        'Supervision': 'supervision',
        'Sleep Mode': 'sleep-mode',
        'Infinite': 'infinite-loop'
    };
    
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.tagName === 'BUTTON') {
            for (const [text, type] of Object.entries(buttonMappings)) {
                if (target.textContent.includes(text) || target.title?.includes(text)) {
                    console.log(`Captured ${text} click`);
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Hide settings
                    const settings = document.querySelector('.settings-section');
                    if (settings) {
                        settings.style.display = 'none';
                    }
                    
                    // For now, just show alert
                    alert(`${text} view intercepted - settings hidden`);
                    
                    return false;
                }
            }
        }
    }, true);
    
    // Continuously hide settings when our overlay is present
    setInterval(() => {
        const overlay = document.getElementById('react-override-overlay');
        if (overlay) {
            const settings = document.querySelector('.settings-section');
            if (settings && settings.style.display !== 'none') {
                settings.style.display = 'none';
            }
        }
    }, 100);
    
    console.log('✅ React Override Ready - Click interception active');
})();