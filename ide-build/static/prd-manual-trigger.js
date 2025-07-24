/**
 * Manual PRD Popup Trigger
 * Use this to force show the PRD popup for testing
 */

(function() {
    'use strict';
    
    window.showPRDPopup = function() {
        console.log('🎯 Manually triggering PRD popup...');
        
        const projectData = localStorage.getItem('productCreationProject');
        if (!projectData) {
            console.log('❌ No project data found. Creating test data...');
            
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
                },
                consultation: {
                    analysis: {
                        successProbability: 85,
                        agreements: ["Clear scope", "Good timeline"]
                    }
                },
                marketInsights: {
                    viability: { score: 90 },
                    competition: { level: "Medium" },
                    marketSize: { size: "Large" }
                }
            };
            
            localStorage.setItem('productCreationProject', JSON.stringify(testProject));
        }
        
        // Force the transfer ready flag
        localStorage.setItem('projectTransferReady', 'true');
        
        // Remove any existing panel
        const existingPanel = document.getElementById('prd-transfer-panel');
        if (existingPanel) {
            console.log('🗑️ Removing existing panel...');
            existingPanel.remove();
        }
        
        // Call the display function directly
        if (window.displayProjectTransferPanel) {
            const project = JSON.parse(localStorage.getItem('productCreationProject'));
            console.log('📋 Calling displayProjectTransferPanel with:', project);
            window.displayProjectTransferPanel(project);
        } else {
            console.log('❌ displayProjectTransferPanel not found!');
            console.log('Available window functions:', Object.keys(window).filter(k => k.includes('prd') || k.includes('PRD') || k.includes('transfer')));
        }
    };
    
    console.log('💡 PRD Manual Trigger loaded. Use showPRDPopup() to force show the popup.');
    
})();