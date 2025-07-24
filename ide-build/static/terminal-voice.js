/**
 * Terminal Voice Integration
 * Adds push-to-talk voice input and TTS responses to the IDE terminal
 */

console.log('🎤 Loading Terminal Voice Integration...', new Date().toISOString());

class TerminalVoice {
    constructor() {
        this.settings = this.loadSettings();
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.recognition = null;
        this.isRecording = false;
        this.currentTooltip = null;
        this.simpleCommands = ['ls', 'pwd', 'cd', 'whoami', 'date', 'clear', 'help', 'cat', 'mkdir', 'rm', 'cp', 'mv'];
        
        console.log('🎤 Terminal Voice initialized:', {
            isMobile: this.isMobile,
            settings: this.settings
        });
        
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.waitForTerminalLoad();
        this.addVoiceSettings();
    }

    isInProjectFilesArea(element) {
        // Check if the element or its parents are in the project files/explorer area
        let current = element;
        while (current && current !== document.body) {
            const className = (current.className || '').toLowerCase();
            const id = (current.id || '').toLowerCase();
            
            // Common patterns for file explorer/project files areas
            const isFileExplorer = className.includes('explorer') ||
                                 className.includes('file-tree') ||
                                 className.includes('project-files') ||
                                 className.includes('sidebar') ||
                                 className.includes('file-list') ||
                                 className.includes('directory') ||
                                 className.includes('folder') ||
                                 id.includes('explorer') ||
                                 id.includes('files') ||
                                 id.includes('sidebar');
            
            if (isFileExplorer) {
                console.log('📁 Element is in project files area:', current);
                return true;
            }
            
            // Also check by position - if it's in the left sidebar area
            const rect = current.getBoundingClientRect();
            if (rect.width > 0 && rect.left < window.innerWidth * 0.25 && 
                rect.width < window.innerWidth * 0.3) {
                // It's in the left 25% and narrow like a sidebar
                console.log('📁 Element in left sidebar position:', current);
                return true;
            }
            
            current = current.parentElement;
        }
        return false;
    }
    
    waitForTerminalLoad() {
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkInterval = setInterval(() => {
            attempts++;
            if (attempts % 10 === 1) { // Log less frequently
                console.log(`🔍 Attempt ${attempts}: Looking for terminal input...`);
            }
            
            // Debug: Log all visible inputs with their positions
            const allInputs = document.querySelectorAll('input, textarea');
            console.log('🔍 DEBUG: All visible inputs on page:');
            allInputs.forEach((input, index) => {
                const rect = input.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    console.log(`  ${index}: ${input.tagName} at (${Math.round(rect.left)}, ${Math.round(rect.top)}) - ${rect.width}x${rect.height}`, 
                        `placeholder: "${input.placeholder}"`, 
                        `classes: "${input.className}"`,
                        input);
                }
            });

            // CHARACTERISTIC-BASED TERMINAL DETECTION - Look for terminal by properties, not position
            let prompt = null;
            let terminalCandidates = [];
            
            console.log('🔍 TERMINAL DETECTION: Checking', allInputs.length, 'inputs');
            
            allInputs.forEach((input, index) => {
                const rect = input.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                
                if (isVisible) {
                    // First check if this input is in an excluded area
                    const isInProjectFiles = this.isInProjectFilesArea(input);
                    if (isInProjectFiles) {
                        console.log(`🔍 Input ${index}: ❌ EXCLUDED - In project files area`);
                        return; // Skip this input
                    }
                    
                    // Check characteristics that identify a terminal input
                    const placeholder = (input.placeholder || '').toLowerCase();
                    const className = (input.className || '').toLowerCase();
                    const id = (input.id || '').toLowerCase();
                    const type = input.type || 'text';
                    const value = (input.value || '').toLowerCase();
                    
                    // Terminal input patterns - more specific now
                    const hasTerminalPlaceholder = (placeholder.includes('type') && placeholder.includes('command')) || 
                                                  placeholder.includes('superclaude') ||
                                                  placeholder.includes('terminal') ||
                                                  (placeholder.includes('/') && placeholder.includes('for')) ||
                                                  placeholder === '$';
                    
                    const hasTerminalClass = className.includes('terminal') || 
                                           className.includes('prompt') || 
                                           className.includes('command-input') ||
                                           className.includes('xterm');
                    
                    const hasTerminalId = id.includes('terminal') || 
                                        id.includes('prompt') || 
                                        id.includes('command');
                    
                    // Check parent elements for terminal context
                    const parentClasses = input.parentElement ? (input.parentElement.className || '').toLowerCase() : '';
                    const hasTerminalParent = parentClasses.includes('terminal') || 
                                            parentClasses.includes('prompt') ||
                                            parentClasses.includes('xterm');
                    
                    // Calculate terminal likelihood score
                    let score = 0;
                    if (hasTerminalPlaceholder) score += 50; // Increased weight for specific placeholders
                    if (hasTerminalClass) score += 40;
                    if (hasTerminalId) score += 30;
                    if (hasTerminalParent) score += 30;
                    if (type === 'text' && rect.width > 400) score += 20; // Terminal inputs are wide
                    
                    console.log(`🔍 Input ${index}:`, {
                        position: `(${Math.round(rect.left)}, ${Math.round(rect.top)})`,
                        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                        placeholder: placeholder || 'none',
                        className: className || 'none',
                        score: score,
                        characteristics: {
                            hasTerminalPlaceholder,
                            hasTerminalClass,
                            hasTerminalId,
                            hasTerminalParent
                        }
                    });
                    
                    // Higher threshold for terminal candidates
                    if (score >= 30) {
                        terminalCandidates.push({ input, rect, score });
                        console.log(`  ✅ TERMINAL CANDIDATE with score ${score}`);
                    } else {
                        console.log(`  ❌ NOT A TERMINAL: Score ${score} below threshold`);
                    }
                }
            });
            
            // Select the best candidate based on score
            if (terminalCandidates.length > 0) {
                // Sort by score (highest first), then by position (bottom-most as tiebreaker)
                terminalCandidates.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.rect.top - a.rect.top; // Prefer bottom inputs as tiebreaker
                });
                
                prompt = terminalCandidates[0].input;
                console.log('🎯 TERMINAL SELECTED:', {
                    score: terminalCandidates[0].score,
                    position: `(${Math.round(terminalCandidates[0].rect.left)}, ${Math.round(terminalCandidates[0].rect.top)})`,
                    placeholder: prompt.placeholder || 'none'
                });
            } else {
                console.log('⚠️ NO TERMINAL CANDIDATES FOUND');
            }
            
