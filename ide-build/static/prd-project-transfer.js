/**
 * PRD Project Transfer Handler for Coder1 IDE
 * Displays transferred project data from Smart PRD Generator
 */

(function() {
    'use strict';

    // Track if we've already shown the panel
    let panelShown = false;
    
    // Check if project transfer data exists
    function checkForProjectTransfer() {
        console.log('🔍 Checking for PRD project transfer...');
        const projectData = localStorage.getItem('productCreationProject');
        const transferReady = localStorage.getItem('projectTransferReady');
        
        console.log('📦 Project data exists:', !!projectData);
        console.log('✅ Transfer ready flag:', transferReady);
        console.log('🎯 Panel already shown:', panelShown);
        
        // Check if panel already exists in DOM
        const existingPanel = document.getElementById('prd-transfer-panel');
        if (existingPanel) {
            console.log('📌 Panel already exists in DOM');
            return;
        }
        
        if (projectData && transferReady === 'true' && !panelShown) {
            try {
                const project = JSON.parse(projectData);
                console.log('📋 Project parsed successfully:', project);
                displayProjectTransferPanel(project);
                panelShown = true;
                // Clear the transfer flag after a delay to ensure it's shown
                setTimeout(() => {
                    localStorage.removeItem('projectTransferReady');
                }, 5000);
            } catch (error) {
                console.error('❌ Error parsing project transfer data:', error);
            }
        } else {
            console.log('⚠️ No project transfer data found or not ready');
        }
    }

    // Create and display the project transfer panel
    function displayProjectTransferPanel(project) {
        console.log('📋 Displaying PRD project transfer panel:', project);

        // Create the transfer panel HTML - starts collapsed
        const panelHTML = `
            <div id="prd-transfer-panel" class="prd-transfer-panel collapsed">
                <div class="prd-transfer-header" id="prd-transfer-header">
                    <div class="prd-transfer-title">
                        <i class="fas fa-file-text"></i>
                        <h3>PRD Ready</h3>
                        <span class="prd-project-name">${project.title || 'Untitled Project'}</span>
                    </div>
                    <div class="prd-transfer-actions">
                        <button id="toggle-prd-btn" class="prd-action-btn toggle">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <button id="dismiss-prd-btn" class="prd-action-btn close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="prd-transfer-content" id="prd-transfer-content">
                    <div class="prd-summary">
                        <div class="prd-meta">
                            <span class="prd-status">Ready for Development</span>
                            <span class="prd-timestamp">${new Date(project.timestamp).toLocaleString()}</span>
                        </div>
                        
                        <div class="prd-quick-info">
                            <div class="prd-info-item">
                                <strong>Project Type:</strong> ${project.projectType || 'General'}
                            </div>
                            <div class="prd-info-item">
                                <strong>Questions Answered:</strong> ${project.questions ? project.questions.length : 0}/5
                            </div>
                            <div class="prd-info-item">
                                <strong>Components:</strong> 
                                ${[
                                    project.prd ? 'PRD Document' : null,
                                    project.wireframes ? 'Wireframes' : null,
                                    project.consultation ? 'Expert Consultation' : null,
                                    project.marketInsights ? 'Market Analysis' : null
                                ].filter(Boolean).join(', ') || 'Basic Requirements'}
                            </div>
                        </div>
                        
                        <div class="prd-claude-preview">
                            <h4>Ready for Claude Code:</h4>
                            <div class="prd-preview-text" id="prd-preview-text">
                                ${formatPRDForClaudeCode(project)}
                            </div>
                        </div>
                        
                        <div class="prd-transfer-buttons">
                            <button id="copy-prd-btn" class="prd-action-btn primary">
                                <i class="fas fa-copy"></i>
                                Copy PRD for Claude Code
                            </button>
                            <button id="view-prd-btn" class="prd-action-btn secondary">
                                <i class="fas fa-eye"></i>
                                View Full PRD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject CSS
        injectPRDTransferCSS();

        // Add panel to page
        const body = document.body;
        const panelElement = document.createElement('div');
        panelElement.innerHTML = panelHTML;
        body.appendChild(panelElement.firstElementChild);

        // Add event listeners
        addPRDTransferEventListeners(project);

        // Show notification
        showTransferNotification();
    }

    // Format PRD data for Claude Code input
    function formatPRDForClaudeCode(project) {
        let claudeCodeInput = `# Project: ${project.title || 'Untitled Project'}\n\n`;
        
        if (project.prd && project.prd.content) {
            claudeCodeInput += `## Product Requirements Document\n${project.prd.content}\n\n`;
        }
        
        if (project.questions && project.answers) {
            claudeCodeInput += `## Requirements Gathering\n`;
            project.questions.forEach((q, index) => {
                if (project.answers[index]) {
                    claudeCodeInput += `**Q: ${q.question}**\n`;
                    claudeCodeInput += `A: ${project.answers[index]}\n\n`;
                }
            });
        }
        
        if (project.consultation) {
            claudeCodeInput += `## Expert Consultation Summary\n`;
            claudeCodeInput += `Success Probability: ${project.consultation.analysis?.successProbability || 'N/A'}%\n`;
            if (project.consultation.analysis?.agreements) {
                claudeCodeInput += `Key Agreements: ${project.consultation.analysis.agreements.join(', ')}\n`;
            }
            claudeCodeInput += `\n`;
        }
        
        if (project.marketInsights) {
            claudeCodeInput += `## Market Analysis\n`;
            claudeCodeInput += `Market Viability: ${project.marketInsights.viability?.score || 'N/A'}/100\n`;
            claudeCodeInput += `Competition Level: ${project.marketInsights.competition?.level || 'N/A'}\n`;
            claudeCodeInput += `Market Size: ${project.marketInsights.marketSize?.size || 'N/A'}\n\n`;
        }
        
        claudeCodeInput += `---\n*Generated by Coder1 Smart PRD Generator on ${new Date(project.timestamp).toLocaleString()}*`;
        
        return claudeCodeInput.substring(0, 800) + (claudeCodeInput.length > 800 ? '... (click "Copy PRD for Claude Code" for full text)' : '');
    }

    // Add event listeners for PRD transfer panel
    function addPRDTransferEventListeners(project) {
        const panel = document.getElementById('prd-transfer-panel');
        const toggleBtn = document.getElementById('toggle-prd-btn');
        const header = document.getElementById('prd-transfer-header');
        
        // Toggle panel expansion
        const togglePanel = () => {
            if (panel) {
                panel.classList.toggle('collapsed');
                const isCollapsed = panel.classList.contains('collapsed');
                localStorage.setItem('prdPanelCollapsed', isCollapsed);
            }
        };
        
        // Toggle button click
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePanel();
            });
        }
        
        // Header click (only when collapsed)
        if (header) {
            header.addEventListener('click', () => {
                if (panel && panel.classList.contains('collapsed')) {
                    togglePanel();
                }
            });
        }
        
        // Copy PRD button
        const copyBtn = document.getElementById('copy-prd-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const fullPRD = formatPRDForClaudeCode(project);
                navigator.clipboard.writeText(fullPRD).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyBtn.classList.add('success');
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy PRD for Claude Code';
                        copyBtn.classList.remove('success');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    // Fallback: show full text in modal
                    showFullPRDModal(project);
                });
            });
        }

        // View PRD button
        const viewBtn = document.getElementById('view-prd-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => showFullPRDModal(project));
        }

        // Dismiss button
        const dismissBtn = document.getElementById('dismiss-prd-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                const panel = document.getElementById('prd-transfer-panel');
                if (panel) {
                    panel.style.transform = 'translateY(-100%)';
                    panel.style.opacity = '0';
                    setTimeout(() => panel.remove(), 300);
                }
            });
        }
    }

    // Show full PRD in modal
    function showFullPRDModal(project) {
        const modalHTML = `
            <div id="prd-modal-overlay" class="prd-modal-overlay">
                <div class="prd-modal">
                    <div class="prd-modal-header">
                        <h3>Complete PRD for Claude Code</h3>
                        <button id="close-prd-modal" class="prd-modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="prd-modal-content">
                        <textarea id="prd-full-text" readonly>${formatPRDForClaudeCode(project)}</textarea>
                    </div>
                    <div class="prd-modal-footer">
                        <button id="copy-from-modal" class="prd-action-btn primary">
                            <i class="fas fa-copy"></i>
                            Copy All
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHTML;
        document.body.appendChild(modalElement.firstElementChild);

        // Modal event listeners
        document.getElementById('close-prd-modal').addEventListener('click', () => {
            document.getElementById('prd-modal-overlay').remove();
        });

        document.getElementById('copy-from-modal').addEventListener('click', () => {
            const textarea = document.getElementById('prd-full-text');
            textarea.select();
            navigator.clipboard.writeText(textarea.value);
            document.getElementById('copy-from-modal').innerHTML = '<i class="fas fa-check"></i> Copied!';
        });

        // Close on overlay click
        document.getElementById('prd-modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'prd-modal-overlay') {
                document.getElementById('prd-modal-overlay').remove();
            }
        });
    }

    // Show notification
    function showTransferNotification() {
        // Only show if no other notifications exist
        if (!document.querySelector('.prd-notification')) {
            const notification = document.createElement('div');
            notification.className = 'prd-notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>PRD project successfully transferred from Smart PRD Generator!</span>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }
    }

    // Inject CSS for PRD transfer panel
    function injectPRDTransferCSS() {
        if (document.getElementById('prd-transfer-styles')) return;

        const css = `
            @keyframes pulseGlow {
                0% {
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
                                0 0 40px rgba(139, 92, 246, 0.4),
                                0 0 60px rgba(139, 92, 246, 0.2),
                                inset 0 0 20px rgba(139, 92, 246, 0.1);
                }
                50% {
                    box-shadow: 0 0 30px rgba(139, 92, 246, 1),
                                0 0 60px rgba(139, 92, 246, 0.6),
                                0 0 90px rgba(139, 92, 246, 0.3),
                                inset 0 0 30px rgba(139, 92, 246, 0.2);
                }
                100% {
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
                                0 0 40px rgba(139, 92, 246, 0.4),
                                0 0 60px rgba(139, 92, 246, 0.2),
                                inset 0 0 20px rgba(139, 92, 246, 0.1);
                }
            }
            
            .prd-transfer-panel {
                position: fixed;
                top: 25%;
                right: 20px;
                transform: translateY(-50%);
                width: 450px;
                background: rgba(26, 27, 38, 0.98);
                border: 2px solid #8b5cf6;
                border-radius: 16px;
                backdrop-filter: blur(10px);
                animation: pulseGlow 2s ease-in-out infinite;
                z-index: 10000;
                transition: all 0.3s ease;
                color: #c0caf5;
                font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            /* Collapsed state */
            .prd-transfer-panel.collapsed {
                width: 280px;
                animation: pulseGlow 3s ease-in-out infinite; /* Slower pulse when collapsed */
            }
            
            .prd-transfer-panel.collapsed .prd-transfer-content {
                display: none;
            }
            
            .prd-transfer-panel.collapsed .prd-transfer-header {
                border-bottom: none;
                cursor: pointer;
            }
            
            .prd-transfer-panel.collapsed .prd-transfer-header:hover {
                background: rgba(139, 92, 246, 0.05);
                border-radius: 14px;
            }
            
            .prd-transfer-panel.collapsed .prd-transfer-title h3 {
                font-size: 16px;
            }
            
            .prd-transfer-panel.collapsed .prd-project-name {
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 150px;
            }

            .prd-transfer-header {
                padding: 16px 20px;
                border-bottom: 1px solid #414558;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                transition: all 0.3s ease;
            }

            .prd-transfer-title {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .prd-transfer-title i {
                color: #7c3aed;
                margin-right: 8px;
            }

            .prd-transfer-title h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: #c0caf5;
            }

            .prd-project-name {
                font-size: 12px;
                color: #9ca3af;
                margin-left: 20px;
            }

            .prd-transfer-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .prd-action-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 32px;
                box-sizing: border-box;
            }

            .prd-action-btn.primary {
                background: #7c3aed;
                color: white;
            }

            .prd-action-btn.primary:hover {
                background: #8b5cf6;
            }

            .prd-action-btn.secondary {
                background: rgba(75, 85, 99, 0.5);
                color: #c0caf5;
                border: 1px solid #414558;
            }

            .prd-action-btn.secondary:hover {
                background: rgba(75, 85, 99, 0.8);
            }

            .prd-action-btn.close {
                background: none;
                color: #9ca3af;
                padding: 0;
                width: 32px;
                height: 32px;
                justify-content: center;
                margin-left: 8px;
                flex-shrink: 0;
            }

            .prd-action-btn.close:hover {
                color: #ef4444;
            }
            
            .prd-action-btn.toggle {
                background: transparent;
                border: 1px solid #414558;
                color: #9ca3af;
                width: 32px;
                height: 32px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
            }
            
            .prd-action-btn.toggle:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: #6b7280;
            }
            
            .prd-action-btn.toggle i {
                transition: transform 0.3s ease;
                font-size: 14px;
            }
            
            .prd-transfer-panel:not(.collapsed) .prd-action-btn.toggle i {
                transform: rotate(180deg);
            }

            .prd-action-btn i {
                font-size: 14px;
                line-height: 1;
            }

            .prd-action-btn.close i {
                font-size: 16px;
            }

            .prd-action-btn.success {
                background: #10b981 !important;
            }

            .prd-transfer-content {
                padding: 16px 20px;
                max-height: 400px;
                overflow-y: auto;
            }

            .prd-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .prd-status {
                background: #10b981;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
            }

            .prd-timestamp {
                font-size: 11px;
                color: #6b7280;
            }

            .prd-quick-info {
                margin-bottom: 16px;
            }

            .prd-info-item {
                margin-bottom: 6px;
                font-size: 12px;
                line-height: 1.4;
            }

            .prd-info-item strong {
                color: #7c3aed;
            }

            .prd-claude-preview {
                background: rgba(17, 24, 39, 0.5);
                border: 1px solid #374151;
                border-radius: 6px;
                padding: 12px;
            }

            .prd-claude-preview h4 {
                margin: 0 0 8px 0;
                font-size: 12px;
                color: #7c3aed;
            }

            .prd-preview-text {
                font-family: Monaco, Menlo, monospace;
                font-size: 11px;
                line-height: 1.4;
                color: #d1d5db;
                white-space: pre-wrap;
                max-height: 200px;
                overflow-y: auto;
            }
            
            .prd-transfer-buttons {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }
            
            .prd-transfer-buttons .prd-action-btn {
                flex: 1;
                justify-content: center;
            }

            @keyframes slideInNotification {
                0% {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
                100% {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            
            .prd-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10001;
                font-size: 15px;
                font-weight: 500;
                box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4),
                           0 0 40px rgba(139, 92, 246, 0.3);
                animation: slideInNotification 0.5s ease-out;
            }

            .prd-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .prd-modal {
                background: #1a1b26;
                border-radius: 12px;
                width: 90%;
                max-width: 700px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                border: 1px solid #414558;
            }

            .prd-modal-header {
                padding: 16px 20px;
                border-bottom: 1px solid #414558;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .prd-modal-header h3 {
                margin: 0;
                color: #c0caf5;
            }

            .prd-modal-close {
                background: none;
                border: none;
                color: #9ca3af;
                font-size: 16px;
                cursor: pointer;
                padding: 4px;
            }

            .prd-modal-content {
                flex: 1;
                padding: 20px;
                overflow: hidden;
            }

            .prd-modal-content textarea {
                width: 100%;
                height: 400px;
                background: #0d1117;
                border: 1px solid #414558;
                border-radius: 6px;
                padding: 12px;
                color: #c0caf5;
                font-family: Monaco, Menlo, monospace;
                font-size: 12px;
                line-height: 1.4;
                resize: none;
                outline: none;
            }

            .prd-modal-footer {
                padding: 16px 20px;
                border-top: 1px solid #414558;
                display: flex;
                justify-content: flex-end;
            }
        `;

        const style = document.createElement('style');
        style.id = 'prd-transfer-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    console.log('🚀 PRD Transfer Script Loaded - Document state:', document.readyState);
    console.log('🌐 Current URL:', window.location.href);
    
    // Function to check multiple times with delays
    function scheduleChecks() {
        // Check immediately
        checkForProjectTransfer();
        
        // Check after short delay
        setTimeout(() => {
            console.log('⏱️ Checking after 500ms...');
            checkForProjectTransfer();
        }, 500);
        
        // Check after medium delay
        setTimeout(() => {
            console.log('⏱️ Checking after 1500ms...');
            checkForProjectTransfer();
        }, 1500);
        
        // Check after longer delay for slow loading
        setTimeout(() => {
            console.log('⏱️ Final check after 3000ms...');
            checkForProjectTransfer();
        }, 3000);
    }
    
    if (document.readyState === 'loading') {
        console.log('📄 Document loading - waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', scheduleChecks);
    } else {
        // DOM is already ready
        console.log('✅ DOM ready - scheduling checks...');
        scheduleChecks();
    }

    // Also check when URL contains transfer parameter
    if (window.location.search.includes('project=transfer')) {
        console.log('🔗 Transfer parameter found in URL');
    }
    
    // Expose checkForProjectTransfer globally for debugging
    window.checkForProjectTransfer = checkForProjectTransfer;
    window.displayProjectTransferPanel = displayProjectTransferPanel;

})();