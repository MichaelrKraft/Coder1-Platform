#!/usr/bin/env node

/**
 * Test script for Enhanced PRD Generator
 */

const EnhancedPRDGenerator = require('./src/templates/enhanced-prd-generator');

// Test data simulating a problem-first flow
const testProjectData = {
    id: 'test-123',
    problem: 'Teams waste time searching for their commonly used prompts across different documents and chat histories',
    solution: 'A centralized prompt repository where users can store, organize, and quickly access their prompts with features like tagging, search, and sharing',
    originalRequest: 'I want to build a prompt repository app',
    questions: [
        { question: 'Who specifically will use this solution?', category: 'target-audience' },
        { question: 'How will you measure success?', category: 'success-metrics' },
        { question: 'What makes your solution different?', category: 'differentiation' },
        { question: 'What technical requirements do you have?', category: 'technical' },
        { question: 'What is your timeline and budget?', category: 'timeline-budget' }
    ],
    answers: [
        { answer: 'Primary users are content creators, developers, and AI power users who work with multiple AI tools. They typically have 50-500 prompts they reuse regularly.' },
        { answer: 'Success metrics: 80% reduction in time to find prompts, 90% user retention after 30 days, average of 100+ prompts stored per user' },
        { answer: 'Unlike storing in docs or notes apps, we offer AI-powered organization, version control for prompts, and one-click copying with formatting preserved' },
        { answer: 'Web-based responsive app, must support Markdown and XML formatting, integrate with clipboard API, need sub-second search performance' },
        { answer: 'MVP in 6-8 weeks, budget of $15-20k for initial development, targeting launch by Q2 2024' }
    ],
    mvpFeatures: ['auth', 'create', 'read', 'update', 'delete', 'search', 'folders', 'tags'],
    analysis: {
        projectType: 'SaaS Web Application',
        complexity: 'Medium',
        targetAudience: 'Technical and creative professionals',
        keyFeatures: [
            'User authentication and profiles',
            'Prompt CRUD operations',
            'Folder/category organization',
            'Tagging system',
            'Search functionality',
            'Markdown/XML support'
        ]
    }
};

console.log('🧪 Testing Enhanced PRD Generator...\n');

try {
    const prdContent = EnhancedPRDGenerator.generatePRD(testProjectData);
    
    console.log('✅ PRD Generated Successfully!\n');
    console.log('='.repeat(80));
    console.log(prdContent);
    console.log('='.repeat(80));
    
    // Verify all sections are present
    const requiredSections = [
        'Elevator Pitch',
        'Problem Statement',
        'Target Audience',
        'USP',
        'Target Platforms',
        'Features List',
        'UX/UI Considerations',
        'Non-Functional Requirements',
        'Monetization',
        'Critical Questions',
        'Next Steps'
    ];
    
    console.log('\n📋 Section Verification:');
    requiredSections.forEach(section => {
        const present = prdContent.includes(`## ${section}`);
        console.log(`${present ? '✅' : '❌'} ${section}`);
    });
    
    // Count words
    const wordCount = prdContent.split(/\s+/).length;
    console.log(`\n📊 PRD Statistics:`);
    console.log(`- Total words: ${wordCount}`);
    console.log(`- Total characters: ${prdContent.length}`);
    console.log(`- Sections: ${requiredSections.length}`);
    
} catch (error) {
    console.error('❌ Error generating PRD:', error);
    process.exit(1);
}

console.log('\n✨ Test completed successfully!');