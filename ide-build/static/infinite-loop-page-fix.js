// Infinite Loop Page Stop Button Fix
console.log('🔧 Infinite Loop Page Fix Loading...');

// Function to add stop button to the infinite loop page
function addStopButtonToPage() {
    // Look for the status section or activity logs
    const checkForPage = setInterval(() => {
        // Check if we're on the infinite loop page
        const statusElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent === 'STATUS:' && el.nextElementSibling
        );
        
        const sessionIdElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent === 'SESSION ID:' && el.nextElementSibling
        );
        
        if (statusElement && sessionIdElement) {
            clearInterval(checkForPage);
            console.log('✅ Found Infinite Loop page');
            
            // Get the session ID
            const sessionId = sessionIdElement.nextElementSibling?.textContent?.trim();
            console.log('Session ID:', sessionId);
            
            // Check if we have a valid session ID (not empty)
            const status = statusElement.nextElementSibling?.textContent?.trim();
            console.log('Current status:', status);
            
            // Add stop button if we have a session ID (regardless of status text)
            // Since status shows "Stopped" even when running, we check for valid session ID
            if (sessionId && sessionId !== '' && sessionId !== 'null' && sessionId !== 'undefined') {
                createPageStopButton(sessionId, statusElement.parentElement);
            }
            
            // Monitor for status changes
            observeStatusChanges(statusElement.nextElementSibling, sessionIdElement.nextElementSibling);
        }
    }, 500);
    
    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkForPage), 10000);
}

function createPageStopButton(sessionId, container) {
    // Check if button already exists
    if (document.getElementById('infinite-page-stop-btn')) return;
    
    console.log('Creating stop button for session:', sessionId);
    
    const stopButton = document.createElement('button');
    stopButton.id = 'infinite-page-stop-btn';
    stopButton.innerHTML = '🛑 Stop Session';
    stopButton.style.cssText = `
        background: #f7768e;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 16px;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(247, 118, 142, 0.3);
    `;
    
    stopButton.onmouseover = () => {
        stopButton.style.transform = 'translateY(-2px)';
        stopButton.style.boxShadow = '0 6px 16px rgba(247, 118, 142, 0.4)';
    };
    
    stopButton.onmouseout = () => {
        stopButton.style.transform = 'translateY(0)';
        stopButton.style.boxShadow = '0 4px 12px rgba(247, 118, 142, 0.3)';
    };
    
    stopButton.onclick = async () => {
        stopButton.disabled = true;
        stopButton.innerHTML = '⏳ Stopping...';
        stopButton.style.opacity = '0.7';
        
        try {
            const response = await fetch(`/api/infinite/stop/${sessionId}`, {
                method: 'POST'
            });
            
            const data = await response.json();
            console.log('Stop response:', data);
            
            if (data.success) {
                stopButton.innerHTML = '✅ Stopped';
                setTimeout(() => {
                    stopButton.remove();
                }, 2000);
            } else {
                stopButton.innerHTML = '❌ Failed to stop';
                stopButton.disabled = false;
                stopButton.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error stopping session:', error);
            stopButton.innerHTML = '❌ Error';
            stopButton.disabled = false;
            stopButton.style.opacity = '1';
        }
    };
    
    // Insert the button after the status section
    container.appendChild(stopButton);
}

function observeStatusChanges(statusElement, sessionIdElement) {
    if (!statusElement || !sessionIdElement) return;
    
    // Create observer to watch for status changes
    const observer = new MutationObserver((mutations) => {
        const currentStatus = statusElement.textContent?.trim();
        const sessionId = sessionIdElement.textContent?.trim();
        
        console.log('Status changed to:', currentStatus);
        
        const existingButton = document.getElementById('infinite-page-stop-btn');
        
        // Since status always shows "Stopped", check if session ID exists or changes
        if ((!sessionId || sessionId === '' || sessionId === 'null') && existingButton) {
            // Remove button if no valid session ID
            existingButton.remove();
        } else if (sessionId && sessionId !== '' && sessionId !== 'null' && !existingButton) {
            // Add button if valid session ID exists and button doesn't exist
            createPageStopButton(sessionId, statusElement.parentElement);
        }
    });
    
    // Observe changes to the status text
    observer.observe(statusElement, {
        childList: true,
        characterData: true,
        subtree: true
    });
}

// Also add a floating stop button as backup
function addFloatingStopButton() {
    // Check every second for active sessions
    setInterval(() => {
        // Look for session ID on the page
        const sessionIdElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent === 'SESSION ID:' && el.nextElementSibling
        );
        
        const statusElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent === 'STATUS:' && el.nextElementSibling
        );
        
        if (sessionIdElement && statusElement) {
            const sessionId = sessionIdElement.nextElementSibling?.textContent?.trim();
            const status = statusElement.nextElementSibling?.textContent?.trim();
            
            const floatingBtn = document.getElementById('floating-stop-btn');
            
            if (sessionId && sessionId !== '' && sessionId !== 'null' && !floatingBtn) {
                // Create floating button
                const btn = document.createElement('button');
                btn.id = 'floating-stop-btn';
                btn.innerHTML = '⏹️ Stop';
                btn.title = 'Stop Infinite Loop';
                btn.style.cssText = `
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: #f7768e;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(247, 118, 142, 0.4);
                    z-index: 9999;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;
                
                btn.onclick = async () => {
                    btn.disabled = true;
                    btn.innerHTML = '⏳';
                    
                    try {
                        const response = await fetch(`/api/infinite/stop/${sessionId}`, {
                            method: 'POST'
                        });
                        
                        const data = await response.json();
                        if (data.success) {
                            btn.innerHTML = '✅';
                            setTimeout(() => btn.remove(), 1000);
                        } else {
                            btn.innerHTML = '❌';
                            btn.disabled = false;
                        }
                    } catch (error) {
                        btn.innerHTML = '❌';
                        btn.disabled = false;
                    }
                };
                
                document.body.appendChild(btn);
            } else if ((!sessionId || sessionId === '' || sessionId === 'null') && floatingBtn) {
                floatingBtn.remove();
            }
        }
    }, 1000);
}

// Initialize when page loads or changes
function initialize() {
    addStopButtonToPage();
    addFloatingStopButton();
    
    // Re-run when URL changes (for React routing)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addStopButtonToPage, 500);
        }
    }).observe(document, { subtree: true, childList: true });
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

console.log('✅ Infinite Loop Page Fix Ready');