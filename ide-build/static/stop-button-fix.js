// Stop Button Fix - Ensure visibility
console.log('🔧 Stop Button Fix Loading...');

// Override the addStopButton function to ensure visibility
function waitForAddStopButton() {
    if (window.addStopButton) {
        console.log('✅ Found addStopButton, creating enhanced version...');
        
        // Store original
        const originalAddStopButton = window.addStopButton;
        
        // Create enhanced version with better visibility
        window.addStopButton = function(sessionId) {
            console.log('🎯 Enhanced addStopButton called with sessionId:', sessionId);
            
            // Call original to create the button
            originalAddStopButton.call(this, sessionId);
            
            // Enhance visibility after a short delay
            setTimeout(() => {
                const stopButton = document.getElementById('infinite-stop-btn');
                if (stopButton) {
                    console.log('✅ Enhancing stop button visibility...');
                    
                    // Force higher z-index and ensure visibility
                    stopButton.style.zIndex = '99999';
                    stopButton.style.position = 'fixed';
                    stopButton.style.bottom = '20px';
                    stopButton.style.right = '20px';
                    stopButton.style.display = 'block';
                    stopButton.style.visibility = 'visible';
                    stopButton.style.opacity = '1';
                    
                    // Add animation to draw attention
                    stopButton.style.animation = 'pulseButton 2s ease-in-out infinite';
                    
                    // Add hover effect
                    stopButton.addEventListener('mouseenter', () => {
                        stopButton.style.animation = 'none';
                        stopButton.style.transform = 'scale(1.1)';
                    });
                    
                    stopButton.addEventListener('mouseleave', () => {
                        stopButton.style.animation = 'pulseButton 2s ease-in-out infinite';
                        stopButton.style.transform = 'scale(1)';
                    });
                    
                    console.log('✅ Stop button enhanced with z-index:', stopButton.style.zIndex);
                } else {
                    console.error('❌ Stop button not found after creation');
                }
            }, 100);
        };
    } else {
        setTimeout(waitForAddStopButton, 100);
    }
}

// Add CSS for button animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulseButton {
        0% {
            box-shadow: 0 4px 12px rgba(247, 118, 142, 0.3);
            transform: scale(1);
        }
        50% {
            box-shadow: 0 8px 24px rgba(247, 118, 142, 0.5);
            transform: scale(1.05);
        }
        100% {
            box-shadow: 0 4px 12px rgba(247, 118, 142, 0.3);
            transform: scale(1);
        }
    }
    
    #infinite-stop-btn {
        /* Ensure button is always visible */
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
    }
`;
document.head.appendChild(style);

// Also create a manual stop button as backup
function createManualStopButton() {
    // Check if we already have a manual button
    if (document.getElementById('manual-stop-btn')) return;
    
    const manualButton = document.createElement('button');
    manualButton.id = 'manual-stop-btn';
    manualButton.innerHTML = '🛑 Stop All Sessions';
    manualButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #f7768e;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 99999;
        transition: all 0.2s;
        display: none;
    `;
    
    manualButton.onclick = async () => {
        console.log('Manual stop button clicked');
        
        // Try to find and click the original stop button
        const originalStopBtn = document.getElementById('infinite-stop-btn');
        if (originalStopBtn) {
            originalStopBtn.click();
        } else {
            // Fallback: try to stop using currentSession
            if (window.currentSession) {
                try {
                    const response = await fetch(`/api/infinite/stop/${window.currentSession}`, {
                        method: 'POST'
                    });
                    const data = await response.json();
                    console.log('Stop response:', data);
                    
                    if (window.showNotification) {
                        window.showNotification('✅ Session stopped', 'success');
                    }
                    
                    // Hide manual button
                    manualButton.style.display = 'none';
                } catch (error) {
                    console.error('Error stopping session:', error);
                }
            }
        }
    };
    
    document.body.appendChild(manualButton);
    
    // Show manual button when infinite loop starts
    const originalStartInfiniteLoop = window.startInfiniteLoop;
    if (originalStartInfiniteLoop) {
        window.startInfiniteLoop = async function() {
            console.log('Showing manual stop button...');
            manualButton.style.display = 'block';
            
            try {
                const result = await originalStartInfiniteLoop.call(this);
                return result;
            } catch (error) {
                manualButton.style.display = 'none';
                throw error;
            }
        };
    }
}

// Initialize
waitForAddStopButton();
createManualStopButton();

console.log('✅ Stop Button Fix Ready');