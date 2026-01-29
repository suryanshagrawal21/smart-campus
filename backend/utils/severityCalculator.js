import Issue from '../models/Issue.js';

/**
 * Smart Severity Calculator
 * Automatically determines issue severity based on multiple factors
 */
export const calculateSeverity = async (issueData) => {
    let severityScore = 0;

    // Factor 1: Category-based severity
    const criticalCategories = ['Electricity', 'Water'];
    const highCategories = ['Internet', 'Infrastructure'];

    if (criticalCategories.includes(issueData.category)) {
        severityScore += 40;
    } else if (highCategories.includes(issueData.category)) {
        severityScore += 25;
    } else {
        severityScore += 10;
    }

    // Factor 2: Image evidence (increases credibility)
    if (issueData.imageUrl) {
        severityScore += 15;
    }

    // Factor 3: Location-based clustering (multiple issues in same location)
    if (issueData.location && issueData.location.building) {
        try {
            const recentIssues = await Issue.find({
                'location.building': issueData.location.building,
                status: { $in: ['Pending', 'In Progress'] },
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
            });

            if (recentIssues.length >= 5) {
                severityScore += 30; // Multiple issues in same location
            } else if (recentIssues.length >= 3) {
                severityScore += 20;
            } else if (recentIssues.length >= 1) {
                severityScore += 10;
            }
        } catch (error) {
            console.log('Error calculating location-based severity:', error);
        }
    }

    // Factor 4: Description length and keywords (detailed reports are more serious)
    if (issueData.description && issueData.description.length > 100) {
        severityScore += 10;
    }

    // Keywords indicating urgency
    const urgentKeywords = ['urgent', 'emergency', 'broken', 'leaked', 'danger', 'hazard', 'critical'];
    const descriptionLower = issueData.description?.toLowerCase() || '';

    for (const keyword of urgentKeywords) {
        if (descriptionLower.includes(keyword)) {
            severityScore += 15;
            break;
        }
    }

    // Convert score to severity level
    if (severityScore >= 70) {
        return 'Critical';
    } else if (severityScore >= 50) {
        return 'High';
    } else if (severityScore >= 30) {
        return 'Medium';
    } else {
        return 'Low';
    }
};

/**
 * Get severity statistics for analytics
 */
export const getSeverityStats = async () => {
    const stats = await Issue.aggregate([
        {
            $group: {
                _id: '$severity',
                count: { $sum: 1 },
            },
        },
    ]);

    return stats;
};
