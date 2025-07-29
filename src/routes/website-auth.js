const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * Website Customization Studio Authentication & Usage Tracking
 * Simple authentication system with usage limits for the free trial
 */

// Mock user database (in production, this would be a real database)
const mockUsers = new Map();
const sessions = new Map();

// Demo user for testing
const DEMO_USER = {
    id: 'demo_user_001',
    email: 'demo@example.com',
    name: 'Demo User',
    subscription_status: 'free',
    usage_count: 3,
    max_usage: 3,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString()
};

// Initialize demo user
mockUsers.set(DEMO_USER.email, DEMO_USER);

// POST /api/website/auth/login - Simple login/register
router.post('/auth/login', async (req, res) => {
    try {
        const { email, create_account = true } = req.body;
        
        // Input validation
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }
        
        console.log('🔐 Login attempt for:', email);
        
        let user = mockUsers.get(email);
        
        // Create new user if doesn't exist and create_account is true
        if (!user && create_account) {
            user = createNewUser(email);
            mockUsers.set(email, user);
            console.log('✨ Created new user:', email);
        } else if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found. Would you like to create an account?'
            });
        }
        
        // Update last login
        user.last_login = new Date().toISOString();
        
        // Generate JWT token (in demo mode, use simple token)
        const token = generateAuthToken(user);
        
        // Store session
        sessions.set(token, {
            user_id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    subscription_status: user.subscription_status,
                    usage_count: user.usage_count,
                    max_usage: user.max_usage,
                    can_customize: user.usage_count > 0
                },
                token: token,
                expires_in: '7 days'
            }
        });
        
    } catch (error) {
        console.error('🚨 Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
});

// GET /api/website/auth/me - Get current user info
router.get('/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = mockUsers.get(req.user.email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    subscription_status: user.subscription_status,
                    usage_count: user.usage_count,
                    max_usage: user.max_usage,
                    can_customize: user.usage_count > 0,
                    created_at: user.created_at,
                    last_login: user.last_login
                }
            }
        });
        
    } catch (error) {
        console.error('🚨 Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get user information'
        });
    }
});

// POST /api/website/auth/logout - Logout user
router.post('/auth/logout', authenticateToken, (req, res) => {
    try {
        const token = extractTokenFromRequest(req);
        
        // Remove session
        if (token) {
            sessions.delete(token);
        }
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
        
    } catch (error) {
        console.error('🚨 Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'Logout failed'
        });
    }
});

// POST /api/website/auth/use-credit - Track usage (called when user generates CSS)
router.post('/auth/use-credit', authenticateToken, async (req, res) => {
    try {
        const user = mockUsers.get(req.user.email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Check if user has remaining usage
        if (user.usage_count <= 0) {
            return res.status(403).json({
                success: false,
                error: 'No remaining customizations. Please upgrade your plan.',
                upgrade_url: '/website-studio-landing.html#pricing'
            });
        }
        
        // Decrease usage count
        user.usage_count -= 1;
        
        console.log(`💳 Used 1 credit for ${user.email}. Remaining: ${user.usage_count}`);
        
        res.json({
            success: true,
            data: {
                usage_count: user.usage_count,
                max_usage: user.max_usage,
                credits_remaining: user.usage_count,
                can_customize: user.usage_count > 0,
                message: user.usage_count === 0 ? 
                    'This was your last free customization. Upgrade to continue!' : 
                    `${user.usage_count} free customizations remaining`
            }
        });
        
    } catch (error) {
        console.error('🚨 Use credit error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track usage'
        });
    }
});

// POST /api/website/auth/upgrade - Simulate subscription upgrade
router.post('/auth/upgrade', authenticateToken, async (req, res) => {
    try {
        const { plan = 'basic' } = req.body;
        const user = mockUsers.get(req.user.email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Simulate subscription upgrade
        const planLimits = {
            'basic': { max_usage: 20, monthly_limit: 20 },
            'pro': { max_usage: -1, monthly_limit: -1 } // -1 means unlimited
        };
        
        const selectedPlan = planLimits[plan];
        if (!selectedPlan) {
            return res.status(400).json({
                success: false,
                error: 'Invalid plan selected'
            });
        }
        
        // Update user subscription
        user.subscription_status = plan;
        user.max_usage = selectedPlan.max_usage;
        user.usage_count = selectedPlan.max_usage === -1 ? 999 : selectedPlan.max_usage;
        user.upgraded_at = new Date().toISOString();
        
        console.log(`🚀 User ${user.email} upgraded to ${plan} plan`);
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    subscription_status: user.subscription_status,
                    usage_count: user.usage_count,
                    max_usage: user.max_usage,
                    can_customize: true
                },
                message: `Successfully upgraded to ${plan} plan!`,
                demo_mode: true,
                note: 'This is a demo upgrade. In production, this would integrate with Stripe.'
            }
        });
        
    } catch (error) {
        console.error('🚨 Upgrade error:', error);
        res.status(500).json({
            success: false,
            error: 'Upgrade failed. Please try again.'
        });
    }
});

