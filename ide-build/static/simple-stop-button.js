// Simple Stop Button for Infinite Loop Page
console.log('🛑 Simple Stop Button Loading...');

// Function to add a stop button based on current URL
function addStopButtonForInfinitePage() {
    // Work on any IDE page (localhost or production)
    if (!window.location.href.includes('/ide')) return;
    
    // Look for any session ID on the page (UUID pattern)
    const sessionPattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
    
    setInterval(() => {
        // Find session ID in the page
        const pageText = document.body.innerText;
        const sessionMatch = pageText.match(sessionPattern);
        
        if (sessionMatch) {
            const sessionId = sessionMatch[0];
            console.log('Found session ID:', sessionId);
            
            // Check if stop button already exists
            if (!document.getElementById('simple-infinite-stop')) {
                // Find the session ID element to position button below it
                const sessionElements = document.body.innerText.match(/SESSION ID:\s*([a-f0-9-]+)/);
                let sessionCard = null;
                
                // Find the SESSION ID section more reliably
                const allDivs = document.querySelectorAll('div');
                for (const div of allDivs) {
                    // Look for the div that contains "SESSION ID:" text
                    if (div.textContent.trim() === 'SESSION ID:') {
                        // The session ID value is likely in the next sibling or nearby
                        let parent = div.parentElement;
                        // Go up until we find the card container
                        while (parent) {
                            // Check if this element has the session ID value
                            if (parent.textContent.includes(sessionId) && parent.offsetWidth > 300) {
                                sessionCard = parent;
                                break;
                            }
                            parent = parent.parentElement;
                        }
                    }
                }
                
                // If still not found, try another approach - look for the Status & Logs section
                if (!sessionCard) {
                    for (const div of allDivs) {
                        if (div.textContent.includes('Status & Logs') && div.querySelector('h2, h3')) {
                            // Find the session ID container within this section
                            const sessionContainer = Array.from(div.querySelectorAll('div')).find(d => 
                                d.textContent.includes('SESSION ID:') && d.textContent.includes(sessionId)
                            );
                            if (sessionContainer) {
                                sessionCard = sessionContainer;
                                break;
                            }
                        }
                    }
                }
                
                // Create container for centering
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    margin-top: 16px;
                `;
                
                // Create stop button
                const stopBtn = document.createElement('button');
                stopBtn.id = 'simple-infinite-stop';
                stopBtn.innerHTML = '⏹';
                stopBtn.title = 'Stop Infinite Loop';
                stopBtn.style.cssText = `
                    background: #f7768e;
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(247, 118, 142, 0.3);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                stopBtn.onmouseover = () => {
                    stopBtn.style.transform = 'scale(1.1)';
                    stopBtn.style.boxShadow = '0 3px 12px rgba(247, 118, 142, 0.5)';
                };
                
                stopBtn.onmouseout = () => {
                    stopBtn.style.transform = 'scale(1)';
                    stopBtn.style.boxShadow = '0 2px 8px rgba(247, 118, 142, 0.3)';
                };
                
                stopBtn.onclick = async () => {
                    console.log('Stop button clicked for session:', sessionId);
                    stopBtn.disabled = true;
                    stopBtn.innerHTML = '⏳';
                    
                    try {
                        const response = await fetch(`/api/infinite/stop/${sessionId}`, {
                            method: 'POST'
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            console.log('Stop response:', data);
                            stopBtn.innerHTML = '✅';
                            
                            // Also try to click any existing infinite loop button to update UI
                            const infiniteBtn = document.querySelector('button[title="Infinite Loop"]');
                            if (infiniteBtn && infiniteBtn.textContent.includes('Stop')) {
                                infiniteBtn.click();
                            }
                            
                            setTimeout(() => {
                                buttonContainer.remove();
                            }, 2000);
                        } else {
                            throw new Error('Failed to stop');
                        }
                    } catch (error) {
                        console.error('Error stopping session:', error);
                        stopBtn.innerHTML = '❌';
                        stopBtn.disabled = false;
                    }
                };
                
                // Add button to container
                buttonContainer.appendChild(stopBtn);
                
                // Insert after the session card or fallback to body
                if (sessionCard) {
                    sessionCard.insertAdjacentElement('afterend', buttonContainer);
                    console.log('✅ Stop button added below session card');
                } else {
                    // Fallback: add as fixed position if card not found
                    stopBtn.style.position = 'fixed';
                    stopBtn.style.top = '100px';
                    stopBtn.style.right = '20px';
                    document.body.appendChild(stopBtn);
                    console.log('✅ Stop button added as fallback (card not found)');
                }
            }
        } else {
            // Remove button if no session ID found
            const existingBtn = document.getElementById('simple-infinite-stop');
            if (existingBtn) {
                existingBtn.remove();
                console.log('Removed stop button - no active session');
            }
        }
    }, 1000); // Check every second
}

// Start immediately
addStopButtonForInfinitePage();

// Also check when navigating
window.addEventListener('popstate', addStopButtonForInfinitePage);
window.addEventListener('pushstate', addStopButtonForInfinitePage);

console.log('✅ Simple Stop Button Ready');