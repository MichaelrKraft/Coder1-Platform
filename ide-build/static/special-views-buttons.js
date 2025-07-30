// Special Views Buttons - Adds special view buttons to terminal header
(function() {
    'use strict';
    
    // Special view states
    let specialViewStates = {
        supervision: false,
        sleepMode: false,
        infiniteLoop: false,
        parallelAgents: false
    };
    
    // Create special view overlay
    function createSpecialViewOverlay(type, title, content, color) {
        // Remove any existing overlay
        const existing = document.querySelector('.special-view-overlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'special-view-overlay';
        overlay.dataset.viewType = type;
        
        // Create view based on type
        switch(type) {
            case 'supervision':
                overlay.innerHTML = createSupervisionView();
                break;
            case 'sleepMode':
                overlay.innerHTML = createSleepModeView();
                break;
            case 'infiniteLoop':
                overlay.innerHTML = createInfiniteLoopView();
                break;
            case 'parallelAgents':
                overlay.innerHTML = createParallelAgentsView();
                break;
            default:
                overlay.innerHTML = createDefaultView(title, content, color);
        }
        
        document.body.appendChild(overlay);
        
        // Add exit functionality
        const exitBtn = overlay.querySelector('.exit-btn');
        if (exitBtn) {
            exitBtn.onclick = () => overlay.remove();
        }
    }
    
    // Supervision View
    function createSupervisionView() {
        return `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #1a0a0a 0%, #2a1515 100%);
                color: white;
                font-family: 'Monaco', 'Menlo', monospace;
                overflow: hidden;
            ">
                <div style="padding: 40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                        <h1 style="font-size: 48px; color: #ff6b35; text-shadow: 0 0 20px #ff6b35; margin: 0;">
                            👁️ Supervision Mode
                        </h1>
                        <button class="exit-btn" style="
                            background: #ff6b35;
                            border: none;
                            padding: 12px 24px;
                            font-size: 16px;
                            color: white;
                            cursor: pointer;
                            border-radius: 8px;
                            transition: all 0.3s;
                        ">Exit Supervision</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div style="background: rgba(255, 107, 53, 0.1); border: 1px solid #ff6b35; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #ff6b35; margin-bottom: 10px;">Agent Status</h3>
                            <div style="font-size: 24px; color: #00ff00;">● Active</div>
                            <div style="margin-top: 10px; opacity: 0.8;">
                                <div>Tasks Completed: 42</div>
                                <div>Current Task: Code Analysis</div>
                                <div>Uptime: 2h 34m</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255, 107, 53, 0.1); border: 1px solid #ff6b35; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #ff6b35; margin-bottom: 10px;">System Resources</h3>
                            <div style="margin-top: 10px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>CPU Usage</span>
                                    <span>34%</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #ff6b35; width: 34%; height: 100%;"></div>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; margin: 16px 0 8px;">
                                    <span>Memory</span>
                                    <span>2.1 GB / 8 GB</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #ff6b35; width: 26%; height: 100%;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255, 107, 53, 0.1); border: 1px solid #ff6b35; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #ff6b35; margin-bottom: 10px;">Activity Monitor</h3>
                            <div style="max-height: 120px; overflow-y: auto;">
                                <div style="margin-bottom: 8px; opacity: 0.9;">[14:23:45] File analysis completed</div>
                                <div style="margin-bottom: 8px; opacity: 0.8;">[14:23:12] Running code optimization</div>
                                <div style="margin-bottom: 8px; opacity: 0.7;">[14:22:58] Detected pattern match</div>
                                <div style="margin-bottom: 8px; opacity: 0.6;">[14:22:34] Initializing scan...</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 40px; background: rgba(255, 107, 53, 0.1); border: 1px solid #ff6b35; padding: 20px; border-radius: 12px;">
                        <h3 style="color: #ff6b35; margin-bottom: 20px;">Real-time Monitoring</h3>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                            <div>
                                <div style="font-size: 36px; color: #ff6b35;">156</div>
                                <div style="opacity: 0.8;">Files Processed</div>
                            </div>
                            <div>
                                <div style="font-size: 36px; color: #ff6b35;">23</div>
                                <div style="opacity: 0.8;">Issues Found</div>
                            </div>
                            <div>
                                <div style="font-size: 36px; color: #ff6b35;">98.2%</div>
                                <div style="opacity: 0.8;">Accuracy</div>
                            </div>
                            <div>
                                <div style="font-size: 36px; color: #ff6b35;">0.3s</div>
                                <div style="opacity: 0.8;">Avg Response</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Default view for other modes (temporary)
    function createDefaultView(title, content, color) {
        return `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, ${color} 100%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: 'Monaco', 'Menlo', monospace;
            ">
                <div style="text-align: center; max-width: 800px; padding: 40px;">
                    <h1 style="font-size: 48px; margin-bottom: 20px; color: ${color}; text-shadow: 0 0 20px ${color};">
                        ${title}
                    </h1>
                    <div style="font-size: 18px; line-height: 1.6; margin-bottom: 40px;">
                        ${content}
                    </div>
                    <button class="exit-btn" style="
                        background: ${color};
                        border: none;
                        padding: 12px 24px;
                        font-size: 16px;
                        color: white;
                        cursor: pointer;
                        border-radius: 8px;
                        transition: all 0.3s;
                    ">
                        Exit ${title}
                    </button>
                </div>
            </div>
        `;
    }
    
    // Sleep Mode View
    function createSleepModeView() {
        return `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0a0f1a 0%, #1a2a3a 100%);
                color: white;
                font-family: 'Monaco', 'Menlo', monospace;
                overflow: hidden;
            ">
                <div style="padding: 40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                        <h1 style="font-size: 48px; color: #4a9eff; text-shadow: 0 0 20px #4a9eff; margin: 0;">
                            🌙 Sleep Mode
                        </h1>
                        <button class="exit-btn" style="
                            background: #4a9eff;
                            border: none;
                            padding: 12px 24px;
                            font-size: 16px;
                            color: white;
                            cursor: pointer;
                            border-radius: 8px;
                            transition: all 0.3s;
                        ">Wake Up</button>
                    </div>
                    
                    <div style="text-align: center; margin: 60px 0;">
                        <div style="position: relative; display: inline-block;">
                            <div style="
                                width: 200px;
                                height: 200px;
                                border-radius: 50%;
                                background: radial-gradient(circle, #4a9eff 0%, transparent 70%);
                                animation: pulse 3s ease-in-out infinite;
                                position: relative;
                            "></div>
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                font-size: 80px;
                            ">💤</div>
                        </div>
                        <p style="margin-top: 40px; font-size: 24px; color: #4a9eff;">
                            System is in low-power state
                        </p>
                        <p style="opacity: 0.7; font-size: 16px;">
                            All non-essential processes have been suspended
                        </p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px;">
                        <div style="background: rgba(74, 158, 255, 0.1); border: 1px solid #4a9eff; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 36px; color: #4a9eff; margin-bottom: 10px;">⏸️</div>
                            <h3 style="color: #4a9eff; margin: 10px 0;">Processes Paused</h3>
                            <div style="font-size: 24px;">23</div>
                        </div>
                        
                        <div style="background: rgba(74, 158, 255, 0.1); border: 1px solid #4a9eff; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 36px; color: #4a9eff; margin-bottom: 10px;">🔋</div>
                            <h3 style="color: #4a9eff; margin: 10px 0;">Power Saved</h3>
                            <div style="font-size: 24px;">78%</div>
                        </div>
                        
                        <div style="background: rgba(74, 158, 255, 0.1); border: 1px solid #4a9eff; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 36px; color: #4a9eff; margin-bottom: 10px;">⏱️</div>
                            <h3 style="color: #4a9eff; margin: 10px 0;">Sleep Duration</h3>
                            <div style="font-size: 24px;">12:34</div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes pulse {
                        0% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.1); }
                        100% { opacity: 0.3; transform: scale(1); }
                    }
                </style>
            </div>
        `;
    }
    
    function createInfiniteLoopView() {
        return `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #1a0a1a 0%, #2a1a2a 100%);
                color: white;
                font-family: 'Monaco', 'Menlo', monospace;
                overflow: hidden;
            ">
                <div style="padding: 40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                        <h1 style="font-size: 48px; color: #9d4edd; text-shadow: 0 0 20px #9d4edd; margin: 0;">
                            ♾️ Infinite Loop Mode
                        </h1>
                        <button class="exit-btn" style="
                            background: #9d4edd;
                            border: none;
                            padding: 12px 24px;
                            font-size: 16px;
                            color: white;
                            cursor: pointer;
                            border-radius: 8px;
                            transition: all 0.3s;
                        ">Stop Loop</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
                        <div style="background: rgba(157, 78, 221, 0.1); border: 1px solid #9d4edd; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #9d4edd; margin-bottom: 15px;">Loop Status</h3>
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                <div style="
                                    width: 12px;
                                    height: 12px;
                                    background: #00ff00;
                                    border-radius: 50%;
                                    animation: pulse-green 1s infinite;
                                "></div>
                                <span style="font-size: 18px; color: #00ff00;">Running</span>
                            </div>
                            <div style="margin-top: 15px; opacity: 0.8;">
                                <div>Current Iteration: 127</div>
                                <div>Loop Duration: 45m 12s</div>
                                <div>Avg Time/Iteration: 21.3s</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(157, 78, 221, 0.1); border: 1px solid #9d4edd; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #9d4edd; margin-bottom: 15px;">Generation Metrics</h3>
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Success Rate</span>
                                    <span>94.5%</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #9d4edd; width: 94.5%; height: 100%;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Output Quality</span>
                                    <span>87.2%</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #9d4edd; width: 87.2%; height: 100%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 40px; background: rgba(157, 78, 221, 0.1); border: 1px solid #9d4edd; padding: 20px; border-radius: 12px;">
                        <h3 style="color: #9d4edd; margin-bottom: 20px;">Recent Output</h3>
                        <div style="
                            background: #000;
                            padding: 15px;
                            border-radius: 8px;
                            font-family: 'Monaco', monospace;
                            max-height: 200px;
                            overflow-y: auto;
                            border: 1px solid #333;
                        ">
                            <div style="color: #9d4edd; margin-bottom: 5px;">[Iteration 127] Generating response...</div>
                            <div style="color: #c0caf5; margin-bottom: 5px;">→ Processing user input: "Create a landing page"</div>
                            <div style="color: #7aa2f7; margin-bottom: 5px;">→ Analyzing requirements...</div>
                            <div style="color: #9ece6a; margin-bottom: 5px;">✓ Generated HTML structure</div>
                            <div style="color: #9ece6a; margin-bottom: 5px;">✓ Generated CSS styling</div>
                            <div style="color: #f7768e; margin-bottom: 5px;">⚠ Minor adjustment needed</div>
                            <div style="color: #9d4edd; margin-bottom: 5px;">[Iteration 128] Starting...</div>
                            <div style="color: #c0caf5;">→ Refining previous output...</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                        <div>
                            <div style="font-size: 36px; color: #9d4edd;">127</div>
                            <div style="opacity: 0.8;">Iterations</div>
                        </div>
                        <div>
                            <div style="font-size: 36px; color: #9d4edd;">3.2k</div>
                            <div style="opacity: 0.8;">Lines Generated</div>
                        </div>
                        <div>
                            <div style="font-size: 36px; color: #9d4edd;">12</div>
                            <div style="opacity: 0.8;">Improvements</div>
                        </div>
                        <div>
                            <div style="font-size: 36px; color: #9d4edd;">0</div>
                            <div style="opacity: 0.8;">Errors</div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes pulse-green {
                        0% { opacity: 1; }
                        50% { opacity: 0.3; }
                        100% { opacity: 1; }
                    }
                </style>
            </div>
        `;
    }
    
    function createParallelAgentsView() {
        return `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0a1a1a 0%, #1a2a3a 100%);
                color: white;
                font-family: 'Monaco', 'Menlo', monospace;
                overflow: hidden;
            ">
                <div style="padding: 40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                        <h1 style="font-size: 48px; color: #00b4d8; text-shadow: 0 0 20px #00b4d8; margin: 0;">
                            ⚡ Parallel Agents
                        </h1>
                        <button class="exit-btn" style="
                            background: #00b4d8;
                            border: none;
                            padding: 12px 24px;
                            font-size: 16px;
                            color: white;
                            cursor: pointer;
                            border-radius: 8px;
                            transition: all 0.3s;
                        ">Stop Agents</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                        <div style="background: rgba(0, 180, 216, 0.1); border: 1px solid #00b4d8; padding: 20px; border-radius: 12px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                <div style="
                                    width: 12px;
                                    height: 12px;
                                    background: #00ff00;
                                    border-radius: 50%;
                                    animation: pulse-active 1.5s infinite;
                                "></div>
                                <h3 style="color: #00b4d8; margin: 0;">Agent Alpha</h3>
                            </div>
                            <div style="margin-bottom: 10px; opacity: 0.9;">Task: Frontend Development</div>
                            <div style="margin-bottom: 10px; opacity: 0.8;">Status: Creating React components</div>
                            <div style="font-size: 12px; opacity: 0.7;">Uptime: 23m 45s</div>
                            <div style="margin-top: 10px;">
                                <div style="background: #333; height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div style="background: #00b4d8; width: 78%; height: 100%; animation: progress-alpha 2s ease-in-out infinite;"></div>
                                </div>
                                <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">Progress: 78%</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(0, 180, 216, 0.1); border: 1px solid #00b4d8; padding: 20px; border-radius: 12px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                <div style="
                                    width: 12px;
                                    height: 12px;
                                    background: #ffff00;
                                    border-radius: 50%;
                                    animation: pulse-working 1s infinite;
                                "></div>
                                <h3 style="color: #00b4d8; margin: 0;">Agent Beta</h3>
                            </div>
                            <div style="margin-bottom: 10px; opacity: 0.9;">Task: Backend API</div>
                            <div style="margin-bottom: 10px; opacity: 0.8;">Status: Database optimization</div>
                            <div style="font-size: 12px; opacity: 0.7;">Uptime: 31m 12s</div>
                            <div style="margin-top: 10px;">
                                <div style="background: #333; height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div style="background: #00b4d8; width: 45%; height: 100%;"></div>
                                </div>
                                <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">Progress: 45%</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(0, 180, 216, 0.1); border: 1px solid #00b4d8; padding: 20px; border-radius: 12px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                <div style="
                                    width: 12px;
                                    height: 12px;
                                    background: #00ff00;
                                    border-radius: 50%;
                                    animation: pulse-active 1.8s infinite;
                                "></div>
                                <h3 style="color: #00b4d8; margin: 0;">Agent Gamma</h3>
                            </div>
                            <div style="margin-bottom: 10px; opacity: 0.9;">Task: Testing & QA</div>
                            <div style="margin-bottom: 10px; opacity: 0.8;">Status: Running test suites</div>
                            <div style="font-size: 12px; opacity: 0.7;">Uptime: 18m 33s</div>
                            <div style="margin-top: 10px;">
                                <div style="background: #333; height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div style="background: #00b4d8; width: 92%; height: 100%;"></div>
                                </div>
                                <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">Progress: 92%</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
                        <div style="background: rgba(0, 180, 216, 0.1); border: 1px solid #00b4d8; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #00b4d8; margin-bottom: 20px;">Agent Communication Log</h3>
                            <div style="
                                background: #000;
                                padding: 15px;
                                border-radius: 8px;
                                font-family: 'Monaco', monospace;
                                max-height: 200px;
                                overflow-y: auto;
                                border: 1px solid #333;
                            ">
                                <div style="color: #00b4d8; margin-bottom: 5px;">[Alpha] → [Beta]: Component API ready for integration</div>
                                <div style="color: #7aa2f7; margin-bottom: 5px;">[Beta] → [Gamma]: Database schema updated, please test</div>
                                <div style="color: #9ece6a; margin-bottom: 5px;">[Gamma] → [All]: Test suite passing, 97% coverage</div>
                                <div style="color: #f7768e; margin-bottom: 5px;">[System]: Load balancing agents across tasks...</div>
                                <div style="color: #00b4d8; margin-bottom: 5px;">[Alpha] → [Beta]: Requesting user data validation</div>
                                <div style="color: #bb9af7; margin-bottom: 5px;">[Coordinator]: Synchronizing agent outputs...</div>
                                <div style="color: #7aa2f7;">[Beta] → [Alpha]: Validation complete, ready for deploy</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(0, 180, 216, 0.1); border: 1px solid #00b4d8; padding: 20px; border-radius: 12px;">
                            <h3 style="color: #00b4d8; margin-bottom: 20px;">System Metrics</h3>
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>CPU Usage</span>
                                    <span>67%</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #00b4d8; width: 67%; height: 100%;"></div>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Memory</span>
                                    <span>5.2 GB</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #00b4d8; width: 43%; height: 100%;"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Efficiency</span>
                                    <span>89%</span>
                                </div>
                                <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #00b4d8; width: 89%; height: 100%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                        <div>
                            <div style="font-size: 36px; color: #00b4d8;">3</div>
                            <div style="opacity: 0.8;">Active Agents</div>
                        </div>
                        <div>
                            <div style="font-size: 36px; color: #00b4d8;">47</div>
                            <div style="opacity: 0.8;">Tasks Completed</div>
                        </div>
                        <div>
                            <div style="font-size: 36px; color: #00b4d8;">12.3s</div>
                            <div style="opacity: 0.8;">Avg Response</div>
                        </div>
                        <div>
                            <div style="font-size: 36px; color: #00b4d8;">94%</div>
                            <div style="opacity: 0.8;">Success Rate</div>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes pulse-active {
                        0% { opacity: 1; }
                        50% { opacity: 0.3; }
                        100% { opacity: 1; }
                    }
                    @keyframes pulse-working {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                    @keyframes progress-alpha {
                        0% { width: 78%; }
                        50% { width: 82%; }
                        100% { width: 78%; }
                    }
                </style>
            </div>
        `;
    }
    
    // Add special view buttons to terminal header
    function addSpecialViewButtons() {
        const terminalHeader = document.querySelector('.terminal-header');
        if (!terminalHeader) return;
        
        // Check if buttons already exist
        if (terminalHeader.querySelector('.special-view-buttons')) return;
        
        // Ensure terminal header has proper styling
        terminalHeader.style.display = 'flex';
        terminalHeader.style.alignItems = 'center';
        terminalHeader.style.justifyContent = 'space-between';
        terminalHeader.style.padding = '8px 16px';
        terminalHeader.style.background = '#1a1b26';
        terminalHeader.style.borderBottom = '1px solid #414868';
        
        // Add terminal title on the left if it doesn't exist
        let titleElement = terminalHeader.querySelector('.terminal-title');
        if (!titleElement) {
            titleElement = document.createElement('div');
            titleElement.className = 'terminal-title';
            titleElement.style.cssText = 'color: #c0caf5; font-size: 14px; display: flex; align-items: center; gap: 8px;';
            titleElement.innerHTML = '🖥️ SuperClaude Terminal';
            terminalHeader.prepend(titleElement);
        }
        
        // Find or create right side container
        let rightContainer = terminalHeader.querySelector('.terminal-header-right');
        if (!rightContainer) {
            rightContainer = document.createElement('div');
            rightContainer.className = 'terminal-header-right';
            rightContainer.style.cssText = 'display: flex; gap: 12px; align-items: center;';
            terminalHeader.appendChild(rightContainer);
        }
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'special-view-buttons';
        buttonContainer.style.cssText = 'display: flex; gap: 8px; margin-right: auto;';
        
        // Define buttons with proper icons
        const buttons = [
            {
                id: 'supervision',
                icon: '👁',
                title: 'Supervision',
                color: '#ff6b35',
                bgColor: 'rgba(255, 107, 53, 0.2)'
            },
            {
                id: 'sleepMode',
                icon: '🌙',
                title: 'Sleep Mode',
                color: '#4a9eff',
                bgColor: 'rgba(74, 158, 255, 0.2)'
            },
            {
                id: 'infiniteLoop',
                icon: '♾️',
                title: 'Infinite Loop',
                color: '#9d4edd',
                bgColor: 'rgba(157, 78, 221, 0.2)'
            },
            {
                id: 'parallelAgents',
                icon: '⚡',
                title: 'Parallel Agents',
                color: '#00b4d8',
                bgColor: 'rgba(0, 180, 216, 0.2)'
            }
        ];
        
        // Create buttons to match the design
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `special-view-btn ${btn.id}-btn`;
            button.style.cssText = `
                background: ${btn.bgColor};
                border: 1px solid ${btn.color};
                color: ${btn.color};
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-weight: 500;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                min-width: 80px;
                position: relative;
            `;
            
            // Create icon and text separately for better styling
            button.innerHTML = `
                <span style="font-size: 20px; line-height: 1;">${btn.icon}</span>
                <span style="font-size: 11px; opacity: 0.9;">${btn.title}</span>
            `;
            
            button.onmouseover = function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = `0 4px 12px ${btn.bgColor}`;
            };
            
            button.onmouseout = function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            };
            
            button.onclick = function() {
                createSpecialViewOverlay(btn.id, btn.title, '', btn.color);
            };
            
            buttonContainer.appendChild(button);
        });
        
        // Insert before existing buttons
        const existingButtons = rightContainer.querySelector('.voice-button, .stop-button');
        if (existingButtons) {
            rightContainer.insertBefore(buttonContainer, existingButtons);
        } else {
            rightContainer.appendChild(buttonContainer);
        }
    }
    
    // Wait for terminal to be ready
    function waitForTerminal() {
        const checkInterval = setInterval(() => {
            if (document.querySelector('.terminal-header')) {
                clearInterval(checkInterval);
                addSpecialViewButtons();
            }
        }, 100);
        
        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForTerminal);
    } else {
        waitForTerminal();
    }
    
    // Re-add buttons if terminal is recreated
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node.classList?.contains('terminal-header') || node.querySelector?.('.terminal-header'))) {
                        setTimeout(addSpecialViewButtons, 100);
                    }
                });
            }
        });
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();