// GET /api/website/auth/usage - Get usage statistics
router.get('/auth/usage', authenticateToken, async (req, res) => {
    try {
        const user = mockUsers.get(req.user.email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Calculate usage statistics
        const usageStats = {
            current_usage: user.max_usage === -1 ? 0 : user.max_usage - user.usage_count,
            remaining_usage: user.usage_count,
            max_usage: user.max_usage,
            usage_percentage: user.max_usage === -1 ? 0 : 
                Math.round(((user.max_usage - user.usage_count) / user.max_usage) * 100),
            subscription_status: user.subscription_status,
            can_customize: user.usage_count > 0,
            reset_date: getNextResetDate(),
            is_unlimited: user.max_usage === -1
        };
        
        res.json({
            success: true,
            data: usageStats
        });
        
    } catch (error) {
        console.error('🚨 Usage stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get usage statistics'
        });
    }
});

// GET /api/website/auth/demo - Get demo account for testing
router.get('/auth/demo', async (req, res) => {
    try {
        // Reset demo user usage for testing
        DEMO_USER.usage_count = 3;
        DEMO_USER.last_login = new Date().toISOString();
        
        const token = generateAuthToken(DEMO_USER);
        sessions.set(token, {
            user_id: DEMO_USER.id,
            email: DEMO_USER.email,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        res.json({
            success: true,
            data: {
                user: {
                    id: DEMO_USER.id,
                    email: DEMO_USER.email,
                    name: DEMO_USER.name,
                    subscription_status: DEMO_USER.subscription_status,
                    usage_count: DEMO_USER.usage_count,
                    max_usage: DEMO_USER.max_usage,
                    can_customize: true
                },
                token: token,
                message: 'Demo account ready for testing',
                demo_mode: true
            }
        });
        
    } catch (error) {
        console.error('🚨 Demo account error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create demo account'
        });
    }
});

/**
 * Helper Functions
 */

function createNewUser(email) {
    return {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        subscription_status: 'free',
        usage_count: 3, // 3 free customizations
        max_usage: 3,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
    };
}

function generateAuthToken(user) {
    const demoMode = process.env.NODE_ENV === 'development';
    
    if (demoMode) {
        // Simple token for demo mode
        return `demo_token_${user.id}_${Date.now()}`;
    }
    
    // Real JWT token (requires JWT_SECRET in production)
    const secret = process.env.JWT_SECRET || 'demo_secret_key';
    return jwt.sign(
        { 
            userId: user.id, 
            email: user.email,
            subscription: user.subscription_status
        },
        secret,
        { expiresIn: '7d' }
    );
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getNextResetDate() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1); // First day of next month
    return nextMonth.toISOString();
}

function extractTokenFromRequest(req) {
    const authHeader = req.headers['authorization'];
    return authHeader && authHeader.split(' ')[1];
}

/**
 * Authentication Middleware
 */
function authenticateToken(req, res, next) {
    const token = extractTokenFromRequest(req);
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }
    
    // Check if session exists
    const session = sessions.get(token);
    if (!session) {
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
    
    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
        sessions.delete(token);
        return res.status(403).json({
            success: false,
            error: 'Token expired. Please login again.'
        });
    }
    
    // Add user info to request
    req.user = {
        id: session.user_id,
        email: session.email
    };
    
    next();
}

/**
 * Optional: Usage limit middleware
 */
function requireUsageCredit(req, res, next) {
    authenticateToken(req, res, (err) => {
        if (err) return;
        
        const user = mockUsers.get(req.user.email);
        if (!user || user.usage_count <= 0) {
            return res.status(403).json({
                success: false,
                error: 'No remaining customizations. Please upgrade your plan.',
                upgrade_required: true,
                upgrade_url: '/website-studio-landing.html#pricing'
            });
        }
        
        next();
    });
}

// Export middleware functions for use in other routes
module.exports = router;
module.exports.authenticateToken = authenticateToken;
module.exports.requireUsageCredit = requireUsageCredit;