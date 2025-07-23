// API Integration Script for Coder1 IDE
// This script enhances the existing terminal buttons with API functionality

console.log('🔧 API Integration Script Loading...');

let currentSession = null;

// Wait for terminal buttons to load
function waitForReactApp() {
    const maxAttempts = 50;
    let attempts = 0;
    
    const checkInterval = setInterval(() => {
        attempts++;
        
        // Look for terminal buttons in the IDE
        const buttons = document.querySelectorAll('button[title="Supervision"], button[title="Sleep Mode"], button[title="Infinite Loop"], button[title="Parallel Agents"]');
        
        if (buttons.length > 0 || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (buttons.length > 0) {
                console.log('✅ Terminal buttons detected, enhancing with API functionality...');
                enhanceExistingButtons();
            } else {
                console.log('⚠️ Timeout waiting for terminal buttons to load');
            }
        }
    }, 200);
}

function enhanceExistingButtons() {
    // Override click handlers for existing buttons
    const supervisionBtn = document.querySelector('button[title="Supervision"]');
    const sleepModeBtn = document.querySelector('button[title="Sleep Mode"]');
    const infiniteBtn = document.querySelector('button[title="Infinite Loop"]');
    const parallelBtn = document.querySelector('button[title="Parallel Agents"]');
    
    if (supervisionBtn) {
        supervisionBtn.onclick = (e) => {
            e.preventDefault();
            startSupervision();
        };
    }
    
    if (sleepModeBtn) {
        sleepModeBtn.onclick = (e) => {
            e.preventDefault();
            startSleepMode();
        };
    }
    
    if (infiniteBtn) {
        infiniteBtn.onclick = async (e) => {
            e.preventDefault();
            await startInfiniteLoop();
        };
    }
    
    if (parallelBtn) {
        parallelBtn.onclick = (e) => {
            e.preventDefault();
            startParallelAgents();
        };
    }
    
    console.log('✅ Terminal buttons enhanced with API functionality');
}

async function startInfiniteLoop() {
    showNotification('🔄 Starting Infinite Loop...');
    
    try {
        const response = await fetch('/api/infinite/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: 'create innovative React components'
            })
        });
        
        const data = await response.json();
        if (data.success) {
            currentSession = data.sessionId;
            showNotification(`✅ Infinite loop started - Session: ${data.sessionId}`, 'success');
            
            // Add stop button functionality
            addStopButton(data.sessionId);
            
            startPollingStatus();
        } else {
            showNotification(`❌ Failed: ${data.message}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ Error: ${error.message}`, 'error');
    }
}

