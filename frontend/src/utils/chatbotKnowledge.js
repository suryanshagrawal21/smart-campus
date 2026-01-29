// FAQ Knowledge Base for Smart Campus Chatbot

export const faqKnowledgeBase = [
    // Reporting Issues
    {
        patterns: ['how', 'report', 'issue', 'submit', 'create'],
        responses: [
            "To report an issue:\n\n1. Click 'Report Issue' in the navigation\n2. Fill in the issue details (title, description, category)\n3. Select the location (building, floor, room)\n4. Optionally upload an image\n5. Click 'Submit Issue'\n\nThe system will automatically calculate the severity!",
        ],
        keywords: ['report', 'submit', 'create', 'new issue'],
    },
    {
        patterns: ['category', 'categories', 'types', 'kind'],
        responses: [
            "We have 6 issue categories:\n\n• Electricity - Power outages, faulty switches\n• Water - Leaks, supply issues\n• Internet - WiFi problems, connectivity\n• Cleanliness - Hygiene, waste management\n• Infrastructure - Building damage, repairs\n• Other - Anything else",
        ],
        keywords: ['category', 'types'],
    },

    // Upvoting
    {
        patterns: ['upvote', 'vote', 'support'],
        responses: [
            "Upvoting helps prioritize issues!\n\n• Click the thumbs-up button on any issue card\n• You can upvote your own or others' issues\n• Only students can upvote\n• One vote per issue per user\n• Click again to remove your upvote",
        ],
        keywords: ['upvote', 'vote'],
    },
    {
        patterns: ['browse', 'see', 'all', 'issues', 'other', 'students'],
        responses: [
            "To browse all campus issues:\n\n1. Click 'Browse Issues' in the navigation\n2. View issues from all students\n3. Use filters (category, status, severity, location)\n4. Search by keywords\n5. Sort by most upvoted, recent, etc.\n6. Upvote issues that affect you!",
        ],
        keywords: ['browse', 'all issues'],
    },

    // Status & Tracking
    {
        patterns: ['status', 'check', 'track', 'my', 'progress'],
        responses: [
            "Issue statuses:\n\n🟡 Pending - Waiting for admin review\n🔵 In Progress - Being worked on\n✅ Resolved - Fixed!\n❌ Rejected - Not actionable\n\nCheck your dashboard to see all your issues and their current status.",
        ],
        keywords: ['status', 'track'],
    },
    {
        patterns: ['how long', 'resolution', 'time', 'take', 'when', 'fixed'],
        responses: [
            "Resolution times vary based on:\n\n• Severity (Critical issues are prioritized)\n• Complexity of the problem\n• Available resources\n• Number of upvotes\n\nYou can check the average resolution time on the admin dashboard. Typically, critical issues are addressed within 24-48 hours.",
        ],
        keywords: ['resolution time', 'how long'],
    },

    // Severity
    {
        patterns: ['severity', 'priority', 'critical', 'urgent'],
        responses: [
            "Severity levels:\n\n🔴 Critical - Immediate danger, major impact\n🟠 High - Significant problem, urgent\n🟡 Medium - Moderate issue\n🟢 Low - Minor inconvenience\n\nThe system automatically calculates severity based on category, description, image, and location clustering!",
        ],
        keywords: ['severity', 'priority'],
    },

    // Admin Functions
    {
        patterns: ['admin', 'staff', 'manage', 'assign'],
        responses: [
            "Admin/Staff capabilities:\n\n• View all campus issues\n• Update issue status\n• Assign issues to staff\n• Add admin notes\n• View analytics dashboard\n• See most upvoted issues\n• Track resolution metrics",
        ],
        keywords: ['admin', 'staff'],
    },

    // Account & Login
    {
        patterns: ['login', 'failed', 'cant', 'cannot', 'sign in', 'error'],
        responses: [
            "Login failed? Here's how to fix it:\n\n✅ **If your email is not registered:**\n1. Click 'Register here' at the bottom\n2. Fill in all required details\n3. Then login with your new credentials\n\n✅ **Demo accounts you can use:**\n• Student: student@test.com / 123456\n• Admin: admin@campus.edu / admin123\n\n✅ **Common issues:**\n• Wrong password - try resetting\n• Email typo - check spelling\n• Account doesn't exist - register first",
        ],
        keywords: ['login failed', 'cannot login', 'cant login'],
    },
    {
        patterns: ['register', 'signup', 'sign up', 'create', 'account', 'new'],
        responses: [
            "To create a new account:\n\n1️⃣ Click 'Register here' on the login page\n\n2️⃣ Fill in your details:\n• Name\n• Email address\n• Password (choose a strong one!)\n• Student ID\n• Department\n• Phone Number\n\n3️⃣ Click 'Register'\n\n4️⃣ Login with your new email & password\n\nThat's it! You're ready to report issues! 🎉",
        ],
        keywords: ['register', 'signup', 'create account'],
    },
    {
        patterns: ['password', 'forgot', 'reset', 'change'],
        responses: [
            "Password help:\n\n🔒 **Forgot password:**\nCurrently, please contact campus IT support for password resets.\n\n🔑 **Want to change password:**\nPassword change feature coming soon!\n\n💡 **Tip:** Use the demo accounts for testing:\n• student@test.com / 123456\n• admin@campus.edu / admin123",
        ],
        keywords: ['password', 'forgot password', 'reset'],
    },
    {
        patterns: ['demo', 'test', 'trial', 'example'],
        responses: [
            "Demo accounts for testing:\n\n👨‍🎓 **Student Account:**\nEmail: student@test.com\nPassword: 123456\n\n👨‍💼 **Admin Account:**\nEmail: admin@campus.edu\nPassword: admin123\n\nUse these to explore all features without registering!",
        ],
        keywords: ['demo', 'test account'],
    },

    // General Help
    {
        patterns: ['help', 'what', 'can', 'you', 'do'],
        responses: [
            "I can help you with:\n\n• How to report issues\n• Understanding statuses and severity\n• Upvoting system\n• Browsing all campus issues\n• Admin functions\n• Account questions\n\nJust ask me anything about using Smart Campus!",
        ],
        keywords: ['help', 'what can you do'],
    },
    {
        patterns: ['delete', 'remove', 'edit', 'update', 'change'],
        responses: [
            "Issue modifications:\n\n• Students cannot edit/delete issues after submission\n• Only admins can delete issues\n• Admins/staff can update status and add notes\n\nIf you need to change an issue, report it again with the correct information.",
        ],
        keywords: ['delete', 'edit'],
    },
    {
        patterns: ['notification', 'notify', 'email', 'alert'],
        responses: [
            "Currently, updates are visible on your dashboard. To check for updates:\n\n1. Go to 'Dashboard'\n2. View your reported issues\n3. Check the status badges\n\nFuture versions may include email notifications!",
        ],
        keywords: ['notification', 'email'],
    },

    // Fallback
    {
        patterns: ['thanks', 'thank you', 'ok', 'okay'],
        responses: [
            "You're welcome! Happy to help! 😊\n\nHave more questions? Just ask!",
        ],
        keywords: ['thanks'],
    },
];

export const defaultResponse = "I'm not sure about that. Try asking:\n\n• How do I report an issue?\n• How does upvoting work?\n• What are the issue statuses?\n• How long does resolution take?\n• What can admins do?\n\nOr type 'help' for more options!";

export const greetings = [
    "Hi there! 👋 I'm your Smart Campus assistant. How can I help you today?",
    "Hello! 🤖 Ask me anything about reporting issues, tracking statuses, or using the system!",
    "Hey! 😊 I can help you with FAQs about Smart Campus. What would you like to know?",
];

export const suggestedQuestions = [
    "Login failed, what do I do?",
    "How do I register?",
    "How do I report an issue?",
    "How does upvoting work?",
    "What are demo accounts?",
    "What are the issue categories?",
];
