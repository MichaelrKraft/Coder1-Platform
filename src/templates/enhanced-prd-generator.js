/**
 * Enhanced PRD Generator based on Mike's 8-Step Method
 * Generates comprehensive product specifications with all required sections
 */

const EnhancedPRDGenerator = {
    /**
     * Generate a complete PRD following Mike's format
     */
    generatePRD: function(projectData) {
        const {
            problem,
            solution,
            originalRequest,
            questions,
            answers,
            mvpFeatures,
            consultation,
            analysis
        } = projectData;

        let content = '# Product Requirements Document\n\n';
        content += `**Generated:** ${new Date().toISOString()}\n`;
        content += `**Project ID:** ${projectData.id || 'N/A'}\n\n`;

        // 1. Elevator Pitch
        content += '## Elevator Pitch\n';
        content += this.generateElevatorPitch(problem, solution, analysis) + '\n\n';

        // 2. Problem Statement
        content += '## Problem Statement\n';
        content += this.formatProblemStatement(problem || originalRequest) + '\n\n';

        // 3. Target Audience
        content += '## Target Audience\n';
        content += this.extractTargetAudience(answers, analysis) + '\n\n';

        // 4. USP (Unique Selling Proposition)
        content += '## USP (Unique Selling Proposition)\n';
        content += this.generateUSP(solution, answers, analysis) + '\n\n';

        // 5. Target Platforms
        content += '## Target Platforms\n';
        content += this.formatPlatforms(answers, analysis) + '\n\n';

        // 6. Features List (User Stories format)
        content += '## Features List\n\n';
        content += this.generateFeaturesList(mvpFeatures, answers, analysis);

        // 7. UX/UI Considerations
        content += '\n## UX/UI Considerations\n\n';
        content += this.generateUXUISection(projectData);

        // 8. Non-Functional Requirements
        content += '\n## Non-Functional Requirements\n\n';
        content += this.generateNonFunctionalRequirements(projectData);

        // 9. Monetization
        content += '\n## Monetization\n';
        content += this.generateMonetizationStrategy(projectData) + '\n\n';

        // 10. Critical Questions or Clarifications
        content += '## Critical Questions or Clarifications\n';
        content += this.generateCriticalQuestions(projectData) + '\n\n';

        // 11. Next Steps (from original implementation)
        content += '## Next Steps\n';
        content += this.generateNextSteps(projectData);

        return content;
    },

    generateElevatorPitch: function(problem, solution, analysis) {
        if (problem && solution) {
            return `We solve the problem of "${problem}" by creating ${solution}. ` +
                   `This solution enables users to ${analysis?.keyBenefit || 'achieve their goals more efficiently'}, ` +
                   `resulting in ${analysis?.outcome || 'significant time and cost savings'}.`;
        }
        return 'A comprehensive solution that addresses key user needs through innovative technology.';
    },

    formatProblemStatement: function(problem) {
        if (!problem) return 'To be defined.';
        
        // Add structure to the problem statement
        let formatted = problem;
        
        // Add impact analysis if not present
        if (!problem.includes('impact') && !problem.includes('cost')) {
            formatted += '\n\n**Impact:** This problem results in lost productivity and increased operational costs.';
        }
        
        // Add frequency if not mentioned
        if (!problem.includes('daily') && !problem.includes('weekly') && !problem.includes('often')) {
            formatted += '\n\n**Frequency:** This issue occurs regularly in day-to-day operations.';
        }
        
        return formatted;
    },

    extractTargetAudience: function(answers, analysis) {
        // Find target audience from answers
        const audienceAnswer = answers?.find(a => 
            a.answer?.toLowerCase().includes('user') || 
            a.answer?.toLowerCase().includes('audience') ||
            a.answer?.toLowerCase().includes('who')
        );
        
        if (audienceAnswer) {
            return audienceAnswer.answer;
        }
        
        if (analysis?.targetAudience) {
            return analysis.targetAudience;
        }
        
        return `**Primary Users:** To be defined through user research
**Secondary Users:** Stakeholders and administrators
**Technical Level:** Varies from non-technical to expert users`;
    },

    generateUSP: function(solution, answers, analysis) {
        const differentiators = [];
        
        // Extract from answers
        const diffAnswer = answers?.find(a => 
            a.answer?.toLowerCase().includes('different') || 
            a.answer?.toLowerCase().includes('unique') ||
            a.answer?.toLowerCase().includes('unlike')
        );
        
        if (diffAnswer) {
            differentiators.push(diffAnswer.answer);
        }
        
        // Add AI-driven differentiators
        if (solution?.includes('AI') || solution?.includes('intelligent')) {
            differentiators.push('AI-powered automation and intelligent recommendations');
        }
        
        // Add from analysis
        if (analysis?.differentiators) {
            differentiators.push(...analysis.differentiators);
        }
        
        if (differentiators.length > 0) {
            return '**Key Differentiators:**\n' + differentiators.map(d => `- ${d}`).join('\n');
        }
        
        return `**Key Differentiators:**
- Intuitive user experience designed for efficiency
- Comprehensive feature set in a single platform
- Built with scalability and performance in mind
- Strong focus on security and data privacy`;
    },

    formatPlatforms: function(answers, analysis) {
        const platformAnswer = answers?.find(a => 
            a.answer?.toLowerCase().includes('platform') || 
            a.answer?.toLowerCase().includes('web') ||
            a.answer?.toLowerCase().includes('mobile')
        );
        
        if (platformAnswer) {
            return this.structurePlatformInfo(platformAnswer.answer);
        }
        
        return `**Primary Platform:** Web (Responsive)
**Secondary Platforms:** 
- Mobile Web (iOS Safari, Chrome)
- Desktop Applications (future phase)
**Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)`;
    },

    structurePlatformInfo: function(platformText) {
        let structured = '**Supported Platforms:**\n';
        
        if (platformText.includes('web')) {
            structured += '- Web Application (responsive design)\n';
        }
        if (platformText.includes('mobile')) {
            structured += '- Mobile (iOS and Android)\n';
        }
        if (platformText.includes('desktop')) {
            structured += '- Desktop (Windows, macOS, Linux)\n';
        }
        
        structured += '\n**Technical Requirements:**\n';
        structured += '- Modern browser with JavaScript enabled\n';
        structured += '- Minimum screen resolution: 320px (mobile optimized)\n';
        
        return structured;
    },

    generateFeaturesList: function(mvpFeatures, answers, analysis) {
        let content = '### MVP Features\n\n';
        
        // Core feature categories
        const categories = {
            'User Management': [],
            'Core Functionality': [],
            'Data Management': [],
            'Collaboration': [],
            'Analytics & Reporting': []
        };
        
        // Extract features from answers
        const featureAnswer = answers?.find(a => 
            a.answer?.toLowerCase().includes('feature') || 
            a.answer?.toLowerCase().includes('must have')
        );
        
        // Add user management features
        if (!mvpFeatures || mvpFeatures === 'default' || mvpFeatures.includes('auth')) {
            categories['User Management'].push({
                story: 'As a user, I want to create an account so that I can save my work',
                acceptance: [
                    'User can sign up with email/password',
                    'Email verification is required',
                    'Password strength requirements are enforced',
                    'User receives welcome email after signup'
                ]
            });
        }
        
        // Add core features based on solution context
        if (analysis?.coreFeatures) {
            analysis.coreFeatures.forEach(feature => {
                categories['Core Functionality'].push({
                    story: `As a user, I want to ${feature.action} so that ${feature.benefit}`,
                    acceptance: feature.criteria || ['Feature works as described']
                });
            });
        }
        
        // Generate feature content
        Object.entries(categories).forEach(([category, features]) => {
            if (features.length > 0) {
                content += `#### ${category}\n\n`;
                features.forEach((feature, index) => {
                    content += `- [ ] **${feature.story}**\n`;
                    content += `  - Acceptance Criteria:\n`;
                    feature.acceptance.forEach(criterion => {
                        content += `    - [ ] ${criterion}\n`;
                    });
                    content += '\n';
                });
            }
        });
        
        // Future enhancements
        content += '### Future Enhancements\n\n';
        content += `- [ ] Advanced analytics dashboard
- [ ] API access for integrations
- [ ] Mobile native applications
- [ ] AI-powered recommendations
- [ ] Advanced collaboration features\n`;
        
        return content;
    },

    generateUXUISection: function(projectData) {
        let content = '### Key Screens/Pages\n\n';
        
        const screens = [
            {
                name: 'Dashboard',
                states: ['Empty (first-time user)', 'Loading', 'Populated with data', 'Error state'],
                interactions: 'Real-time updates, drag-and-drop widgets'
            },
            {
                name: 'User Authentication',
                states: ['Login form', 'Signup form', 'Password reset', '2FA verification'],
                interactions: 'Form validation, loading states, error messages'
            },
            {
                name: 'Main Content Area',
                states: ['List view', 'Grid view', 'Detail view', 'Edit mode'],
                interactions: 'CRUD operations, inline editing, bulk actions'
            }
        ];
        
        screens.forEach(screen => {
            content += `- [ ] **${screen.name}**\n`;
            content += `  - States: ${screen.states.join(', ')}\n`;
            content += `  - Key Interactions: ${screen.interactions}\n`;
            content += `  - Responsive Breakpoints: Mobile (320px), Tablet (768px), Desktop (1024px+)\n\n`;
        });
        
        content += '### State Management\n\n';
        content += `- [ ] Loading States
  - Skeleton screens for initial load
  - Progress indicators for long operations
  - Optimistic UI updates for better perceived performance

- [ ] Empty States
  - Helpful illustrations and messages
  - Clear CTAs to guide users
  - Educational content for new users

- [ ] Error Handling
  - User-friendly error messages
  - Recovery options
  - Fallback UI for critical errors
  - Error boundary implementation

- [ ] Success Feedback
  - Toast notifications for actions
  - Success animations
  - Confirmation dialogs for destructive actions\n\n`;
        
        content += '### Visual Design Principles\n\n';
        content += `- [ ] Design System
  - Consistent color palette (primary, secondary, semantic colors)
  - Typography scale (headings, body, captions)
  - Spacing system (8px grid)
  - Component library with variants

- [ ] Accessibility
  - WCAG 2.1 AA compliance
  - Keyboard navigation support
  - Screen reader optimization
  - High contrast mode support
  - Focus indicators

- [ ] Animations & Transitions
  - Subtle micro-interactions
  - Page transitions (300ms standard)
  - Loading animations
  - Hover states and feedback`;
        
        return content;
    },

    generateNonFunctionalRequirements: function(projectData) {
        let content = '### Performance\n';
        content += `- [ ] Initial page load < 3 seconds (LCP)
- [ ] Time to Interactive < 5 seconds (TTI)
- [ ] API response time < 200ms for reads, < 500ms for writes
- [ ] 60 FPS for animations and scrolling
- [ ] Lighthouse performance score > 90\n\n`;
        
        content += '### Scalability\n';
        content += `- [ ] Support 1,000 concurrent users (MVP)
- [ ] Support 10,000 concurrent users (Growth phase)
- [ ] Horizontal scaling capability
- [ ] Database query optimization (< 100ms)
- [ ] CDN implementation for static assets
- [ ] Caching strategy (Redis/Memcached)\n\n`;
        
        content += '### Security\n';
        content += `- [ ] HTTPS encryption (TLS 1.3)
- [ ] Authentication (JWT with refresh tokens)
- [ ] Authorization (Role-based access control)
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Regular security audits
- [ ] OWASP Top 10 compliance\n\n`;
        
        content += '### Accessibility\n';
        content += `- [ ] WCAG 2.1 AA compliance
- [ ] Semantic HTML structure
- [ ] ARIA labels and landmarks
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus management
- [ ] Color contrast ratios (4.5:1 minimum)
- [ ] Alternative text for images
- [ ] Captions for videos
- [ ] Responsive text sizing
- [ ] Testing with screen readers`;
        
        return content;
    },

    generateMonetizationStrategy: function(projectData) {
        const { answers } = projectData;
        
        // Check if monetization was mentioned in answers
        const hasMonetization = answers?.some(a => 
            a.answer?.toLowerCase().includes('revenue') ||
            a.answer?.toLowerCase().includes('monetiz') ||
            a.answer?.toLowerCase().includes('pricing')
        );
        
        if (hasMonetization) {
            // Extract from answers
            const monAnswer = answers.find(a => 
                a.answer?.toLowerCase().includes('revenue') ||
                a.answer?.toLowerCase().includes('monetiz')
            );
            return monAnswer.answer;
        }
        
        // Default monetization strategies
        return `**Revenue Model Options:**

1. **Freemium Model**
   - Free tier: Basic features, limited usage
   - Pro tier ($19/month): Advanced features, higher limits
   - Team tier ($49/month): Collaboration features, admin controls
   - Enterprise tier: Custom pricing, dedicated support

2. **Usage-Based Pricing**
   - Pay per transaction/API call
   - Tiered usage brackets
   - Overage charges for exceeding limits

3. **Subscription Model**
   - Monthly/Annual billing
   - Feature-based tiers
   - User-based pricing

4. **Additional Revenue Streams**
   - Premium support packages
   - Professional services
   - API access fees
   - White-label solutions`;
    },

    generateCriticalQuestions: function(projectData) {
        const questions = [
            '- What is the primary success metric for this product? (e.g., user retention, revenue, efficiency gains)',
            '- Who are the main competitors and how do we differentiate?',
            '- What are the key technical risks and mitigation strategies?',
            '- What is the go-to-market strategy and timeline?',
            '- How will we measure user engagement and satisfaction?',
            '- What are the data privacy and compliance requirements?',
            '- What is the expected ROI and break-even timeline?',
            '- How will the product scale with user growth?',
            '- What are the key dependencies and potential blockers?',
            '- What is the plan for ongoing maintenance and support?'
        ];
        
        return questions.join('\n');
    },

    generateNextSteps: function(projectData) {
        return `1. **Requirements Review** (Week 1)
   - Stakeholder review and approval
   - Technical feasibility assessment
   - Resource allocation

2. **Design Phase** (Weeks 2-3)
   - UI/UX mockups and prototypes
   - Technical architecture design
   - Database schema design
   - API specification

3. **Development Setup** (Week 4)
   - Development environment setup
   - CI/CD pipeline configuration
   - Project scaffolding
   - Team onboarding

4. **MVP Development** (Weeks 5-12)
   - Sprint planning and execution
   - Weekly progress reviews
   - Continuous testing and integration
   - Regular stakeholder demos

5. **Launch Preparation** (Weeks 13-14)
   - User acceptance testing
   - Performance optimization
   - Security audit
   - Documentation completion
   - Deployment planning

6. **Post-Launch** (Ongoing)
   - User feedback collection
   - Performance monitoring
   - Iterative improvements
   - Feature roadmap execution`;
    }
};

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedPRDGenerator;
}

// Also make available globally for browser environment
if (typeof window !== 'undefined') {
    window.EnhancedPRDGenerator = EnhancedPRDGenerator;
}