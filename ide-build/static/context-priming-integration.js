/**
 * Context Priming Integration for IDE
 * Adds Context Priming button to the IDE interface
 */

console.log('🧠 Context Priming Integration loading...');

function addContextPrimingButton() {
    // Wait for header to be available
    const checkInterval = setInterval(() => {
        // Look for header navigation area
        const headerAreas = [
            document.querySelector('.header-nav'),
            document.querySelector('.header-center'),
            document.querySelector('.nav-items'),
            document.querySelector('[class*="header"]'),
            document.querySelector('[class*="nav"]')
        ].filter(Boolean);

        if (headerAreas.length > 0) {
            // Check if button already exists
            if (document.querySelector('.context-priming-ide-btn')) {
                clearInterval(checkInterval);
                return;
            }

            console.log('🧠 Adding Context Priming button to IDE');

            // Create the button
            const contextBtn = document.createElement('button');
            contextBtn.className = 'context-priming-ide-btn';
            contextBtn.innerHTML = `
                <i class="fas fa-brain"></i>
                <span>Context Priming</span>
            `;
            contextBtn.title = 'Pre-load project context for smarter AI interactions';
            
            // Add styles
            contextBtn.style.cssText = `
                background: linear-gradient(135deg, #10b981, #059669);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin: 0 8px;
                font-size: 14px;
                height: 36px;
                white-space: nowrap;
            `;

            // Add hover effect
            contextBtn.addEventListener('mouseenter', () => {
                contextBtn.style.transform = 'translateY(-2px)';
                contextBtn.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
            });

            contextBtn.addEventListener('mouseleave', () => {
                contextBtn.style.transform = 'translateY(0)';
                contextBtn.style.boxShadow = 'none';
            });

            // Check if PRD is ready for Context Priming
            const prdReady = localStorage.getItem('contextPrimingReady') === 'true';
            if (prdReady) {
                // Add visual indicator
                const indicator = document.createElement('span');
                indicator.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 10px;
                    height: 10px;
                    background: #ff8c00;
                    border-radius: 50%;
                    border: 2px solid #1a1b26;
                `;
                contextBtn.style.position = 'relative';
                contextBtn.appendChild(indicator);
                
                // Add glow effect
                contextBtn.style.boxShadow = '0 0 10px rgba(255, 140, 0, 0.5)';
            }
            
            // Add click handler
            contextBtn.addEventListener('click', () => {
                // Open Context Priming in new tab
                window.open('/context-priming.html', '_blank');
            });

            // Find the best place to insert the button
            const headerArea = headerAreas[0];
            
            // Look for existing navigation buttons
            const existingButtons = headerArea.querySelectorAll('button');
            if (existingButtons.length > 0) {
                // Insert after the last button
                const lastButton = existingButtons[existingButtons.length - 1];
                lastButton.parentNode.insertBefore(contextBtn, lastButton.nextSibling);
            } else {
                // Just append to the header area
                headerArea.appendChild(contextBtn);
            }

            console.log('✅ Context Priming button added to IDE');
            clearInterval(checkInterval);
        }
    }, 500);

    // Stop trying after 30 seconds
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('⚠️ Could not find suitable location for Context Priming button');
    }, 30000);
}

// Also add CSS for better orange glow on hover
function addContextPrimingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .context-priming-ide-btn:hover {
            border: 2px solid #ff8c00 !important;
            box-shadow: 0 0 20px rgba(255, 140, 0, 0.8), 0 0 40px rgba(255, 140, 0, 0.4) !important;
            transform: translateY(-2px) !important;
        }

        /* Ensure FontAwesome icon shows properly */
        .context-priming-ide-btn i {
            font-size: 16px;
            margin-right: 4px;
        }

        /* Make it consistent with other IDE buttons */
        .context-priming-ide-btn span {
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addContextPrimingButton();
        addContextPrimingStyles();
    });
} else {
    addContextPrimingButton();
    addContextPrimingStyles();
}

// Also listen for dynamic content changes
const observer = new MutationObserver(() => {
    if (!document.querySelector('.context-priming-ide-btn')) {
        addContextPrimingButton();
    }
});

if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
}

console.log('✅ Context Priming Integration initialized');