// Simple Special Views - Minimal implementation to avoid React conflicts
(function() {
    console.log('🎯 Simple Special Views Loading...');
    
    // Create a simple overlay function that doesn't interfere with React
    window.simpleSpecialView = function(type) {
        console.log(`Opening ${type} view...`);
        
        // Remove any existing overlay
        const existing = document.getElementById('simple-special-overlay');
        if (existing) existing.remove();
        
        // Hide settings immediately
        const settings = document.querySelector('.settings-section');
        if (settings) {
            settings.style.display = 'none';
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'simple-special-overlay';
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
        
        // Add content based on type
        let content = '';
        switch(type) {
            case 'parallel-agents':
                content = `
                    <div style="text-align: center; max-width: 600px; padding: 40px;">
                        <h1 style="font-size: 48px; margin-bottom: 20px;">🤖 Parallel Agents</h1>
                        <p style="font-size: 18px; margin-bottom: 30px;">This feature is temporarily simplified due to React conflicts.</p>
                        <button onclick="document.getElementById('simple-special-overlay').remove(); const s = document.querySelector('.settings-section'); if(s) s.style.display = '';" 
                                style="padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                            Close
                        </button>
                    </div>
                `;
                break;
            default:
                content = `
                    <div style="text-align: center;">
                        <h1>${type}</h1>
                        <p>View coming soon...</p>
                        <button onclick="document.getElementById('simple-special-overlay').remove(); const s = document.querySelector('.settings-section'); if(s) s.style.display = '';">Close</button>
                    </div>
                `;
        }
        
        overlay.innerHTML = content;
        document.body.appendChild(overlay);
    };
    
    // Override buttons with simple version
    function overrideButtons() {
        const mappings = {
            'Parallel Agents': 'parallel-agents',
            'Sleep Mode': 'sleep-mode',
            'Supervision': 'supervision',
            'Infinite': 'infinite-loop'
        };
        
        Object.entries(mappings).forEach(([title, type]) => {
            const buttons = document.querySelectorAll(`button[title*="${title}"]`);
            buttons.forEach(button => {
                if (!button._simpleOverride) {
                    button._simpleOverride = true;
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        simpleSpecialView(type);
                    }, true);
                }
            });
        });
    }
    
    // Run when ready
    setTimeout(overrideButtons, 1000);
    setInterval(overrideButtons, 2000);
    
    console.log('✅ Simple Special Views Ready');
})();