/**
 * Voice API Routes
 * Handles voice-related functionality including TTS and settings
 */

const express = require('express');
const router = express.Router();

// In-memory session storage (in production, use Redis or database)
const voiceSessions = new Map();

// Create voice session
router.post('/session', (req, res) => {
    try {
        const { userId = 'anonymous' } = req.body;
        const sessionId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const session = {
            id: sessionId,
            userId: userId,
            createdAt: new Date(),
            lastActivity: new Date(),
            settings: {
                speed: 1.1,
                voice: 'female',
                volume: 1.0,
                voiceResponseEnabled: true,
                voiceInputEnabled: true
            }
        };
        
        voiceSessions.set(sessionId, session);
        
        console.log(`🎤 Voice session created: ${sessionId} for user: ${userId}`);
        
        res.json({
            success: true,
            sessionId: sessionId,
            settings: session.settings
        });
        
    } catch (error) {
        console.error('❌ Error creating voice session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create voice session',
            error: error.message
        });
    }
});

// Text-to-Speech endpoint
router.post('/tts', async (req, res) => {
    try {
        const { text, sessionId, voice = 'female', speed = 1.1 } = req.body;
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Text parameter is required'
            });
        }
        
        // Update session activity if sessionId provided
        if (sessionId && voiceSessions.has(sessionId)) {
            const session = voiceSessions.get(sessionId);
            session.lastActivity = new Date();
        }
        
        console.log(`🔊 TTS request: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        
        // Check for OpenAI API key
        const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
        
        if (hasOpenAI) {
            // Future: OpenAI TTS implementation
            try {
                const ttsResponse = await generateOpenAITTS(text, voice, speed);
                return res.json({
                    success: true,
                    mode: 'openai',
                    audioUrl: ttsResponse.audioUrl,
                    duration: ttsResponse.duration
                });
            } catch (openaiError) {
                console.warn('⚠️ OpenAI TTS failed, falling back to browser:', openaiError.message);
                // Fall through to browser mode
            }
        }
        
        // Browser TTS mode (default)
        res.json({
            success: true,
            mode: 'browser',
            message: 'Using browser speech synthesis',
            settings: {
                speed: speed,
                voice: voice,
                text: text
            }
        });
        
    } catch (error) {
        console.error('❌ TTS error:', error);
        res.status(500).json({
            success: false,
            message: 'Text-to-speech failed',
            error: error.message
        });
    }
});

// Get voice settings
router.get('/settings/:sessionId?', (req, res) => {
    try {
        const { sessionId } = req.params;
        
        let settings = {
            speed: 1.1,
            voice: 'female',
            volume: 1.0,
            voiceResponseEnabled: true,
            voiceInputEnabled: true,
            autoReadQuestions: false
        };
        
        if (sessionId && voiceSessions.has(sessionId)) {
            const session = voiceSessions.get(sessionId);
            session.lastActivity = new Date();
            settings = { ...settings, ...session.settings };
        }
        
        res.json({
            success: true,
            settings: settings,
            sessionId: sessionId
        });
        
    } catch (error) {
        console.error('❌ Error getting settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get voice settings',
            error: error.message
        });
    }
});

// Update voice settings
router.post('/settings/:sessionId?', (req, res) => {
    try {
        const { sessionId } = req.params;
        const { settings } = req.body;
        
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Settings object is required'
            });
        }
        
        // Validate settings
        const validSettings = {};
        if (typeof settings.speed === 'number' && settings.speed >= 0.5 && settings.speed <= 2.0) {
            validSettings.speed = settings.speed;
        }
        if (typeof settings.voice === 'string') {
            validSettings.voice = settings.voice;
        }
        if (typeof settings.volume === 'number' && settings.volume >= 0 && settings.volume <= 1) {
            validSettings.volume = settings.volume;
        }
        if (typeof settings.voiceResponseEnabled === 'boolean') {
            validSettings.voiceResponseEnabled = settings.voiceResponseEnabled;
        }
        if (typeof settings.voiceInputEnabled === 'boolean') {
            validSettings.voiceInputEnabled = settings.voiceInputEnabled;
        }
        if (typeof settings.autoReadQuestions === 'boolean') {
            validSettings.autoReadQuestions = settings.autoReadQuestions;
        }
        
        if (sessionId && voiceSessions.has(sessionId)) {
            const session = voiceSessions.get(sessionId);
            session.settings = { ...session.settings, ...validSettings };
            session.lastActivity = new Date();
        }
        
        console.log(`⚙️ Voice settings updated for session ${sessionId}:`, validSettings);
        
        res.json({
            success: true,
            settings: validSettings,
            sessionId: sessionId
        });
        
    } catch (error) {
        console.error('❌ Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update voice settings',
            error: error.message
        });
    }
});

// Get session info
router.get('/session/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!voiceSessions.has(sessionId)) {
            return res.status(404).json({
                success: false,
                message: 'Voice session not found'
            });
        }
        
        const session = voiceSessions.get(sessionId);
        session.lastActivity = new Date();
        
        res.json({
            success: true,
            session: {
                id: session.id,
                userId: session.userId,
                createdAt: session.createdAt,
                lastActivity: session.lastActivity,
                settings: session.settings
            }
        });
        
    } catch (error) {
        console.error('❌ Error getting session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get session info',
            error: error.message
        });
    }
});

// Speech-to-text endpoint (placeholder for future implementation)
router.post('/stt', (req, res) => {
    try {
        // This would handle server-side speech-to-text
        // For now, we use browser's built-in speech recognition
        res.json({
            success: true,
            mode: 'browser',
            message: 'Using browser speech recognition'
        });
        
    } catch (error) {
        console.error('❌ STT error:', error);
        res.status(500).json({
            success: false,
            message: 'Speech-to-text failed',
            error: error.message
        });
    }
});

// Voice capabilities endpoint
router.get('/capabilities', (req, res) => {
    try {
        const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
        
        res.json({
            success: true,
            capabilities: {
                tts: {
                    browser: true,
                    openai: hasOpenAI
                },
                stt: {
                    browser: 'webkitSpeechRecognition' in (global.window || {}),
                    server: false // Future implementation
                },
                voices: {
                    female: true,
                    male: true,
                    speeds: [0.5, 0.75, 1.0, 1.1, 1.25, 1.5, 2.0]
                }
            },
            recommendations: {
                preferredMode: hasOpenAI ? 'openai' : 'browser',
                fallbackAvailable: true
            }
        });
        
    } catch (error) {
        console.error('❌ Error getting capabilities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get voice capabilities',
            error: error.message
        });
    }
});

// Clean up old sessions (run periodically)
function cleanupSessions() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    let cleanedCount = 0;
    
    for (const [sessionId, session] of voiceSessions.entries()) {
        if (session.lastActivity < oneHourAgo) {
            voiceSessions.delete(sessionId);
            cleanedCount++;
        }
    }
    
    if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} old voice sessions`);
    }
}

// Run cleanup every 30 minutes
setInterval(cleanupSessions, 30 * 60 * 1000);

// Future: OpenAI TTS implementation
async function generateOpenAITTS(text, voice, speed) {
    // This is a placeholder for OpenAI TTS integration
    // When implemented, it would:
    // 1. Call OpenAI's TTS API
    // 2. Return audio buffer or URL
    // 3. Handle errors gracefully
    
    throw new Error('OpenAI TTS not implemented yet');
}

// Health check endpoint
router.get('/health', (req, res) => {
    const activeSessionsCount = voiceSessions.size;
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        statistics: {
            activeSessions: activeSessionsCount,
            openaiAvailable: hasOpenAI,
            uptime: process.uptime()
        }
    });
});

// Error handling middleware
router.use((error, req, res, next) => {
    console.error('❌ Voice API error:', error);
    
    if (res.headersSent) {
        return next(error);
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal voice service error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
    });
});

module.exports = router;