// Force glassmorphism styles to ensure they're applied
(function() {
    console.log('🎨 Forcing glassmorphism styles...');
    
    // Create a style element with critical glassmorphism styles
    const style = document.createElement('style');
    style.textContent = `
        /* Force glassmorphism on special view panels */
        .coder1-special-view-overlay .coder1-glass-panel {
            background: rgba(42, 42, 42, 0.6) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
            border-radius: 12px !important;
        }
        
        /* Ensure animated background works */
        .coder1-special-view-overlay .animated-background {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 0 !important;
            overflow: hidden !important;
            pointer-events: none !important;
        }
        
        .coder1-special-view-overlay .gradient-orb {
            position: absolute !important;
            border-radius: 50% !important;
            filter: blur(100px) !important;
            opacity: 0.6 !important;
            animation: float 20s infinite ease-in-out !important;
        }
        
        /* Metric cards glassmorphism */
        .coder1-special-view-overlay .coder1-metric-card {
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            transition: all 0.2s !important;
        }
        
        .coder1-special-view-overlay .coder1-metric-card:hover {
            border-color: #8b5cf6 !important;
            background: rgba(139, 92, 246, 0.1) !important;
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2) !important;
        }
        
        /* Activity panels glassmorphism */
        .coder1-special-view-overlay .coder1-activity-panel,
        .coder1-special-view-overlay .coder1-terminal-panel,
        .coder1-special-view-overlay .coder1-communication-panel {
            background: rgba(0, 0, 0, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
        }
        
        /* Button styles */
        .coder1-special-view-overlay .coder1-btn,
        .coder1-special-view-overlay .coder1-start-btn {
            background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
            border: none !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }
        
        .coder1-special-view-overlay .coder1-btn:hover,
        .coder1-special-view-overlay .coder1-start-btn:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
        }
        
        /* Exit button */
        .coder1-special-view-overlay .coder1-exit-btn {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #a1a1aa !important;
            transition: all 0.2s !important;
        }
        
        .coder1-special-view-overlay .coder1-exit-btn:hover {
            background: #ef4444 !important;
            border-color: #ef4444 !important;
            color: white !important;
            transform: scale(1.05) !important;
        }
        
        /* Info cards */
        .coder1-special-view-overlay .info-card {
            background: rgba(139, 92, 246, 0.1) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(139, 92, 246, 0.3) !important;
            border-radius: 8px !important;
        }
        
        /* Agent cards */
        .coder1-special-view-overlay .coder1-agent-card {
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            transition: all 0.2s !important;
        }
        
        .coder1-special-view-overlay .coder1-agent-card:hover {
            border-color: #8b5cf6 !important;
            background: rgba(139, 92, 246, 0.1) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2) !important;
        }
        
        /* Terminal output */
        .coder1-special-view-overlay .terminal-output {
            background: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(5px) !important;
            -webkit-backdrop-filter: blur(5px) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-radius: 6px !important;
        }
        
        /* Progress bars */
        .coder1-special-view-overlay .progress-bar {
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 2px !important;
            overflow: hidden !important;
        }
        
        .coder1-special-view-overlay .progress-fill {
            background: linear-gradient(90deg, #8b5cf6, #6366f1) !important;
            height: 100% !important;
            border-radius: 2px !important;
            transition: width 0.3s ease !important;
        }
    `;
    
    // Add high-priority style to head
    if (document.head) {
        document.head.appendChild(style);
        console.log('✅ Glassmorphism styles injected');
    } else {
        // Wait for head to be available
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                document.head.appendChild(style);
                console.log('✅ Glassmorphism styles injected (delayed)');
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    
    // Also apply styles directly when special views are shown
    const originalShowSpecialView = window.showSpecialView;
    window.showSpecialView = function(viewType) {
        console.log('🎨 Intercepting showSpecialView to ensure glassmorphism...');
        
        // Call original function
        if (originalShowSpecialView) {
            originalShowSpecialView.call(this, viewType);
        }
        
        // Ensure styles are applied after a short delay
        setTimeout(() => {
            const panels = document.querySelectorAll('.coder1-glass-panel');
            panels.forEach(panel => {
                // Force browser to recalculate styles
                panel.style.display = 'none';
                panel.offsetHeight; // Force reflow
                panel.style.display = '';
                console.log('✅ Forced style recalculation on glass panel');
            });
        }, 100);
    };
    
    console.log('✅ Force glassmorphism script loaded');
})();