            // Simple fallback - use any text input that's visible and reasonable size
            if (!prompt && allInputs.length > 0) {
                console.log('🔄 FALLBACK: Looking for any reasonable text input...');
                
                // Find the bottom-most visible text input
                let bottomMostInput = null;
                let maxY = 0;
                
                allInputs.forEach(input => {
                    const rect = input.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0;
                    const isReasonableSize = rect.width > 100 && rect.height > 20 && rect.height < 100;
                    const isTextInput = input.type === 'text' || input.tagName === 'TEXTAREA';
                    
                    if (isVisible && isReasonableSize && isTextInput && rect.top > maxY) {
                        bottomMostInput = input;
                        maxY = rect.top;
                        console.log('🔄 Fallback candidate:', {
                            position: `(${Math.round(rect.left)}, ${Math.round(rect.top)})`,
                            size: `${Math.round(rect.width)}x${Math.round(rect.height)}`
                        });
                    }
                });
                
                if (bottomMostInput) {
                    prompt = bottomMostInput;
                    const finalRect = prompt.getBoundingClientRect();
                    console.log('🎯 FALLBACK SELECTED: Using bottom-most input at:', 
                        `(${Math.round(finalRect.left)}, ${Math.round(finalRect.top)})`);
                } else {
                    console.log('❌ NO SUITABLE INPUT FOUND - microphone will not be added');
                }
            }
            
