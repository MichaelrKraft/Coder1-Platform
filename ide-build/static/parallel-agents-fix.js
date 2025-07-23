// Parallel Agents Modal Fix - Direct Integration
console.log('🔧 Parallel Agents Fix Loading...');

// Store the original startParallelAgents function
let originalStartParallelAgents = null;

// Wait for the API injection to complete
function waitForAPI() {
    if (window.startParallelAgents && !originalStartParallelAgents) {
        console.log('✅ Found startParallelAgents, overriding...');
        
        // Store the original function
        originalStartParallelAgents = window.startParallelAgents;
        
        // Override the function that gets called by the button
        window.startParallelAgents = function() {
            console.log('🚀 Parallel Agents clicked - showing modal instead');
            
            // Import the modal function from the other script
            if (window.showParallelAgentsModal) {
                window.showParallelAgentsModal();
            } else {
                console.error('❌ Modal function not found, falling back to original');
                originalStartParallelAgents();
            }
        };
        
        console.log('✅ Successfully overrode startParallelAgents function');
    } else {
        setTimeout(waitForAPI, 100);
    }
}

// Start the override process
waitForAPI();