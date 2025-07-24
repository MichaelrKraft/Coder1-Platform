/**
 * PRD Test Button - Adds a visible button to test PRD popup
 */

(function() {
    'use strict';
    
    // Create test button
    const button = document.createElement('button');
    button.id = 'prd-test-button';
    button.innerHTML = '🧪 Test PRD Popup';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        padding: 12px 24px;
        background: #7c3aed;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        transition: all 0.2s ease;
    `;
    
    button.onmouseover = () => {
        button.style.background = '#8b5cf6';
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
    };
    
    button.onmouseout = () => {
        button.style.background = '#7c3aed';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
    };
    
    button.onclick = () => {
        // Check if we have the showPRDPopup function
        if (window.showPRDPopup) {
            window.showPRDPopup();
        } else {
            // Fallback: create and show popup directly
            const projectData = localStorage.getItem('productCreationProject');
            if (!projectData) {
                // Create test data
                const testProject = {
                    id: `project-${Date.now()}`,
                    title: "Test PRD Project",
                    timestamp: Date.now(),
                    projectType: "Web Application",
                    questions: [
                        { question: "What is your target audience?" },
                        { question: "What are the core features?" },
                        { question: "What platforms?" },
                        { question: "Design preferences?" },
                        { question: "Timeline and budget?" }
                    ],
                    answers: [
                        "Remote teams",
                        "Task management, real-time collaboration",
                        "Web and mobile",
                        "Clean, minimal design",
                        "3 months, $50k"
                    ],
                    prd: {
                        content: "# Test PRD\n\nThis is a test PRD for development."
                    }
                };
                
                localStorage.setItem('productCreationProject', JSON.stringify(testProject));
                localStorage.setItem('projectTransferReady', 'true');
            }
            
            // Try to display panel
            if (window.displayProjectTransferPanel) {
                const project = JSON.parse(localStorage.getItem('productCreationProject'));
                window.displayProjectTransferPanel(project);
            } else if (window.checkForProjectTransfer) {
                localStorage.setItem('projectTransferReady', 'true');
                window.checkForProjectTransfer();
            } else {
                alert('PRD functions not loaded yet. Please try again in a moment.');
            }
        }
    };
    
    // Add button to page when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(button);
        });
    } else {
        document.body.appendChild(button);
    }
    
})();