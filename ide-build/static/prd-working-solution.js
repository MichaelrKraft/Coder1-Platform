/**
 * PRD Working Solution - Directly implement the display function
 */

(function() {
    'use strict';
    
    console.log('🚀 PRD Working Solution loaded');
    
    // Function to format PRD for Claude Code
    function formatPRDForClaudeCode(project) {
        let claudeCodeInput = `# Project: ${project.title || 'Untitled Project'}\n\n`;
        
        if (project.prd && project.prd.content) {
            claudeCodeInput += `## Product Requirements Document\n${project.prd.content}\n\n`;
        }
        
        if (project.questions && project.answers) {
            claudeCodeInput += `## Requirements Gathering\n`;
            project.questions.forEach((q, index) => {
                if (project.answers[index]) {
                    claudeCodeInput += `**Q: ${q.question || q}**\n`;
                    claudeCodeInput += `A: ${project.answers[index]}\n\n`;
                }
            });
        }
        
        return claudeCodeInput;
    }
    
    // Working display function
    window.showPRDPanel = function() {
        console.log('✅ showPRDPanel called');
        
        // Get or create project data
        let projectData = localStorage.getItem('productCreationProject');
        let project;
        
        if (!projectData) {
            project = {
                title: "AI-Powered Task Management Platform",
                timestamp: Date.now(),
                projectType: "Web Application",
                questions: [
                    { question: "Who is your target audience?" },
                    { question: "What are the core features?" },
                    { question: "What platforms?" },
                    { question: "Design preferences?" },
                    { question: "Timeline and budget?" }
                ],
                answers: [
                    "Remote teams and freelancers",
                    "AI task prioritization, real-time collaboration, smart scheduling",
                    "Web with mobile-responsive design",
                    "Modern, clean interface with dark mode",
                    "3-month MVP, $50k budget"
                ],
                prd: {
                    content: "# Product Requirements Document\n\nAn AI-powered task management platform for remote teams..."
                },
                consultation: {
                    analysis: {
                        successProbability: 85,
                        agreements: ["Clear scope", "Good timeline", "Market fit"]
                    }
                },
                marketInsights: {
                    viability: { score: 88 },
                    competition: { level: "Medium" },
                    marketSize: { size: "Large" }
                }
            };
            localStorage.setItem('productCreationProject', JSON.stringify(project));
        } else {
            project = JSON.parse(projectData);
        }
        
        // Remove any existing panel
        const existing = document.getElementById('prd-transfer-panel');
        if (existing) existing.remove();
        
        // Create the panel with inline styles
        const panel = document.createElement('div');
        panel.id = 'prd-transfer-panel';
        panel.innerHTML = `
            <style>
                #prd-transfer-panel {
                    position: fixed !important;
                    top: 25% !important;
                    right: 20px !important;
                    transform: translateY(-50%) !important;
                    width: 450px !important;
                    background: rgba(26, 27, 38, 0.98) !important;
                    border: 2px solid #8b5cf6 !important;
                    border-radius: 16px !important;
                    backdrop-filter: blur(10px) !important;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
                                0 0 40px rgba(139, 92, 246, 0.4) !important;
                    z-index: 10000 !important;
                    color: #c0caf5 !important;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif !important;
                    animation: pulseGlow 2s ease-in-out infinite !important;
                }
                
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4); }
                    50% { box-shadow: 0 0 30px rgba(139, 92, 246, 1), 0 0 60px rgba(139, 92, 246, 0.6); }
                }
                
                #prd-transfer-panel * {
                    box-sizing: border-box;
                }
                
                .prd-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #414558;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .prd-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .prd-title h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #c0caf5;
                }
                
                .prd-close {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 4px 8px;
                }
                
                .prd-close:hover {
                    color: #ef4444;
                }
                
                .prd-content {
                    padding: 20px;
                }
                
                .prd-info {
                    background: rgba(17, 24, 39, 0.5);
                    border: 1px solid #374151;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 16px;
                }
                
                .prd-info-item {
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                
                .prd-info-item strong {
                    color: #7c3aed;
                }
                
                .prd-preview {
                    background: #0d1117;
                    border: 1px solid #374151;
                    border-radius: 6px;
                    padding: 12px;
                    font-family: Monaco, Menlo, monospace;
                    font-size: 12px;
                    max-height: 200px;
                    overflow-y: auto;
                    margin-bottom: 16px;
                    white-space: pre-wrap;
                }
                
                .prd-actions {
                    display: flex;
                    gap: 12px;
                }
                
                .prd-btn {
                    flex: 1;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                
                .prd-btn.primary {
                    background: #7c3aed;
                    color: white;
                }
                
                .prd-btn.primary:hover {
                    background: #8b5cf6;
                }
                
                .prd-btn.secondary {
                    background: rgba(75, 85, 99, 0.5);
                    color: #c0caf5;
                    border: 1px solid #414558;
                }
                
                .prd-btn.secondary:hover {
                    background: rgba(75, 85, 99, 0.8);
                }
            </style>
            
            <div class="prd-header">
                <div class="prd-title">
                    <span style="color: #7c3aed;">📄</span>
                    <h3>PRD Ready</h3>
                    <span style="color: #9ca3af; font-size: 14px;">${project.title}</span>
                </div>
                <button class="prd-close" onclick="document.getElementById('prd-transfer-panel').remove()">×</button>
            </div>
            
            <div class="prd-content">
                <div class="prd-info">
                    <div class="prd-info-item">
                        <strong>Project Type:</strong> ${project.projectType || 'General'}
                    </div>
                    <div class="prd-info-item">
                        <strong>Questions Answered:</strong> ${project.questions ? project.questions.length : 0}/5
                    </div>
                    <div class="prd-info-item">
                        <strong>Components:</strong> PRD Document, Requirements Q&A
                    </div>
                </div>
                
                <div style="margin-bottom: 12px; font-size: 14px; color: #7c3aed;">
                    Ready for Claude Code:
                </div>
                
                <div class="prd-preview" id="prd-preview">
                    ${formatPRDForClaudeCode(project).substring(0, 800)}...
                </div>
                
                <div class="prd-actions">
                    <button class="prd-btn primary" onclick="window.copyPRD()">
                        📋 Copy PRD for Claude Code
                    </button>
                    <button class="prd-btn secondary" onclick="window.viewFullPRD()">
                        👁️ View Full PRD
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add copy function
        window.copyPRD = function() {
            const fullText = formatPRDForClaudeCode(project);
            navigator.clipboard.writeText(fullText).then(() => {
                const btn = event.target;
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
        };
        
        // Add view function
        window.viewFullPRD = function() {
            alert('Full PRD view would open here. For now, use Copy to get the full text.');
        };
        
        console.log('✅ PRD panel displayed');
    };
    
    // Update the test button
    setTimeout(() => {
        const button = document.getElementById('prd-test-button');
        if (button) {
            button.onclick = window.showPRDPanel;
            console.log('✅ Test button updated to use showPRDPanel');
        }
    }, 500);
    
})();