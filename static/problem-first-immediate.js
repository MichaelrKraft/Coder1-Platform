/**
 * Immediate Problem-First UI Updates
 * This runs immediately to update the UI without waiting for other scripts
 */

(function() {
    console.log('🎯 Problem-First Immediate Updates Starting...');
    
    // Function to update UI elements
    function updateUI() {
        // Update the placeholder text
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.placeholder = "Start by describing the problem you want to solve...";
            console.log('✅ Updated placeholder text');
        }

        // Update Step 1 title
        const step1Title = document.querySelector('#step-1 h4');
        if (step1Title) {
            step1Title.textContent = '1. Define Your Problem';
            console.log('✅ Updated Step 1 title');
        }
        
        // Update Step 1 description
        const step1Description = document.querySelector('#step-1 p');
        if (step1Description) {
            step1Description.textContent = 'Tell us what problem you\'re trying to solve';
            console.log('✅ Updated Step 1 description');
        }

        // Add helper text with examples
        const step1Actions = document.querySelector('#step-1 .step-actions');
        if (step1Actions && !document.querySelector('.problem-examples')) {
            const examplesHTML = `
                <div class="problem-examples" style="margin-bottom: 20px; padding: 15px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
                    <h5 style="color: #8b5cf6; margin-bottom: 10px; font-weight: 600;">
                        <i class="fas fa-lightbulb"></i> Example Problems:
                    </h5>
                    <ul style="font-size: 0.9em; opacity: 0.8; margin-left: 20px; line-height: 1.8;">
                        <li>Teams waste time searching for commonly used prompts</li>
                        <li>Developers recreate the same boilerplate code repeatedly</li>
                        <li>Small businesses struggle to track feedback across channels</li>
                    </ul>
                </div>
            `;
            step1Actions.insertAdjacentHTML('beforebegin', examplesHTML);
            console.log('✅ Added problem examples');
        }
    }

    // Try to update immediately
    updateUI();

    // Also try when DOM is ready (in case elements aren't loaded yet)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateUI);
    }

    // And try again after a short delay (for dynamically created elements)
    setTimeout(updateUI, 500);
    setTimeout(updateUI, 1000);
    
    console.log('🎯 Problem-First Immediate Updates Complete');
})();