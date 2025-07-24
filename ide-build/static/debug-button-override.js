// Debug script to check button override
(function() {
    console.log('🔍 Debug Button Override - Starting...');
    
    // Check for buttons every second
    setInterval(() => {
        const buttons = document.querySelectorAll('button');
        const specialButtons = [];
        
        buttons.forEach(button => {
            const title = button.getAttribute('title') || '';
            const text = button.textContent || '';
            
            if (title.includes('Supervision') || text.includes('Supervision') ||
                title.includes('Sleep') || text.includes('Sleep') ||
                title.includes('Infinite') || text.includes('Infinite') ||
                title.includes('Parallel') || text.includes('Parallel')) {
                
                specialButtons.push({
                    title: title,
                    text: text,
                    onclick: button.onclick ? 'Has onclick' : 'No onclick',
                    element: button
                });
            }
        });
        
        if (specialButtons.length > 0) {
            console.log('Found special buttons:', specialButtons);
            
            // Try to override them
            specialButtons.forEach(btn => {
                if (!btn.element.hasAttribute('data-overridden')) {
                    console.log('Overriding button:', btn.title || btn.text);
                    
                    // Clone the button to remove all event listeners
                    const newButton = btn.element.cloneNode(true);
                    newButton.setAttribute('data-overridden', 'true');
                    
                    // Add our click handler
                    newButton.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Button clicked:', btn.title || btn.text);
                        
                        if (btn.title.includes('Supervision') || btn.text.includes('Supervision')) {
                            window.showSpecialView && window.showSpecialView('supervision');
                        } else if (btn.title.includes('Sleep') || btn.text.includes('Sleep')) {
                            window.showSpecialView && window.showSpecialView('sleep-mode');
                        } else if (btn.title.includes('Infinite') || btn.text.includes('Infinite')) {
                            window.showSpecialView && window.showSpecialView('infinite-loop');
                        } else if (btn.title.includes('Parallel') || btn.text.includes('Parallel')) {
                            window.showSpecialView && window.showSpecialView('parallel-agents');
                        }
                        
                        return false;
                    };
                    
                    // Replace the original button
                    btn.element.parentNode.replaceChild(newButton, btn.element);
                }
            });
        }
    }, 1000);
})();