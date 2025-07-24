/**
 * Centralized Timer Management System
 * Consolidates multiple timers into efficient batched operations
 */

class TimerManager {
    constructor() {
        this.timers = new Map();
        this.intervals = new Map();
        this.rafCallbacks = new Set();
        this.tickCallbacks = new Set();
        this.isRunning = false;
        this.frameId = null;
        this.mainIntervalId = null;
        
        // Performance monitoring
        this.stats = {
            activeTimers: 0,
            activeIntervals: 0,
            frameCallbacks: 0,
            tickCallbacks: 0,
            totalExecutions: 0,
            averageExecutionTime: 0
        };
        
        this.startMainLoop();
    }
    
    startMainLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // Main animation frame loop for smooth UI updates
        const rafLoop = () => {
            this.executeFrameCallbacks();
            if (this.isRunning && (this.rafCallbacks.size > 0 || this.tickCallbacks.size > 0)) {
                this.frameId = requestAnimationFrame(rafLoop);
            }
        };
        
        // Main interval loop for regular checks (every 100ms)
        this.mainIntervalId = setInterval(() => {
            this.executeTimers();
            this.executeIntervals();
            this.updateStats();
        }, 100);
        
        // Start RAF loop if needed
        if (this.rafCallbacks.size > 0 || this.tickCallbacks.size > 0) {
            this.frameId = requestAnimationFrame(rafLoop);
        }
    }
    
    executeFrameCallbacks() {
        const startTime = performance.now();
        
        // Execute RAF callbacks
        for (const callback of this.rafCallbacks) {
            try {
                callback();
            } catch (error) {
                if (window.ErrorHandler) {
                    window.ErrorHandler.handleError(error, {
                        type: 'ui',
                        context: 'timer_raf_callback',
                        silent: true
                    });
                }
            }
        }
        
        // Execute tick callbacks
        for (const callback of this.tickCallbacks) {
            try {
                callback();
            } catch (error) {
                if (window.ErrorHandler) {
                    window.ErrorHandler.handleError(error, {
                        type: 'ui',
                        context: 'timer_tick_callback',
                        silent: true
                    });
                }
            }
        }
        
        this.updateExecutionStats(performance.now() - startTime);
    }
    
    executeTimers() {
        const now = Date.now();
        
        for (const [id, timer] of this.timers) {
            if (now >= timer.executeAt) {
                try {
                    timer.callback();
                } catch (error) {
                    if (window.ErrorHandler) {
                        window.ErrorHandler.handleError(error, {
                            type: 'ui',
                            context: 'timer_callback',
                            metadata: { timerId: id }
                        });
                    }
                }
                this.timers.delete(id);
            }
        }
    }
    
    executeIntervals() {
        const now = Date.now();
        
        for (const [id, interval] of this.intervals) {
            if (now >= interval.nextExecution) {
                try {
                    interval.callback();
                } catch (error) {
                    if (window.ErrorHandler) {
                        window.ErrorHandler.handleError(error, {
                            type: 'ui',
                            context: 'interval_callback',
                            metadata: { intervalId: id }
                        });
                    }
                }
                interval.nextExecution = now + interval.delay;
            }
        }
    }
    
    updateExecutionStats(executionTime) {
        this.stats.totalExecutions++;
        this.stats.averageExecutionTime = 
            (this.stats.averageExecutionTime * (this.stats.totalExecutions - 1) + executionTime) / 
            this.stats.totalExecutions;
    }
    
    updateStats() {
        this.stats.activeTimers = this.timers.size;
        this.stats.activeIntervals = this.intervals.size;
        this.stats.frameCallbacks = this.rafCallbacks.size;
        this.stats.tickCallbacks = this.tickCallbacks.size;
    }
    
    // Enhanced setTimeout replacement
    setTimeout(callback, delay, ...args) {
        const id = this.generateId('timer');
        const executeAt = Date.now() + delay;
        
        this.timers.set(id, {
            callback: () => callback(...args),
            executeAt,
            delay,
            createdAt: Date.now()
        });
        
        return id;
    }
    
    // Enhanced setInterval replacement
    setInterval(callback, delay, ...args) {
        const id = this.generateId('interval');
        const now = Date.now();
        
        this.intervals.set(id, {
            callback: () => callback(...args),
            delay,
            nextExecution: now + delay,
            createdAt: now
        });
        
        return id;
    }
    
    // Clear timer
    clearTimeout(id) {
        return this.timers.delete(id);
    }
    
    // Clear interval
    clearInterval(id) {
        return this.intervals.delete(id);
    }
    
    // Add callback to animation frame loop
    addFrameCallback(callback, id = null) {
        const callbackId = id || this.generateId('raf');
        this.rafCallbacks.add(callback);
        
        // Start RAF loop if not running
        if (!this.frameId && this.isRunning) {
            this.frameId = requestAnimationFrame(() => this.executeFrameCallbacks());
        }
        
        return callbackId;
    }
    
    // Remove frame callback
    removeFrameCallback(callback) {
        return this.rafCallbacks.delete(callback);
    }
    
    // Add callback to tick loop (executes every frame)
    addTickCallback(callback, id = null) {
        const callbackId = id || this.generateId('tick');
        this.tickCallbacks.add(callback);
        
        // Start RAF loop if not running
        if (!this.frameId && this.isRunning) {
            this.frameId = requestAnimationFrame(() => this.executeFrameCallbacks());
        }
        
        return callbackId;
    }
    
    // Remove tick callback
    removeTickCallback(callback) {
        return this.tickCallbacks.delete(callback);
    }
    
    // Debounced function creator
    debounce(func, delay, immediate = false) {
        let timerId;
        return (...args) => {
            const callNow = immediate && !timerId;
            
            if (timerId) {
                this.clearTimeout(timerId);
            }
            
            timerId = this.setTimeout(() => {
                timerId = null;
                if (!immediate) func(...args);
            }, delay);
            
            if (callNow) func(...args);
        };
    }
    
    // Throttled function creator
    throttle(func, delay) {
        let lastExecution = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastExecution >= delay) {
                lastExecution = now;
                func(...args);
            }
        };
    }
    
    // Batch multiple operations to run in next frame
    batchFrameOperations(operations) {
        return new Promise(resolve => {
            this.addFrameCallback(() => {
                const results = operations.map(op => {
                    try {
                        return op();
                    } catch (error) {
                        if (window.ErrorHandler) {
                            window.ErrorHandler.handleError(error, {
                                type: 'ui',
                                context: 'batch_frame_operation'
                            });
                        }
                        return null;
                    }
                });
                resolve(results);
            });
        });
    }
    
    // Schedule operation for next idle time
    scheduleIdleCallback(callback, options = {}) {
        if (window.requestIdleCallback) {
            return window.requestIdleCallback(callback, options);
        } else {
            // Fallback for browsers without requestIdleCallback
            return this.setTimeout(callback, 0);
        }
    }
    
    // Utility methods
    generateId(prefix = 'timer') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Performance monitoring
    getStats() {
        return { ...this.stats };
    }
    
    // Get detailed timer information
    getTimerInfo() {
        const now = Date.now();
        return {
            timers: Array.from(this.timers.entries()).map(([id, timer]) => ({
                id,
                delay: timer.delay,
                remainingTime: Math.max(0, timer.executeAt - now),
                createdAt: timer.createdAt
            })),
            intervals: Array.from(this.intervals.entries()).map(([id, interval]) => ({
                id,
                delay: interval.delay,
                nextExecution: interval.nextExecution - now,
                createdAt: interval.createdAt
            })),
            frameCallbacks: this.rafCallbacks.size,
            tickCallbacks: this.tickCallbacks.size
        };
    }
    
    // Cleanup method
    cleanup() {
        this.isRunning = false;
        
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        
        if (this.mainIntervalId) {
            clearInterval(this.mainIntervalId);
            this.mainIntervalId = null;
        }
        
        this.timers.clear();
        this.intervals.clear();
        this.rafCallbacks.clear();
        this.tickCallbacks.clear();
    }
    
    // Migration helpers for existing code
    
    // Replace polling intervals with more efficient alternatives
    createPollingManager(checkFunction, onUpdate, options = {}) {
        const {
            interval = 1000,
            maxAttempts = Infinity,
            exponentialBackoff = false,
            baseDelay = 1000
        } = options;
        
        let attempts = 0;
        let currentDelay = baseDelay;
        
        const poll = () => {
            attempts++;
            
            try {
                const result = checkFunction();
                if (result) {
                    onUpdate(result);
                    return;
                }
            } catch (error) {
                if (window.ErrorHandler) {
                    window.ErrorHandler.handleError(error, {
                        type: 'api',
                        context: 'polling_check',
                        metadata: { attempts }
                    });
                }
            }
            
            if (attempts < maxAttempts) {
                if (exponentialBackoff) {
                    currentDelay = Math.min(currentDelay * 2, 30000); // Max 30 seconds
                }
                this.setTimeout(poll, exponentialBackoff ? currentDelay : interval);
            }
        };
        
        poll();
        
        return {
            stop: () => attempts = maxAttempts // Stop polling
        };
    }
    
    // Create animation loop
    createAnimationLoop(callback, options = {}) {
        const { autoStart = true, maxFPS = 60 } = options;
        const frameDelay = 1000 / maxFPS;
        let lastFrameTime = 0;
        let isActive = false;
        
        const animate = () => {
            const now = performance.now();
            
            if (now - lastFrameTime >= frameDelay) {
                try {
                    callback(now);
                } catch (error) {
                    if (window.ErrorHandler) {
                        window.ErrorHandler.handleError(error, {
                            type: 'ui',
                            context: 'animation_loop'
                        });
                    }
                }
                lastFrameTime = now;
            }
            
            if (isActive) {
                this.addFrameCallback(animate);
            }
        };
        
        return {
            start: () => {
                isActive = true;
                animate();
            },
            stop: () => {
                isActive = false;
            },
            isActive: () => isActive
        };
    }
}

// Create global instance
window.TimerManager = new TimerManager();

// Expose replacement functions globally
window.managedSetTimeout = (...args) => window.TimerManager.setTimeout(...args);
window.managedSetInterval = (...args) => window.TimerManager.setInterval(...args);
window.managedClearTimeout = (...args) => window.TimerManager.clearTimeout(...args);
window.managedClearInterval = (...args) => window.TimerManager.clearInterval(...args);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerManager;
}