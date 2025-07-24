/**
 * Final PRD Fix - Ensure PRD popup shows correctly
 */

(function() {
    'use strict';
    
    // Override the test button to show the real PRD popup
    function setupRealPRDPopup() {
        const button = document.getElementById('prd-test-button');
        if (!button) return;
        
        button.onclick = function() {
            console.log('🚀 Showing real PRD popup...');
            
            // Ensure we have test data
            const existingData = localStorage.getItem('productCreationProject');
            if (!existingData) {
                const testProject = {
                    id: `project-${Date.now()}`,
                    title: "AI-Powered Task Management Platform",
                    timestamp: Date.now(),
                    projectType: "Web Application",
                    originalRequest: "Build a modern task management application with AI features",
                    questions: [
                        { question: "Who is your target audience and what are their main needs?" },
                        { question: "What are the core features your project must have?" },
                        { question: "What platforms should your project support?" },
                        { question: "Do you have any specific design preferences?" },
                        { question: "What is your timeline and budget?" }
                    ],
                    answers: [
                        "Remote teams and freelancers who need intelligent task prioritization",
                        "AI-powered task suggestions, real-time collaboration, smart scheduling, and automated reporting",
                        "Web (primary) with mobile-responsive design, native apps in phase 2",
                        "Modern, clean interface with dark mode. Purple/blue accent colors for a professional look",
                        "3-month MVP timeline with $50,000 initial budget"
                    ],
                    prd: {
                        content: `# Product Requirements Document

## Project Overview
An AI-powered task management platform designed to help remote teams and freelancers work more efficiently through intelligent automation and collaboration features.

## Target Audience
- Remote teams (5-50 people)
- Freelancers and consultants
- Small to medium businesses
- Project managers

## Core Features
1. **AI Task Intelligence**
   - Smart task prioritization based on deadlines and dependencies
   - Automated task suggestions from email and chat integrations
   - Intelligent workload balancing

2. **Real-time Collaboration**
   - Live task updates
   - Team presence indicators
   - Integrated chat per task

3. **Smart Scheduling**
   - AI-powered time estimates
   - Automatic schedule optimization
   - Calendar integration

4. **Automated Reporting**
   - Weekly progress summaries
   - Burndown charts
   - Team performance insights`,
                        generated: true,
                        timestamp: new Date().toISOString()
                    },
                    consultation: {
                        analysis: {
                            successProbability: 85,
                            agreements: ["Clear market need", "Realistic scope", "Strong technical feasibility"],
                            recommendations: ["Start with core AI features", "Focus on user onboarding", "Build MVP iteratively"]
                        }
                    },
                    marketInsights: {
                        viability: { score: 88 },
                        competition: { level: "Medium", competitors: ["Asana", "Monday.com", "ClickUp"] },
                        marketSize: { size: "Large", value: "$4.3B by 2025" }
                    }
                };
                
                localStorage.setItem('productCreationProject', JSON.stringify(testProject));
            }
            
            // Set transfer ready
            localStorage.setItem('projectTransferReady', 'true');
            
            // Remove any existing panel
            const existingPanel = document.getElementById('prd-transfer-panel');
            if (existingPanel) {
                existingPanel.remove();
            }
            
            // Wait a moment for any cleanup to finish
            setTimeout(() => {
                // Get the project data
                const projectData = localStorage.getItem('productCreationProject');
                const project = JSON.parse(projectData);
                
                // Call the display function directly
                if (window.displayProjectTransferPanel) {
                    console.log('✅ Calling displayProjectTransferPanel...');
                    window.displayProjectTransferPanel(project);
                } else {
                    console.error('❌ displayProjectTransferPanel not found!');
                    // Try to reload the PRD script
                    const script = document.createElement('script');
                    script.src = './static/prd-project-transfer.js?' + Date.now();
                    script.onload = () => {
                        setTimeout(() => {
                            if (window.displayProjectTransferPanel) {
                                window.displayProjectTransferPanel(project);
                            }
                        }, 100);
                    };
                    document.body.appendChild(script);
                }
            }, 100);
        };
    }
    
    // Set up the button
    setupRealPRDPopup();
    
    // Try again after a delay in case button isn't ready
    setTimeout(setupRealPRDPopup, 1000);
    setTimeout(setupRealPRDPopup, 2000);
    
})();