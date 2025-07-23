/**
 * SmartPRD Voice Integration
 * Adds voice input/output functionality to the SmartPRD Generator page
 */

console.log('🎤 Loading SmartPRD Voice Integration...');

class SmartPRDVoice {
    constructor() {
        this.settings = this.loadSettings();
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.recognition = null;
        this.isRecording = false;
        this.currentTooltip = null;
        this.isListening = false;
        this.currentQuestionIndex = 0;
        
        console.log('🎤 SmartPRD Voice initialized:', {
            isMobile: this.isMobile,
            settings: this.settings
        });
        
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.waitForPageLoad();
        this.addVoiceControls();
        this.setupMessageInputVoice();
        this.setupQuestionAnswering();
    }

    waitForPageLoad() {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkInterval = setInterval(() => {
            attempts++;
            const messageInput = document.getElementById('messageInput');
            
            if (messageInput) {
                clearInterval(checkInterval);
                console.log('✅ SmartPRD page found, adding voice functionality');
                this.enhanceMessageInput();
                this.setupAutoQuestionReading();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('⚠️ SmartPRD page not found after waiting');
            }
        }, 200);
    }

    enhanceMessageInput() {
        const messageInput = document.getElementById('messageInput');
        const inputWrapper = messageInput.closest('.input-wrapper');
        
        if (!inputWrapper) return;

        // Create voice button and position it on the left side
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-input-btn voice-input-left';
        voiceBtn.title = this.isMobile ? 'Tap to record' : 'Hold to speak';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        
        // Insert the voice button before the textarea (on the left side)
        inputWrapper.insertBefore(voiceBtn, messageInput);
        
        this.setupVoiceButton(voiceBtn);
    }