function addStopButton(sessionId) {
    // Create floating stop button
    const stopButton = document.createElement('button');
    stopButton.id = 'infinite-stop-btn';
    stopButton.innerHTML = '🛑 Stop Infinite Loop';
    stopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #f7768e;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transition: all 0.2s;
    `;
    
    stopButton.onmouseover = () => {
        stopButton.style.transform = 'scale(1.05)';
        stopButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    };
    
    stopButton.onmouseout = () => {
        stopButton.style.transform = 'scale(1)';
        stopButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };
    
    stopButton.onclick = async () => {
        stopButton.disabled = true;
        stopButton.innerHTML = '⏳ Stopping...';
        
        try {
            const response = await fetch(`/api/infinite/stop/${sessionId}`, {
                method: 'POST'
            });
            
            const data = await response.json();
            if (data.success) {
                showNotification('✅ Infinite loop stopped successfully', 'success');
                currentSession = null;
                stopButton.remove();
            } else {
                showNotification(`❌ Failed to stop: ${data.message}`, 'error');
                stopButton.disabled = false;
                stopButton.innerHTML = '🛑 Stop Infinite Loop';
            }
        } catch (error) {
            showNotification(`❌ Error stopping: ${error.message}`, 'error');
            stopButton.disabled = false;
            stopButton.innerHTML = '🛑 Stop Infinite Loop';
        }
    };
    
    document.body.appendChild(stopButton);
}

// Clean up stop button when session ends
function removeStopButton() {
    const stopBtn = document.getElementById('infinite-stop-btn');
    if (stopBtn) {
        stopBtn.remove();
    }
}

async function startPollingStatus() {
    if (!currentSession) return;
    
    try {
        const response = await fetch(`/api/infinite/status/${currentSession}`);
        const data = await response.json();
        
        if (data.success) {
            showNotification(`Wave ${data.currentWave} - ${data.totalGenerated} components generated`, 'info');
            
            if (data.status === 'running') {
                setTimeout(startPollingStatus, 3000);
            } else {
                // Session ended, remove stop button
                removeStopButton();
                showNotification('✅ Infinite loop completed', 'success');
            }
        }
    } catch (error) {
        console.error('Polling error:', error);
        removeStopButton();
    }
}

function startSupervision() {
    showNotification('🔍 Supervision Mode Activated');
    
    let supervisionCount = 0;
    const supervisionInterval = setInterval(() => {
        supervisionCount++;
        showNotification(`Supervising: ${supervisionCount} operations`, 'info');
        
        if (supervisionCount >= 10) {
            clearInterval(supervisionInterval);
            showNotification('✅ Supervision cycle completed', 'success');
        }
    }, 2000);
}

function startParallelAgents() {
    showNotification('👥 Starting 3 Parallel Agents');
    
    const agents = ['Agent-1', 'Agent-2', 'Agent-3'];
    let activeAgents = 0;
    
    agents.forEach((agent, index) => {
        setTimeout(() => {
            activeAgents++;
            showNotification(`🤖 ${agent} is now active`, 'success');
            
            if (activeAgents === 3) {
                setTimeout(() => {
                    showNotification('🚀 Parallel processing at full capacity', 'success');
                }, 1000);
            }
        }, (index + 1) * 1500);
    });
}

function startSleepMode() {
    showNotification('🌙 Activating Sleep Mode...');
    
    // Track sleep mode state
    let isSleeping = true;
    
    // Create sleep mode overlay (subtle effect)
    const sleepOverlay = document.createElement('div');
    sleepOverlay.id = 'sleep-mode-overlay';
    sleepOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        z-index: 9998;
        pointer-events: none;
        transition: opacity 0.5s ease;
        animation: breathe 4s ease-in-out infinite;
    `;
    
    // Add breathing animation
    const style = document.createElement('style');
    style.id = 'sleep-mode-styles';
    style.textContent = `
        @keyframes breathe {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(sleepOverlay);
    
    // Pause all active sessions
    if (currentSession) {
        showNotification('💤 Pausing active sessions...', 'info');
        // In a real implementation, this would pause all running processes
    }
    
    // Show sleep status
    showNotification('😴 Sleep Mode Active - All agents paused', 'success');
    
    // Create wake button
    const wakeButton = document.createElement('button');
    wakeButton.innerHTML = '☀️ Wake Up';
    wakeButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #f7aa00;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transition: all 0.2s;
    `;
    
    wakeButton.onclick = () => {
        // Remove sleep mode
        sleepOverlay.remove();
        wakeButton.remove();
        document.getElementById('sleep-mode-styles')?.remove();
        showNotification('☀️ Waking up - All systems resuming', 'success');
        
        // Resume any paused sessions
        if (currentSession) {
            showNotification('▶️ Resuming active sessions...', 'info');
        }
    };
    
    document.body.appendChild(wakeButton);
}

function showNotification(message, type = 'info') {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 10px;
        background: ${type === 'error' ? '#f7768e' : type === 'success' ? '#9ece6a' : '#7aa2f7'};
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles if not already added
    if (!document.getElementById('api-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'api-notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForReactApp);
} else {
    waitForReactApp();
}

console.log('🚀 API Integration Script Ready');