            if (prompt && !prompt.classList.contains('voice-enabled')) {
                clearInterval(checkInterval);
                console.log('✅ Terminal input found, adding voice button:', prompt);
                prompt.classList.add('voice-enabled'); // Mark as processed
                this.addVoiceToTerminalInput(prompt);
                
                // Also set up observer for new inputs
                this.observeForNewInputs();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('⚠️ No suitable input found after waiting');
                // Still set up observer for future inputs
                this.observeForNewInputs();
            }
        }, 500);
    }

    observeForNewInputs() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the new node is an input with terminal characteristics
                        if ((node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') && !node.classList.contains('voice-enabled')) {
                            // Check if it has terminal characteristics
                            const placeholder = (node.placeholder || '').toLowerCase();
                            const className = (node.className || '').toLowerCase();
                            const hasTerminalChar = placeholder.includes('type') || 
                                                  placeholder.includes('command') || 
                                                  placeholder.includes('superclaude') ||
                                                  className.includes('terminal') ||
                                                  className.includes('prompt');
                            
                            if (hasTerminalChar) {
                                console.log('🆕 New terminal input detected:', node);
                                node.classList.add('voice-enabled');
                                this.addVoiceToTerminalInput(node);
                            }
                        }
                        // Also check children
                        const inputs = node.querySelectorAll ? node.querySelectorAll('input:not(.voice-enabled), textarea:not(.voice-enabled)') : [];
                        inputs.forEach(input => {
                            const placeholder = (input.placeholder || '').toLowerCase();
                            const className = (input.className || '').toLowerCase();
                            const hasTerminalChar = placeholder.includes('type') || 
                                                  placeholder.includes('command') || 
                                                  placeholder.includes('superclaude') ||
                                                  className.includes('terminal') ||
                                                  className.includes('prompt');
                            
                            if (hasTerminalChar) {
                                console.log('🆕 New child terminal input detected:', input);
                                input.classList.add('voice-enabled');
                                this.addVoiceToTerminalInput(input);
                            }
                        });
                    }
                });
            });
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('👀 Observing for new inputs...');
        }
    }

    addVoiceToTerminalInput(terminalElement) {
        // Handle different types of terminal inputs
        if (terminalElement.tagName === 'INPUT' || terminalElement.tagName === 'TEXTAREA') {
            // It's an input/textarea, add voice button to the left
            this.addVoiceButtonToInput(terminalElement);
        } else {
            // It's a container, look for prompt inside or use original method
            this.replacePromptWithVoice();
        }
    }

    addVoiceButtonToInput(inputElement) {
        console.log('🎤 Adding voice button to input:', inputElement);
        
        // Remove any existing voice buttons first
        const existingButtons = document.querySelectorAll('.mic-prompt, .voice-toggle-btn, .terminal-voice-btn');
        existingButtons.forEach(btn => {
            console.log('🗑️ Removing existing voice button');
            btn.remove();
        });

        // Get input position for validation
        const inputRect = inputElement.getBoundingClientRect();
        const inputStyle = window.getComputedStyle(inputElement);
        
        // Check if this input is in project files area
        const isInProjectFiles = this.isInProjectFilesArea(inputElement);
        const isReasonableSize = inputRect.width > 100 && inputRect.height > 20;
        
        console.log('🎤 MICROPHONE VALIDATION:', {
            position: `(${Math.round(inputRect.left)}, ${Math.round(inputRect.top)})`,
            size: `${Math.round(inputRect.width)}x${Math.round(inputRect.height)}`,
            placeholder: inputElement.placeholder || 'none',
            className: inputElement.className || 'none',
            isInProjectFiles,
            isReasonableSize
        });
        
        // Exclude project files area
        if (isInProjectFiles) {
            console.log('❌ REJECTED: Input is in project files area');
            return;
        }
        
        if (!isReasonableSize) {
            console.log('❌ REJECTED: Input too small');
            return;
        }
        
        console.log('✅ ADDING MICROPHONE to input');
        
        // Create a wrapper if the input doesn't have one
        let wrapper = inputElement.parentElement;
        if (!wrapper || !wrapper.classList.contains('terminal-input-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'terminal-input-wrapper';
            // Don't use inline styles - let CSS handle it
            inputElement.parentNode.insertBefore(wrapper, inputElement);
            wrapper.appendChild(inputElement);
        }
        
        // Create voice button with absolute positioning relative to wrapper
        const voiceBtn = document.createElement('button');
        voiceBtn.className = this.isMobile ? 'voice-toggle-btn terminal-voice-btn' : 'mic-prompt terminal-voice-btn';
        voiceBtn.title = this.isMobile ? 'Tap to record' : 'Hold to speak (or press Ctrl+Space)';
        voiceBtn.innerHTML = '🎤'; // Use emoji as fallback if FontAwesome not available
        
        // Use CSS classes for positioning instead of inline styles for the position
        voiceBtn.style.cssText = `
            position: absolute !important;
            left: 8px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 1000 !important;
        `;
        
        // Add to wrapper so it moves with the input
        wrapper.appendChild(voiceBtn);
        
        console.log('🎤 Created voice button in wrapper');

        // Add left padding to input to make room for button
        const paddingNeeded = 40; // Fixed padding for microphone space (reduced for smaller button)
        inputElement.style.paddingLeft = `${paddingNeeded}px !important`;
        
        console.log('📝 Added padding to input:', paddingNeeded, 'px');

        // Monitor for panel resizing using ResizeObserver
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    console.log('📐 Panel resized, microphone will stay in position');
                    // The microphone will automatically stay in position since it's absolutely positioned within the wrapper
                }
            });
            
            // Observe the terminal panel or the input's container
            const terminalPanel = inputElement.closest('.terminal-panel, .terminal-container, [class*="terminal"]');
            if (terminalPanel) {
                resizeObserver.observe(terminalPanel);
            }
        }

        // Setup voice functionality
        if (this.isMobile) {
            this.setupMobileVoice(voiceBtn);
        } else {
            this.setupDesktopVoice(voiceBtn);
        }

        // Store reference for later use
        this.currentVoiceButton = voiceBtn;
        this.currentTerminalInput = inputElement;
        
        console.log('✅ Voice button successfully added and positioned');
    }

    replacePromptWithVoice() {
        const prompt = document.querySelector('.terminal-input .prompt');
        if (!prompt) return;

        if (this.isMobile) {
            // Mobile: Toggle button mode
            prompt.innerHTML = `
                <button class="voice-toggle-btn" title="Toggle voice recording">
                    <i class="fas fa-microphone"></i>
                </button>
            `;
            this.setupMobileVoice();
        } else {
            // Desktop: Push-to-talk
            prompt.innerHTML = `
                <button class="mic-prompt" title="Hold to speak">
                    <i class="fas fa-microphone"></i>
                </button>
            `;
            this.setupDesktopVoice();
        }
    }

    setupDesktopVoice(micBtn) {
        if (!micBtn) {
            micBtn = document.querySelector('.mic-prompt');
        }
        if (!micBtn) return;

        // Mouse events for desktop push-to-talk
        micBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startRecording();
        });

        micBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.stopRecording();
        });

        micBtn.addEventListener('mouseleave', (e) => {
            if (this.isRecording) {
                this.stopRecording();
            }
        });

        // Keyboard shortcut: Ctrl+Space
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.code === 'Space' && !this.isRecording) {
                e.preventDefault();
                this.startRecording();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.ctrlKey && e.code === 'Space' && this.isRecording) {
                e.preventDefault();
                this.stopRecording();
            }
        });
    }

    setupMobileVoice(toggleBtn) {
        if (!toggleBtn) {
            toggleBtn = document.querySelector('.voice-toggle-btn');
        }
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleRecording();
        });

        // Touch events
        toggleBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('⚠️ Speech recognition not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            this.onRecordingStart();
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            const confidence = event.results[0][0].confidence;
            console.log('🎤 Speech recognized:', transcript, 'confidence:', confidence);
            this.onRecognitionResult(event);
        };

        this.recognition.onerror = (event) => {
            console.error('🎤 Speech recognition error:', event.error);
            this.onRecognitionError(event);
        };

        this.recognition.onend = () => {
            console.log('🎤 Speech recognition ended');
            this.onRecordingEnd();
        };
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        if (!this.recognition) {
            this.showTooltip("Speech recognition not supported in this browser");
            console.error('🎤 Speech recognition not available. Try Chrome or Edge.');
            alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        if (this.isRecording) return;

        this.isRecording = true;
        this.updateMicIcon('recording');
        
        try {
            this.recognition.start();
            console.log('🎤 Started recording...');
        } catch (error) {
            console.error('🎤 Failed to start recording:', error);
            let errorMessage = "Microphone access required";
            
            if (error.message.includes('not-allowed')) {
                errorMessage = "Microphone access denied. Please allow microphone access in browser settings.";
            } else if (error.message.includes('not-found')) {
                errorMessage = "No microphone found. Please connect a microphone.";
            } else if (error.message.includes('already started')) {
                // Recognition already running, just return
                return;
            }
            
            this.showTooltip(errorMessage);
            alert(errorMessage); // Also show alert for visibility
            this.isRecording = false;
            this.updateMicIcon('idle');
        }
    }

    stopRecording() {
        if (!this.isRecording) return;

        this.isRecording = false;
        this.updateMicIcon('processing');
        
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    onRecordingStart() {
        this.updateMicIcon('recording');
        this.hideTooltip();
    }

    onRecordingEnd() {
        this.isRecording = false;
        this.updateMicIcon('idle');
    }

    onRecognitionResult(event) {
        const transcript = event.results[0][0].transcript.trim();
        const confidence = event.results[0][0].confidence;
        
        // Fill terminal input field
        const input = document.querySelector('.terminal-input input[type="text"]');
        if (input) {
            input.value = transcript;
            input.focus();
        }

        // Auto-execute simple commands with high confidence
        if (confidence > 0.8 && this.isSimpleCommand(transcript)) {
            // Silent acknowledgment - removed "Got it" speech
            setTimeout(() => {
                this.executeCommand();
            }, 500);
        } else {
            // Silent acknowledgment - removed "Got it" speech
        }

        this.showTranscript(transcript, confidence);
    }

    onRecognitionError(event) {
        this.isRecording = false;
        this.updateMicIcon('idle');

        switch(event.error) {
            case 'not-allowed':
                this.showTooltip("Microphone access required");
                break;
            case 'no-speech':
                this.showTooltip("No speech detected");
                break;
            case 'network':
                this.showTooltip("Network error - try again");
                break;
            case 'aborted':
                // Silent - user probably released button quickly
                break;
            default:
                this.showTooltip("Speech recognition error");
        }
    }

    isSimpleCommand(command) {
        const cmd = command.toLowerCase().split(' ')[0];
        return this.simpleCommands.includes(cmd);
    }

    executeCommand() {
        // Look for form submission or enter key simulation
        const form = document.querySelector('.terminal-input');
        const input = document.querySelector('.terminal-input input[type="text"]');
        
        if (form && typeof form.onsubmit === 'function') {
            form.onsubmit();
        } else if (input) {
            // Simulate Enter key press
            const enterEvent = new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true
            });
            input.dispatchEvent(enterEvent);
        }
    }

    updateMicIcon(state) {
        const icon = document.querySelector('.mic-prompt i, .voice-toggle-btn i');
        const button = document.querySelector('.mic-prompt, .voice-toggle-btn');
        
        if (!icon || !button) return;

        // Remove all state classes
        button.classList.remove('recording', 'processing');
        
        switch(state) {
            case 'recording':
                button.classList.add('recording');
                button.title = this.isMobile ? 'Recording... tap to stop' : 'Recording... release to stop';
                break;
            case 'processing':
                button.classList.add('processing');
                button.title = 'Processing...';
                break;
            default: // idle
                button.title = this.isMobile ? 'Tap to record voice command' : 'Hold to speak';
                break;
        }
    }

    showTranscript(transcript, confidence) {
        // Show transcript briefly above the input
        const input = document.querySelector('.terminal-input input[type="text"]');
        if (!input) return;

        const transcriptDiv = document.createElement('div');
        transcriptDiv.className = 'voice-transcript';
        transcriptDiv.innerHTML = `
            <span class="transcript-text">"${transcript}"</span>
            <span class="transcript-confidence">${Math.round(confidence * 100)}%</span>
        `;

        // Position above input
        const inputRect = input.getBoundingClientRect();
        transcriptDiv.style.position = 'fixed';
        transcriptDiv.style.left = inputRect.left + 'px';
        transcriptDiv.style.top = (inputRect.top - 40) + 'px';
        transcriptDiv.style.zIndex = '10000';

        document.body.appendChild(transcriptDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            if (transcriptDiv.parentNode) {
                transcriptDiv.remove();
            }
        }, 3000);
    }

    showTooltip(message) {
        this.hideTooltip();

        const button = document.querySelector('.mic-prompt, .voice-toggle-btn');
        if (!button) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'voice-tooltip';
        tooltip.textContent = message;

        const buttonRect = button.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = buttonRect.left + 'px';
        tooltip.style.top = (buttonRect.top - 35) + 'px';
        tooltip.style.zIndex = '10001';

        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideTooltip();
        }, 3000);
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    // Voice response with smart filtering
    speakCommandResult(output) {
        if (!this.settings.voiceResponseEnabled) return;
        if (!output || output.length < 3) return;
        
        // Summarize long outputs
        let textToSpeak = output;
        if (output.length > 200) {
            const lines = output.split('\n');
            if (lines.length > 10) {
                textToSpeak = `Output has ${lines.length} lines. First few: ${lines.slice(0, 3).join('. ')}`;
            } else {
                textToSpeak = output.substring(0, 200) + "... output truncated";
            }
        }

        // Always speak errors
        if (output.toLowerCase().includes('error') || output.toLowerCase().includes('failed')) {
            textToSpeak = `Error: ${textToSpeak}`;
        }

        // Skip binary or encoded content
        if (this.isBinaryContent(output)) {
            textToSpeak = "Binary or encoded content displayed";
        }

        this.speak(textToSpeak);
    }

    isBinaryContent(text) {
        // Simple check for binary content
        const binaryChars = text.match(/[\x00-\x08\x0E-\x1F\x7F-\xFF]/g);
        return binaryChars && binaryChars.length > text.length * 0.1;
    }

    speak(text, volume = 1.0) {
        if (!text || text.length === 0) return;

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; // User's preferred speed
        utterance.volume = volume;
        
        const voices = speechSynthesis.getVoices();
        
        // Use selected voice if available
        if (this.settings.selectedVoice) {
            const selectedVoice = voices.find(v => v.name === this.settings.selectedVoice);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('🔊 Using selected voice:', selectedVoice.name);
            }
        } else {
            // Prefer female voices if no voice selected
            const femaleVoices = voices.filter(v => 
                v.name.toLowerCase().includes('female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Victoria') ||
                v.name.includes('Karen') ||
                v.name.includes('Moira') ||
                v.name.includes('Fiona')
            );
            
            if (femaleVoices.length > 0) {
                utterance.voice = femaleVoices[0];
            } else {
                // Fallback to any English voice
                const englishVoice = voices.find(v => v.lang.startsWith('en'));
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }
            }
        }
        
        utterance.onstart = () => {
            console.log('🔊 Speaking:', text.substring(0, 50));
        };
        
        utterance.onerror = (event) => {
            console.error('🔊 Speech synthesis error:', event.error);
        };
        
        speechSynthesis.speak(utterance);
    }

    addVoiceSettings() {
        // Create main settings section container
        let settingsSection = document.querySelector('.settings-section');
        if (!settingsSection) {
            settingsSection = document.createElement('div');
            settingsSection.className = 'settings-section';
            document.body.appendChild(settingsSection);
        }

        // Add Settings label/header
        let settingsLabel = settingsSection.querySelector('.settings-label');
        if (!settingsLabel) {
            settingsLabel = document.createElement('div');
            settingsLabel.className = 'settings-label';
            settingsLabel.innerHTML = '<span>⚙️ Settings</span>';
            settingsSection.appendChild(settingsLabel);
        }

        // Create buttons container
        let buttonsContainer = settingsSection.querySelector('.settings-buttons');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'settings-buttons';
            settingsSection.appendChild(buttonsContainer);
        }

        // Add Voice Settings button
        const voiceToggleBtn = document.createElement('button');
        voiceToggleBtn.className = 'settings-btn voice-settings-btn';
        voiceToggleBtn.innerHTML = '<span>🎤 Voice Settings</span>';
        voiceToggleBtn.onclick = () => {
            const panel = document.querySelector('.voice-settings');
            if (panel) {
                const isVisible = panel.style.display !== 'none';
                panel.style.display = isVisible ? 'none' : 'block';
            }
        };
        
        // Add IDE Settings button
        const ideSettingsBtn = document.createElement('button');
        ideSettingsBtn.className = 'settings-btn ide-settings-btn';
        ideSettingsBtn.innerHTML = '<span>⚙️ IDE Settings</span>';
        ideSettingsBtn.onclick = () => {
            console.log('IDE Settings clicked - looking for documentation panel trigger');
            
            // Look for the robot icon button in the header that opens documentation
            const robotButtons = document.querySelectorAll('button[title*="Documentation"], button[aria-label*="Documentation"], .action-btn:has(svg), button:has(.robot-icon), button');
            let found = false;
            
            robotButtons.forEach(btn => {
                // Skip our own buttons
                if (btn.closest('.settings-section')) return;
                
                const btnText = btn.textContent || '';
                const btnTitle = btn.getAttribute('title') || '';
                const btnAriaLabel = btn.getAttribute('aria-label') || '';
                const innerHTML = btn.innerHTML || '';
                
                // Look for robot emoji or documentation references
                if (btnText.includes('🤖') || 
                    btnTitle.toLowerCase().includes('documentation') || 
                    btnAriaLabel.toLowerCase().includes('documentation') ||
                    innerHTML.includes('robot') ||
                    innerHTML.includes('M12') || // Common SVG path for robot icons
                    innerHTML.includes('documentation')) {
                    
                    const rect = btn.getBoundingClientRect();
                    // Check if it's visible and in header area (top of screen)
                    if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 0.2) {
                        console.log('Found documentation button in header:', btn);
                        btn.click();
                        found = true;
                        return;
                    }
                }
            });
            
            if (!found) {
                // Fallback: Look for any element that might trigger documentation
                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    if (el.textContent === '🤖' && !el.closest('.settings-section')) {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 0.2) {
                            console.log('Found robot emoji element, clicking it and parent:', el);
                            el.click();
                            if (el.parentElement) el.parentElement.click();
                            found = true;
                        }
                    }
                });
            }
            
            if (!found) {
                console.log('Could not find documentation trigger. Please click the robot icon in the header manually.');
                // As a last resort, alert the user
                alert('Please click the robot icon (🤖) in the top header bar to open IDE documentation.');
            }
        };
        
        // Add Documentation button (moved from header)
        const docBtn = document.createElement('button');
        docBtn.className = 'settings-btn documentation-btn';
        docBtn.innerHTML = '<span>🤖 Documentation</span>';
        docBtn.onclick = () => {
            // Preserve original documentation functionality
            window.open('https://docs.anthropic.com/en/docs/claude-code', '_blank');
        };
        
        // Clear existing buttons and add in order
        buttonsContainer.innerHTML = '';
        buttonsContainer.appendChild(voiceToggleBtn);
        buttonsContainer.appendChild(ideSettingsBtn);
        buttonsContainer.appendChild(docBtn);
        
        // Hide robot icon from header (if it exists)
        this.hideRobotIconFromHeader();
        
        // Hide background "Settings" text that appears behind our buttons
        this.hideBackgroundSettingsText();
        
        // Hide the settings gear icon in terminal area
        this.hideSettingsGearIcon();

        // Add floating voice settings panel (hidden by default)
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'voice-settings';
        settingsPanel.style.display = 'none'; // Hidden by default
        settingsPanel.innerHTML = `
            <div class="voice-settings-header">
                <span>🎤 Voice Settings</span>
                <button class="settings-toggle">×</button>
            </div>
            <div class="voice-settings-content">
                <label>
                    <input type="checkbox" id="voiceResponseToggle" ${this.settings.voiceResponseEnabled ? 'checked' : ''}>
                    🔊 Voice responses
                </label>
                <label>
                    <input type="checkbox" id="voiceInputToggle" ${this.settings.voiceInputEnabled ? 'checked' : ''}>
                    🎤 Voice input
                </label>
                <div class="voice-selector-container" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #414868;">
                    <label style="display: block; margin-bottom: 8px; color: #a9b1d6;">TTS Voice:</label>
                    <select id="voiceSelector" style="width: 100%; padding: 8px; background: #1a1b26; color: #c0caf5; border: 1px solid #414868; border-radius: 4px; font-size: 13px;">
                        <option value="">Loading voices...</option>
                    </select>
                    <button id="testVoiceBtn" style="margin-top: 8px; padding: 8px 12px; background: #7aa2f7; color: #1a1b26; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-size: 13px; font-weight: 500; transition: all 0.2s;">
                        🔊 Test Selected Voice
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(settingsPanel);
    }
    
    hideSettingsGearIcon() {
        // Hide settings/gear icons that appear in the terminal area
        const settingsSelectors = [
            '.settings-icon',
            '.gear-icon', 
            '.fa-cog',
            '.fa-gear',
            '.fa-settings',
            'button:has(.fa-cog)',
            'button:has(.fa-gear)',
            'button:has(.fa-settings)',
            '[title*="Settings"]',
            '[aria-label*="Settings"]',
            'button[class*="settings"]',
            '.terminal-settings',
            '.terminal-config'
        ];
        
        settingsSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Only hide if it's in the terminal area (bottom part of screen)
                    const rect = el.getBoundingClientRect();
                    if (rect.top > window.innerHeight * 0.5) {
                        console.log('🚫 Hiding settings gear icon in terminal area:', el);
                        el.style.display = 'none !important';
                        el.style.visibility = 'hidden !important';
                        el.style.opacity = '0 !important';
                    }
                });
            } catch (e) {
                console.log('Selector not supported:', selector);
            }
        });
        
        // Also check for elements with gear/settings text or icons
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isInTerminalArea = rect.top > window.innerHeight * 0.5;
            
            if (isInTerminalArea && rect.width > 0 && rect.height > 0) {
                const text = el.textContent?.toLowerCase() || '';
                const title = el.getAttribute('title')?.toLowerCase() || '';
                const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
                const classes = el.className?.toLowerCase() || '';
                const innerHTML = el.innerHTML?.toLowerCase() || '';
                
                // Check for settings-related content
                const hasSettingsContent = text.includes('settings') || 
                                         title.includes('settings') || 
                                         ariaLabel.includes('settings') ||
                                         classes.includes('settings') ||
                                         innerHTML.includes('fa-cog') ||
                                         innerHTML.includes('fa-gear') ||
                                         innerHTML.includes('⚙') ||
                                         innerHTML.includes('🔧');
                
                if (hasSettingsContent && el.tagName !== 'SCRIPT' && !el.classList.contains('settings-btn')) {
                    console.log('🚫 Hiding settings element in terminal area:', el.tagName, text.substring(0, 20));
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    el.style.opacity = '0 !important';
                }
            }
        });
    }
    
    hideBackgroundSettingsText() {
        // CONSERVATIVE approach - only hide very specific background Settings text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            // SAFETY CHECK: Never touch our custom Settings section
            if (el.classList.contains('settings-section') || 
                el.classList.contains('settings-btn') || 
                el.classList.contains('settings-label') || 
                el.closest('.settings-section') ||
                el.querySelector('.settings-section') ||
                el.innerHTML.includes('Voice Settings') ||
                el.innerHTML.includes('IDE Settings') ||
                el.innerHTML.includes('Documentation')) {
                return; // Skip our elements entirely
            }
            
            const text = el.textContent?.trim() || '';
            
            // VERY specific targeting: only pure "Settings" text elements
            if (text === 'Settings' && 
                el.children.length === 0 && // No child elements
                el.tagName !== 'BUTTON' && // Not a button
                el.tagName !== 'A' && // Not a link
                !el.onclick && // No click handlers
                !el.getAttribute('role')) { // No ARIA roles
                
                const rect = el.getBoundingClientRect();
                // Only hide if it's really in the background (small or positioned behind)
                const isProbablyBackground = rect.width < 100 || rect.height < 30 || 
                                           (rect.left < 200 && rect.bottom > window.innerHeight - 200);
                
                if (isProbablyBackground) {
                    console.log('🗑️ Hiding background Settings text:', el.tagName, text, el);
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    el.style.opacity = '0 !important';
                }
            }
        });
        
        // Reduced frequency - only check every 5 seconds
        setTimeout(() => {
            this.hideBackgroundSettingsText();
        }, 5000);
    }
    
    hideRobotIconFromHeader() {
        // Hide various possible robot/documentation icons from header
        const selectors = [
            '.action-btn:has([title*="Documentation"])',
            '.action-btn:has([title*="Help"])',
            '.action-btn:has([title*="Robot"])',
            'button[title*="Documentation"]',
            'button[title*="Help"]',
            'button[title*="Robot"]',
            '[class*="doc-btn"]',
            '[class*="help-btn"]',
            '[class*="robot-btn"]',
            '.header-actions button:has(🤖)',
            '.header-right button:has(🤖)'
        ];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    console.log('🚫 Hiding robot/doc icon from header:', el);
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    el.style.opacity = '0 !important';
                });
            } catch (e) {
                // Some selectors might not be supported in all browsers
                console.log('Selector not supported:', selector);
            }
        });
        
        // Also search by text content
        const allButtons = document.querySelectorAll('button, .action-btn');
        allButtons.forEach(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            const title = btn.getAttribute('title')?.toLowerCase() || '';
            const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
            
            if (text.includes('documentation') || text.includes('help') || text.includes('robot') ||
                title.includes('documentation') || title.includes('help') || title.includes('robot') ||
                ariaLabel.includes('documentation') || ariaLabel.includes('help') || ariaLabel.includes('robot') ||
                btn.innerHTML.includes('🤖')) {
                
                // Only hide if it's in the header area
                const isInHeader = btn.closest('.header, .header-actions, .header-right, .header-left, .action-btn');
                if (isInHeader) {
                    console.log('🚫 Hiding robot/doc button from header by text/title:', btn);
                    btn.style.display = 'none !important';
                    btn.style.visibility = 'hidden !important';
                    btn.style.opacity = '0 !important';
                }
            }
        });
        
        // MORE AGGRESSIVE: Search for robot emoji anywhere in header
        console.log('🤖 Aggressive robot emoji removal...');
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            // Skip our custom settings
            if (el.closest('.settings-section')) return;
            
            const text = el.textContent?.trim() || '';
            const innerHTML = el.innerHTML || '';
            
            // Check for robot emoji
            if (text === '🤖' || (innerHTML.includes('🤖') && el.children.length === 0)) {
                const rect = el.getBoundingClientRect();
                // Check if it's in the header area (top 20% of screen)
                if (rect.top < window.innerHeight * 0.2 && rect.width > 0 && rect.height > 0) {
                    console.log('🚫 REMOVING robot emoji element from header:', el);
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    el.style.opacity = '0 !important';
                    el.style.width = '0 !important';
                    el.style.height = '0 !important';
                    // Also try to remove from DOM
                    try {
                        el.remove();
                    } catch (e) {
                        console.log('Could not remove element');
                    }
                }
            }
        });
        
        // Run this periodically to catch dynamically added robot icons
        setTimeout(() => {
            this.hideRobotIconFromHeader();
        }, 3000);

        // Event listeners
        const responseToggle = document.getElementById('voiceResponseToggle');
        const inputToggle = document.getElementById('voiceInputToggle');
        const settingsToggle = settingsPanel.querySelector('.settings-toggle');

        responseToggle.addEventListener('change', (e) => {
            this.settings.voiceResponseEnabled = e.target.checked;
            this.saveSettings();
        });

        inputToggle.addEventListener('change', (e) => {
            this.settings.voiceInputEnabled = e.target.checked;
            this.saveSettings();
            
            // Show/hide voice button
            const voiceBtn = document.querySelector('.mic-prompt, .voice-toggle-btn');
            if (voiceBtn) {
                voiceBtn.style.display = e.target.checked ? 'inline-block' : 'none';
            }
        });

        settingsToggle.addEventListener('click', () => {
            settingsPanel.style.display = 'none';
        });

        // Voice selection functionality
        const voiceSelector = document.getElementById('voiceSelector');
        const testVoiceBtn = document.getElementById('testVoiceBtn');

        // Load available voices
        this.loadVoices(voiceSelector);
        
        // Voice selection handler
        voiceSelector.addEventListener('change', (e) => {
            this.settings.selectedVoice = e.target.value;
            this.saveSettings();
            console.log('🔊 Selected voice:', e.target.value);
        });

        // Test voice button
        testVoiceBtn.addEventListener('click', () => {
            const selectedVoice = voiceSelector.value;
            if (selectedVoice) {
                this.speak("Hello! This is a test of the selected voice. I can read terminal output and responses to you.", true);
            } else {
                this.speak("Please select a voice first.", true);
            }
        });

        // Also reload voices when they change (some browsers load them async)
        if ('onvoiceschanged' in speechSynthesis) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices(voiceSelector);
            };
        }
    }

    loadVoices(selector) {
        const voices = speechSynthesis.getVoices();
        console.log('🔊 Available voices:', voices.length);
        
        // Clear existing options
        selector.innerHTML = '';
        
        if (voices.length === 0) {
            selector.innerHTML = '<option value="">No voices available</option>';
            return;
        }
        
        // Group voices by language
        const voicesByLang = {};
        voices.forEach(voice => {
            const lang = voice.lang;
            if (!voicesByLang[lang]) {
                voicesByLang[lang] = [];
            }
            voicesByLang[lang].push(voice);
        });
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a voice...';
        selector.appendChild(defaultOption);
        
        // Add voices grouped by language
        Object.keys(voicesByLang).sort().forEach(lang => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = lang;
            
            voicesByLang[lang].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} ${voice.localService ? '(Local)' : '(Online)'}`;
                
                // Select previously saved voice or default
                if (this.settings.selectedVoice === voice.name) {
                    option.selected = true;
                }
                
                optgroup.appendChild(option);
            });
            
            selector.appendChild(optgroup);
        });
    }

    loadSettings() {
        return {
            voiceResponseEnabled: localStorage.getItem('terminal_voice_responses') !== 'false',
            voiceInputEnabled: localStorage.getItem('terminal_voice_input') !== 'false',
            selectedVoice: localStorage.getItem('terminal_selected_voice') || ''
        };
    }

    saveSettings() {
        localStorage.setItem('terminal_voice_responses', this.settings.voiceResponseEnabled);
        localStorage.setItem('terminal_voice_input', this.settings.voiceInputEnabled);
        localStorage.setItem('terminal_selected_voice', this.settings.selectedVoice || '');
        console.log('💾 Voice settings saved:', this.settings);
    }

    // Monitor terminal output for voice responses
    monitorTerminalOutput() {
        // This would need to hook into the terminal's output system
        // For now, it's a placeholder for future integration
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.textContent && node.textContent.trim()) {
                            this.speakCommandResult(node.textContent);
                        }
                    });
                }
            });
        });

        const terminal = document.querySelector('.terminal-content');
        if (terminal) {
            observer.observe(terminal, {
                childList: true,
                subtree: true
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎤 DOMContentLoaded event fired');
    // Wait a bit for the React app to load
    setTimeout(() => {
        try {
            window.terminalVoice = new TerminalVoice();
            console.log('✅ Terminal Voice Integration loaded via DOMContentLoaded');
        } catch (error) {
            console.error('❌ Failed to initialize Terminal Voice:', error);
        }
    }, 1000);
});

// Also try immediate initialization in case DOM is already loaded
if (document.readyState === 'loading') {
    console.log('🎤 Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('🎤 Document already loaded, initializing after delay');
    setTimeout(() => {
        if (!window.terminalVoice) {
            try {
                window.terminalVoice = new TerminalVoice();
                console.log('✅ Terminal Voice Integration loaded (immediate)');
            } catch (error) {
                console.error('❌ Failed to initialize Terminal Voice (immediate):', error);
            }
        }
    }, 1000);
}

// Add debugging for script load
console.log('🎤 Terminal Voice script fully loaded, waiting for initialization...');