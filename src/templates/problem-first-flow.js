// Problem-First Flow Implementation
// Based on Mike's 8-Step Method for better product specifications

const ProblemFirstFlow = {
  // Problem definition prompts and examples
  problemPrompts: {
    initial: {
      placeholder: "What problem are you trying to solve? Who experiences this problem?",
      examples: [
        "Teams waste time searching for their commonly used prompts across different documents and tools",
        "Developers manually recreate the same boilerplate code for every new project",
        "Small businesses struggle to track customer feedback across multiple channels",
        "Content creators lose track of their ideas and drafts scattered across different apps"
      ],
      helperText: "Focus on the problem, not the solution. Be specific about who faces this issue."
    },
    
    validation: {
      questions: [
        "How many people experience this problem?",
        "How often does this problem occur?",
        "What's the current cost/impact of this problem?",
        "How are people solving this problem today?"
      ]
    }
  },

  // Solution prompts after problem is validated
  solutionPrompts: {
    initial: {
      placeholder: "How might we solve this problem? Describe your app idea.",
      dynamicPrefix: (problem) => `Based on the problem: "${problem}"\n\nDescribe your solution:`,
      examples: [
        "A centralized prompt repository where users can store, organize, and quickly access their prompts",
        "An AI-powered code generator that learns from your coding patterns and creates custom boilerplate",
        "A unified feedback dashboard that aggregates customer comments from all channels",
        "A smart idea manager that captures, organizes, and helps develop creative concepts"
      ]
    }
  },

  // MVP definition structure
  mvpDefinition: {
    prompt: "What should the initial MVP include as a minimum?",
    categories: {
      authentication: {
        label: "User Management",
        options: [
          { id: "login", label: "User login/signup", recommended: true },
          { id: "social", label: "Social login (Google, GitHub)", recommended: false },
          { id: "sso", label: "Enterprise SSO", recommended: false }
        ]
      },
      core: {
        label: "Core Features",
        options: [] // Dynamically generated based on solution
      },
      data: {
        label: "Data Management",
        options: [
          { id: "create", label: "Create new items", recommended: true },
          { id: "read", label: "View/retrieve items", recommended: true },
          { id: "update", label: "Edit existing items", recommended: true },
          { id: "delete", label: "Delete items", recommended: true },
          { id: "search", label: "Search functionality", recommended: false },
          { id: "filter", label: "Advanced filtering", recommended: false }
        ]
      },
      collaboration: {
        label: "Collaboration",
        options: [
          { id: "share", label: "Share items", recommended: false },
          { id: "permissions", label: "Permission levels", recommended: false },
          { id: "teams", label: "Team workspaces", recommended: false }
        ]
      }
    }
  },

  // Enhanced question generation based on problem/solution
  generateSmartQuestions: function(problem, solution, mvp) {
    const questions = [
      {
        id: 'target-audience',
        question: `Who specifically will use this solution for "${problem}"?`,
        helperText: 'Be specific about user demographics, roles, and technical expertise',
        required: true
      },
      {
        id: 'success-metrics',
        question: 'How will you measure if this solution successfully solves the problem?',
        helperText: 'Define specific, measurable outcomes',
        required: true
      },
      {
        id: 'differentiation',
        question: 'What makes your solution different from existing alternatives?',
        helperText: 'Focus on unique value proposition',
        required: true
      },
      {
        id: 'technical-constraints',
        question: 'What technical constraints or requirements do you have?',
        helperText: 'Platform preferences, integrations needed, performance requirements',
        required: true
      },
      {
        id: 'timeline-budget',
        question: 'What is your timeline and budget for the MVP?',
        helperText: 'Be realistic about resources and deadlines',
        required: true
      }
    ];

    // Add contextual questions based on MVP selections
    if (mvp.includes('teams') || mvp.includes('permissions')) {
      questions.push({
        id: 'collaboration-needs',
        question: 'Describe how teams will collaborate in your solution',
        helperText: 'Workflows, approval processes, communication needs',
        required: false
      });
    }

    if (mvp.includes('social') || mvp.includes('share')) {
      questions.push({
        id: 'privacy-requirements',
        question: 'What are your privacy and security requirements?',
        helperText: 'Data protection, compliance needs, user privacy',
        required: true
      });
    }

    return questions;
  },

  // Clarification loop after initial questions
  analyzeCompleteness: async function(answers) {
    const gaps = [];
    
    // Check for vague answers
    answers.forEach((answer, index) => {
      if (answer.length < 50) {
        gaps.push({
          type: 'insufficient-detail',
          question: index,
          suggestion: 'This answer could use more detail'
        });
      }
    });

    // Check for missing critical information
    const hasBudget = answers.some(a => a.includes('$') || a.includes('budget'));
    const hasTimeline = answers.some(a => a.includes('week') || a.includes('month'));
    const hasUsers = answers.some(a => a.includes('user') || a.includes('customer'));

    if (!hasBudget) {
      gaps.push({
        type: 'missing-budget',
        question: 'What is your budget range for this project?'
      });
    }

    if (!hasTimeline) {
      gaps.push({
        type: 'missing-timeline',
        question: 'When do you need the MVP completed?'
      });
    }

    return {
      isComplete: gaps.length === 0,
      gaps: gaps,
      clarificationQuestions: gaps.map(g => g.question || `Please provide more detail for question ${g.question + 1}`)
    };
  },

  // Transform problem/solution into initial project data
  initializeProject: function(problem, solution, mvp) {
    return {
      problem: problem,
      solution: solution,
      mvp: mvp,
      elevatorPitch: `We solve the problem of "${problem}" by creating ${solution}`,
      targetAudience: 'To be defined through questions',
      uniqueSellingProposition: 'To be defined through analysis',
      timestamp: new Date().toISOString()
    };
  }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProblemFirstFlow;
}