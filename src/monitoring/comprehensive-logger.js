/**
 * Simple logger for Claude Code API
 */

const logger = {
    info: (message, data) => {
        console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
    },
    
    error: (message, data) => {
        console.error(`[ERROR] ${message}`, data ? JSON.stringify(data) : '');
    },
    
    warn: (message, data) => {
        console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
    },
    
    debug: (message, data) => {
        if (process.env.LOG_LEVEL === 'debug') {
            console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
};

module.exports = { logger };