    setupVoiceButton(voiceBtn) {
        if (this.isMobile) {
            // Mobile: Toggle mode
            voiceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleRecording();
            });
        } else {
            // Desktop: Push-to-talk
            voiceBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.startRecording();
            });

            voiceBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.stopRecording();
            });

            voiceBtn.addEventListener('mouseleave', () => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            });
        }

        // Keyboard shortcut: Alt+V
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'v' && !this.isRecording) {
                e.preventDefault();
                this.startRecording();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'v' && this.isRecording) {
                e.preventDefault();
                this.stopRecording();
            }
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
            console.log('🎤 SmartPRD speech recognition started');
            this.onRecordingStart();
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            const confidence = event.results[0][0].confidence;
            console.log('🎤 SmartPRD speech recognized:', transcript, 'confidence:', confidence);
            this.onRecognitionResult(transcript, confidence);
        };

        this.recognition.onerror = (event) => {
            console.error('🎤 SmartPRD speech recognition error:', event.error);
            this.onRecognitionError(event);
        };

        this.recognition.onend = () => {
            console.log('🎤 SmartPRD speech recognition ended');
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
            this.showTooltip("Speech recognition not supported");
            return;
        }

        if (this.isRecording) return;

        this.isRecording = true;
        this.updateVoiceButton('recording');
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('🎤 Failed to start recording:', error);
            this.showTooltip("Microphone access required");
            this.isRecording = false;
            this.updateVoiceButton('idle');
        }
    }

    stopRecording() {
        if (!this.isRecording) return;

        this.isRecording = false;
        this.updateVoiceButton('processing');
        
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    onRecordingStart() {
        this.updateVoiceButton('recording');
        this.hideTooltip();
    }

    onRecordingEnd() {
        this.isRecording = false;
        this.updateVoiceButton('idle');
    }

    onRecognitionResult(transcript, confidence) {
        // Fill the message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = transcript;
            messageInput.focus();
            
            // Trigger input event to notify any listeners
            messageInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Provide voice confirmation
        this.speak("Got it", 0.8);

        // Auto-submit if high confidence and looks like a complete request
        if (confidence > 0.85 && this.isCompleteRequest(transcript)) {
            setTimeout(() => {
                this.submitMessage();
            }, 1000);
        }

        this.showTranscript(transcript, confidence);
    }

    onRecognitionError(event) {
        this.isRecording = false;
        this.updateVoiceButton('idle');

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

    isCompleteRequest(text) {
        // Check if the text looks like a complete project description
        const keywords = ['build', 'create', 'make', 'develop', 'app', 'website', 'platform', 'system'];
        const hasKeyword = keywords.some(keyword => text.toLowerCase().includes(keyword));
        const isLongEnough = text.length > 20;
        const hasVerb = /\b(build|create|make|develop|need|want|should|would|can|help)\b/i.test(text);
        
        return hasKeyword && isLongEnough && hasVerb;
    }

    submitMessage() {
        const sendBtn = document.getElementById('sendMessage');
        if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
        }
    }

    updateVoiceButton(state) {
        const voiceBtn = document.querySelector('.voice-input-btn');
        if (!voiceBtn) return;

        // Remove all state classes
        voiceBtn.classList.remove('recording', 'processing');
        
        switch(state) {
            case 'recording':
                voiceBtn.classList.add('recording');
                voiceBtn.title = this.isMobile ? 'Recording... tap to stop' : 'Recording... release to stop';
                break;
            case 'processing':
                voiceBtn.classList.add('processing');
                voiceBtn.title = 'Processing...';
                break;
            default: // idle
                voiceBtn.title = this.isMobile ? 'Tap to record' : 'Hold to speak';
                break;
        }
    }

    showTranscript(transcript, confidence) {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;

        const transcriptDiv = document.createElement('div');
        transcriptDiv.className = 'voice-transcript prd-transcript';
        transcriptDiv.innerHTML = `
            <span class="transcript-text">"${transcript}"</span>
            <span class="transcript-confidence">${Math.round(confidence * 100)}%</span>
        `;

        // Position above input
        const inputRect = messageInput.getBoundingClientRect();
        transcriptDiv.style.position = 'fixed';
        transcriptDiv.style.left = inputRect.left + 'px';
        transcriptDiv.style.top = (inputRect.top - 40) + 'px';
        transcriptDiv.style.zIndex = '10000';

        document.body.appendChild(transcriptDiv);

        // Remove after 4 seconds
        setTimeout(() => {
            if (transcriptDiv.parentNode) {
                transcriptDiv.remove();
            }
        }, 4000);
    }

    showTooltip(message) {
        this.hideTooltip();

        const voiceBtn = document.querySelector('.voice-input-btn');
        if (!voiceBtn) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'voice-tooltip prd-tooltip';
        tooltip.textContent = message;

        const buttonRect = voiceBtn.getBoundingClientRect();
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

    setupQuestionAnswering() {
        // Monitor for questions in the chat and provide voice answers
        this.observeQuestions();
    }

    observeQuestions() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkForNewQuestion(node);
                        }
                    });
                }
            });
        });

        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            observer.observe(chatMessages, {
                childList: true,
                subtree: true
            });
        }
    }

    checkForNewQuestion(element) {
        // Look for assistant messages containing questions
        if (element.classList && element.classList.contains('assistant-message')) {
            const messageContent = element.querySelector('.message-content');
            if (messageContent) {
                const text = messageContent.textContent;
                if (this.isQuestion(text) && this.settings.autoReadQuestions) {
                    // Auto-read questions
                    setTimeout(() => {
                        this.speakQuestion(text);
                    }, 500);
                }
            }
        }
    }

    isQuestion(text) {
        return text.includes('?') || 
               text.toLowerCase().includes('question') ||
               /\b(what|how|when|where|why|which|who)\b/i.test(text);
    }

    speakQuestion(text) {
        if (!this.settings.voiceResponseEnabled) return;
        
        // Clean up the text for better speech
        let cleanText = text.replace(/[*#]/g, '').trim();
        
        // Limit length for questions
        if (cleanText.length > 300) {
            cleanText = cleanText.substring(0, 300) + "...";
        }
        
        this.speak(cleanText);
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
            console.log('🔊 SmartPRD Speaking:', text.substring(0, 50));
        };
        
        utterance.onerror = (event) => {
            console.error('🔊 SmartPRD Speech synthesis error:', event.error);
        };
        
        speechSynthesis.speak(utterance);
    }

    addVoiceControls() {
        // Add floating voice settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'voice-settings prd-voice-settings';
        settingsPanel.innerHTML = `
            <div class="voice-settings-header">
                <span>🎤 Voice Settings</span>
                <button class="settings-toggle">−</button>
            </div>
            <div class="voice-settings-content">
                <label>
                    <input type="checkbox" id="prdVoiceResponseToggle" ${this.settings.voiceResponseEnabled ? 'checked' : ''}>
                    🔊 Read questions aloud
                </label>
                <label>
                    <input type="checkbox" id="prdVoiceInputToggle" ${this.settings.voiceInputEnabled ? 'checked' : ''}>
                    🎤 Voice input
                </label>
                <label>
                    <input type="checkbox" id="prdAutoReadToggle" ${this.settings.autoReadQuestions ? 'checked' : ''}>
                    📖 Auto-read new questions
                </label>
            </div>
        `;

        document.body.appendChild(settingsPanel);

        // Event listeners
        const responseToggle = document.getElementById('prdVoiceResponseToggle');
        const inputToggle = document.getElementById('prdVoiceInputToggle');
        const autoReadToggle = document.getElementById('prdAutoReadToggle');
        const settingsToggle = settingsPanel.querySelector('.settings-toggle');

        responseToggle.addEventListener('change', (e) => {
            this.settings.voiceResponseEnabled = e.target.checked;
            this.saveSettings();
        });

        inputToggle.addEventListener('change', (e) => {
            this.settings.voiceInputEnabled = e.target.checked;
            this.saveSettings();
            
            // Show/hide voice button
            const voiceBtn = document.querySelector('.voice-input-btn');
            if (voiceBtn) {
                voiceBtn.style.display = e.target.checked ? 'inline-block' : 'none';
            }
        });

        autoReadToggle.addEventListener('change', (e) => {
            this.settings.autoReadQuestions = e.target.checked;
            this.saveSettings();
        });

        settingsToggle.addEventListener('click', () => {
            const content = settingsPanel.querySelector('.voice-settings-content');
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? 'block' : 'none';
            settingsToggle.textContent = isCollapsed ? '−' : '+';
        });

        // Initially collapsed after 5 seconds
        setTimeout(() => {
            const content = settingsPanel.querySelector('.voice-settings-content');
            content.style.display = 'none';
            settingsToggle.textContent = '+';
        }, 5000);
    }

    setupMessageInputVoice() {
        // Add styles for voice button
        const style = document.createElement('style');
        style.textContent = `
            .voice-input-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                color: #565f89;
                font-size: 16px;
                transition: all 0.2s ease;
                border-radius: 6px;
                margin-right: 8px;
            }
            
            .voice-input-btn.voice-input-left {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
                background: rgba(255, 255, 255, 0.1);
                margin-right: 0;
                border-radius: 6px;
                padding: 10px;
                backdrop-filter: blur(5px);
                border: 2px solid #ff8c00;
                box-shadow: 0 0 6px rgba(255, 140, 0, 0.3), 0 0 12px rgba(255, 140, 0, 0.15);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ff8c00;
            }
            
            .voice-input-btn.voice-input-left i {
                font-size: 16px;
                text-shadow: 0 0 4px rgba(255, 140, 0, 0.4);
                filter: drop-shadow(0 0 2px rgba(255, 140, 0, 0.3));
            }
            
            .input-wrapper {
                position: relative;
            }
            
            .input-wrapper #messageInput {
                padding-left: 65px !important;
                border-radius: 10px !important;
            }
            
            .voice-input-btn:hover {
                color: #7aa2f7;
                background: rgba(122, 162, 247, 0.1);
            }
            
            .voice-input-btn.recording {
                color: #f7768e !important;
                animation: voicePulse 1s ease-in-out infinite;
            }
            
            .voice-input-btn.processing {
                color: #7aa2f7 !important;
            }
            
            .voice-input-btn.processing i {
                animation: voiceSpin 1s linear infinite;
            }
            
            .prd-voice-settings {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1a1b26;
                border: 1px solid #414868;
                border-radius: 8px;
                font-size: 13px;
                z-index: 10000;
                min-width: 200px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            }
            
            .prd-transcript {
                background: #24283b;
                border: 1px solid #414868;
                color: #c0caf5;
            }
            
            .prd-tooltip {
                background: #24283b;
                border: 1px solid #414868;
                color: #a9b1d6;
            }
            
            @keyframes voicePulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
            
            @keyframes voiceSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setupAutoQuestionReading() {
        // Read the initial assistant message if auto-read is enabled
        if (this.settings.autoReadQuestions) {
            setTimeout(() => {
                const assistantMessages = document.querySelectorAll('.assistant-message .message-content p');
                if (assistantMessages.length > 0) {
                    const firstMessage = assistantMessages[0].textContent;
                    this.speak(firstMessage);
                }
            }, 2000);
        }
    }

    loadSettings() {
        return {
            voiceResponseEnabled: localStorage.getItem('prd_voice_responses') !== 'false',
            voiceInputEnabled: localStorage.getItem('prd_voice_input') !== 'false',
            autoReadQuestions: localStorage.getItem('prd_auto_read') === 'true'
        };
    }

    saveSettings() {
        localStorage.setItem('prd_voice_responses', this.settings.voiceResponseEnabled);
        localStorage.setItem('prd_voice_input', this.settings.voiceInputEnabled);
        localStorage.setItem('prd_auto_read', this.settings.autoReadQuestions);
        console.log('💾 SmartPRD Voice settings saved:', this.settings);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the page to load
    setTimeout(() => {
        window.smartPRDVoice = new SmartPRDVoice();
        console.log('✅ SmartPRD Voice Integration loaded');
    }, 1000);
});

// Also try immediate initialization in case DOM is already loaded
if (document.readyState === 'loading') {
    // DOM not ready, wait for DOMContentLoaded
} else {
    // DOM is ready
    setTimeout(() => {
        if (!window.smartPRDVoice) {
            window.smartPRDVoice = new SmartPRDVoice();
            console.log('✅ SmartPRD Voice Integration loaded (immediate)');
        }
    }, 1000);
}