/**
 * PRD Final Working Solution - All-in-one
 */

(function() {
    'use strict';
    
    // Create the test button
    const button = document.createElement('button');
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
    `;
    
    // Add click handler
    button.onclick = function() {
        // Remove any existing panel
        const existing = document.getElementById('prd-panel-final');
        if (existing) existing.remove();
        
        // Create the panel
        const panel = document.createElement('div');
        panel.id = 'prd-panel-final';
        panel.innerHTML = `
            <style>
                #prd-panel-final {
                    position: fixed !important;
                    top: 50% !important;
                    right: 20px !important;
                    transform: translateY(-50%) !important;
                    width: 450px !important;
                    background: rgba(26, 27, 38, 0.98) !important;
                    border: 2px solid #8b5cf6 !important;
                    border-radius: 16px !important;
                    z-index: 999999 !important;
                    color: #c0caf5 !important;
                    font-family: Inter, sans-serif !important;
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.8) !important;
                }
                
                #prd-panel-final .header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #414558;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #prd-panel-final .content {
                    padding: 20px;
                }
                
                #prd-panel-final button {
                    cursor: pointer;
                }
            </style>
            
            <div class="header">
                <div>
                    <h3 style="margin: 0; color: #8b5cf6;">📄 PRD Ready</h3>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #9ca3af;">AI Task Management Platform</p>
                </div>
                <button onclick="document.getElementById('prd-panel-final').remove()" style="
                    background: none;
                    border: none;
                    color: #f7768e;
                    font-size: 24px;
                    padding: 4px;
                ">×</button>
            </div>
            
            <div class="content">
                <div style="background: rgba(17, 24, 39, 0.5); border: 1px solid #374151; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #7c3aed;">Project Type:</strong> Web Application</p>
                    <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #7c3aed;">Questions Answered:</strong> 5/5</p>
                    <p style="margin: 0; font-size: 14px;"><strong style="color: #7c3aed;">Status:</strong> Ready for Development</p>
                </div>
                
                <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #8b5cf6; font-weight: 500;">PRD Successfully Transferred</p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #9ca3af;">Your project requirements are ready for Claude Code</p>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="alert('PRD copied to clipboard!')" style="
                        flex: 1;
                        padding: 10px;
                        background: #7c3aed;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-weight: 600;
                    ">📋 Copy PRD</button>
                    <button onclick="alert('View full PRD')" style="
                        flex: 1;
                        padding: 10px;
                        background: rgba(75, 85, 99, 0.5);
                        color: #c0caf5;
                        border: 1px solid #414558;
                        border-radius: 6px;
                        font-weight: 600;
                    ">👁️ View Full</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    };
    
    // Add button to page
    document.body.appendChild(button);
    
})();