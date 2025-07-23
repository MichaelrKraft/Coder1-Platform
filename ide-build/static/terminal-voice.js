/**
 * Terminal Voice Integration
 * Adds push-to-talk voice input and TTS responses to the IDE terminal
 */

console.log('🎤 Loading Terminal Voice Integration...');

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

    waitForTerminalLoad() {
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkInterval = setInterval(() => {
            attempts++;
            console.log(`🔍 Attempt ${attempts}: Looking for terminal input...`);
            
            // Look for various terminal input selectors
            const inputs = document.querySelectorAll('input, textarea');
            console.log(`Found ${inputs.length} inputs/textareas on page`);
            
            // Log all inputs for debugging
            inputs.forEach((input, index) => {
                console.log(`Input ${index}:`, {
                    tagName: input.tagName,
                    placeholder: input.placeholder,
                    className: input.className,
                    id: input.id
                });
            });
            
            const prompt = document.querySelector('.terminal-input .prompt') || 
                          document.querySelector('.terminal-input') ||
                          document.querySelector('input[placeholder*="SuperClaude"]') ||
                          document.querySelector('input[placeholder*="React Bits"]') ||
                          document.querySelector('input[placeholder*="commands"]') ||
                          document.querySelector('.xterm-helpers textarea') ||
                          document.querySelector('.terminal textarea') ||
                          document.querySelector('.terminal input') ||
                          document.querySelector('input[type="text"]') ||
                          document.querySelector('textarea');
            
            if (prompt) {
                clearInterval(checkInterval);
                console.log('✅ Terminal found, adding voice button:', prompt);
                this.addVoiceToTerminalInput(prompt);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('⚠️ Terminal not found after waiting. All elements:', document.querySelectorAll('*').length);
                // Try to add to any text input as fallback
                const anyInput = document.querySelector('input[type="text"], textarea');
                if (anyInput) {
                    console.log('📢 Adding voice to fallback input:', anyInput);
                    this.addVoiceToTerminalInput(anyInput);
                }
            }
        }, 500);
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
        // Create a wrapper if it doesn't exist
        let wrapper = inputElement.parentElement;
        if (!wrapper.classList.contains('terminal-voice-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'terminal-voice-wrapper';
            wrapper.style.cssText = 'position: relative; display: flex; align-items: center;';
            
            inputElement.parentNode.insertBefore(wrapper, inputElement);
            wrapper.appendChild(inputElement);
        }

        // Create voice button
        const voiceBtn = document.createElement('button');
        voiceBtn.className = this.isMobile ? 'voice-toggle-btn terminal-voice-btn' : 'mic-prompt terminal-voice-btn';
        voiceBtn.title = this.isMobile ? 'Tap to record' : 'Hold to speak';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.cssText = `
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            background: rgba(255, 140, 0, 0.1);
            border: 2px solid #ff8c00;
            border-radius: 6px;
            padding: 8px 10px;
            color: #ff8c00;
            cursor: pointer;
            font-size: 14px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;

        // Add left padding to input to make room for button
        inputElement.style.paddingLeft = '50px';

        // Insert button at the beginning of wrapper
        wrapper.insertBefore(voiceBtn, inputElement);

        // Setup voice functionality
        if (this.isMobile) {
            this.setupMobileVoice(voiceBtn);
        } else {
            this.setupDesktopVoice(voiceBtn);
        }

        // Store reference for later use
        this.currentVoiceButton = voiceBtn;
        this.currentTerminalInput = inputElement;
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
            return;
        }

        if (this.isRecording) return;

        this.isRecording = true;
        this.updateMicIcon('recording');
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('🎤 Failed to start recording:', error);
            this.showTooltip("Microphone access required");
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
            this.speak("Got it", 0.8);
            setTimeout(() => {
                this.executeCommand();
            }, 500);
        } else {
            this.speak("Got it", 0.8);
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
        
        // Prefer female voices
        const voices = speechSynthesis.getVoices();
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
        
        utterance.onstart = () => {
            console.log('🔊 Speaking:', text.substring(0, 50));
        };
        
        utterance.onerror = (event) => {
            console.error('🔊 Speech synthesis error:', event.error);
        };
        
        speechSynthesis.speak(utterance);
    }

    addVoiceSettings() {
        // Add floating voice settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'voice-settings';
        settingsPanel.innerHTML = `
            <div class="voice-settings-header">
                <span>🎤 Voice Settings</span>
                <button class="settings-toggle">−</button>
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
            </div>
        `;

        document.body.appendChild(settingsPanel);

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
            const content = settingsPanel.querySelector('.voice-settings-content');
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? 'block' : 'none';
            settingsToggle.textContent = isCollapsed ? '−' : '+';
        });

        // Initially collapsed
        setTimeout(() => {
            const content = settingsPanel.querySelector('.voice-settings-content');
            content.style.display = 'none';
            settingsToggle.textContent = '+';
        }, 5000);
    }

    loadSettings() {
        return {
            voiceResponseEnabled: localStorage.getItem('terminal_voice_responses') !== 'false',
            voiceInputEnabled: localStorage.getItem('terminal_voice_input') !== 'false'
        };
    }

    saveSettings() {
        localStorage.setItem('terminal_voice_responses', this.settings.voiceResponseEnabled);
        localStorage.setItem('terminal_voice_input', this.settings.voiceInputEnabled);
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
    // Wait a bit for the React app to load
    setTimeout(() => {
        window.terminalVoice = new TerminalVoice();
        console.log('✅ Terminal Voice Integration loaded');
    }, 1000);
});

// Also try immediate initialization in case DOM is already loaded
if (document.readyState === 'loading') {
    // DOM not ready, wait for DOMContentLoaded
} else {
    // DOM is ready
    setTimeout(() => {
        if (!window.terminalVoice) {
            window.terminalVoice = new TerminalVoice();
            console.log('✅ Terminal Voice Integration loaded (immediate)');
        }
    }, 1000);
}