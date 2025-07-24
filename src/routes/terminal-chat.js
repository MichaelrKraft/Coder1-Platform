const express = require('express');
const router = express.Router();
const terminalAI = require('../services/terminal-ai');

// POST /api/terminal/chat - Process natural language input
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId, context } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        console.log('📝 Terminal chat request:', { message, sessionId });

        // Process message through AI service
        const result = await terminalAI.processMessage(message, {
            sessionId,
            context: context || 'terminal'
        });

        // Return response with tool calls if any
        res.json({
            success: true,
            response: result.response,
            toolCalls: result.toolCalls || [],
            sessionId: result.sessionId
        });

    } catch (error) {
        console.error('❌ Terminal chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process message'
        });
    }
});

// POST /api/terminal/save-history - Save conversation history
router.post('/save-history', async (req, res) => {
    try {
        const { history, sessionId } = req.body;
        
        if (!history || !Array.isArray(history)) {
            return res.status(400).json({
                success: false,
                error: 'History array is required'
            });
        }

        // Format history for export
        const timestamp = new Date().toISOString();
        const formattedHistory = {
            sessionId: sessionId || 'terminal-session',
            timestamp,
            messages: history,
            exportedAt: timestamp
        };

        // In a real implementation, you might save to file or database
        // For now, return formatted data for client-side download
        res.json({
            success: true,
            data: formattedHistory,
            filename: `terminal-history-${Date.now()}.json`
        });

    } catch (error) {
        console.error('❌ Save history error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to save history'
        });
    }
});

module.exports = router;