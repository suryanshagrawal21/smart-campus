import Issue from '../models/Issue.js';
import cloudinary from '../config/cloudinary.js';
import { calculateSeverity } from '../utils/severityCalculator.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private (Student, Admin, Staff)
export const createIssue = async (req, res) => {
    try {
        const { title, description, category, location } = req.body;

        let imageUrl = '';
        let imagePublicId = '';

        // Upload image to Cloudinary if provided
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'campus-issues',
                resource_type: 'auto',
            });

            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        // Prepare issue data for severity calculation
        const issueData = {
            title,
            description,
            category,
            imageUrl,
            location: typeof location === 'string' ? JSON.parse(location) : location,
        };

        // Calculate severity automatically
        const severity = await calculateSeverity(issueData);

        // Create issue
        const issue = await Issue.create({
            ...issueData,
            imageUrl,
            imagePublicId,
            severity,
            reportedBy: req.user._id,
        });

        const populatedIssue = await Issue.findById(issue._id).populate(
            'reportedBy',
            'name email studentId'
        );

        res.status(201).json(populatedIssue);
    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all issues (Admin view)
// @route   GET /api/issues
// @access  Private (Admin, Staff)
export const getAllIssues = async (req, res) => {
    try {
        const { status, category, severity, building } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (severity) filter.severity = severity;
        if (building) filter['location.building'] = building;

        const issues = await Issue.find(filter)
            .populate('reportedBy', 'name email studentId')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (error) {
        console.error('Get all issues error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Browse all public issues (for community viewing)
// @route   GET /api/issues/browse
// @access  Private (All authenticated users)
export const browseAllIssues = async (req, res) => {
    try {
        const { status, category, severity, building, sort = '-createdAt', search } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (severity) filter.severity = severity;
        if (building) filter['location.building'] = building;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        let sortObj = {};
        if (sort && sort !== 'upvotes' && sort !== '-upvotes') {
            sortObj[sort.replace('-', '')] = sort.startsWith('-') ? -1 : 1;
        }

        const issues = await Issue.find(filter)
            .populate('reportedBy', 'name studentId department')
            .populate('assignedTo', 'name')
            .sort(sort === 'upvotes' || sort === '-upvotes' ? {} : sortObj);

        if (sort === '-upvotes') {
            issues.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
        } else if (sort === 'upvotes') {
            issues.sort((a, b) => (a.upvotes?.length || 0) - (b.upvotes?.length || 0));
        }

        res.json(issues);
    } catch (error) {
        console.error('Browse issues error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Get issues reported by logged-in user
// @route   GET /api/issues/my
// @access  Private
export const getMyIssues = async (req, res) => {
    try {
        const { sort = '-createdAt' } = req.query;

        let sortObj = {};
        if (sort && sort !== 'upvotes' && sort !== '-upvotes') {
            sortObj[sort.replace('-', '')] = sort.startsWith('-') ? -1 : 1;
        }

        const issues = await Issue.find({ reportedBy: req.user._id })
            .populate('reportedBy', '-password')
            .populate('assignedTo', '-password')
            .sort(sort === 'upvotes' || sort === '-upvotes' ? {} : sortObj);

        // Sort by upvotes if requested
        if (sort === '-upvotes') {
            issues.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
        } else if (sort === 'upvotes') {
            issues.sort((a, b) => (a.upvotes?.length || 0) - (b.upvotes?.length || 0));
        }

        res.json(issues);
    } catch (error) {
        console.error('Get my issues error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Private
export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('reportedBy', 'name email studentId department phoneNumber')
            .populate('assignedTo', 'name email');

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user is authorized to view this issue
        if (
            req.user.role === 'student' &&
            issue.reportedBy._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized to view this issue' });
        }

        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private (Admin, Staff)
export const updateIssueStatus = async (req, res) => {
    try {
        const { status, assignedTo, adminNotes } = req.body;

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Update fields
        if (status) issue.status = status;
        if (assignedTo) issue.assignedTo = assignedTo;
        if (adminNotes) issue.adminNotes = adminNotes;

        // Set resolved date if status is Resolved
        if (status === 'Resolved' && !issue.resolvedAt) {
            issue.resolvedAt = Date.now();
        }

        const updatedIssue = await issue.save();
        
        // Create notification for the issue reporter (only once!)
        if (status && issue.reportedBy) {
            let notificationType = 'status_update';
            let message = '';
            
            switch (status) {
                case 'Resolved':
                    notificationType = 'resolved';
                    message = `Your issue "${issue.title}" has been resolved! `;
                    break;
                case 'In Progress':
                    notificationType = 'in_progress';
                    message = `Your issue "${issue.title}" is now being worked on ??`;
                    break;
                case 'Rejected':
                    notificationType = 'rejected';
                    message = `Your issue "${issue.title}" has been reviewed ?`;
                    break;
                default:
                    message = `Your issue "${issue.title}" status updated to ${status}`;
            }
            
            await createNotification(issue.reportedBy, issue._id, notificationType, message);
        }
        
        const populatedIssue = await Issue.findById(updatedIssue._id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email');

        res.json(populatedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private (Admin only)
export const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Delete image from Cloudinary if exists
        if (issue.imagePublicId) {
            await cloudinary.uploader.destroy(issue.imagePublicId);
        }

        await issue.deleteOne();

        res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics data
// @route   GET /api/issues/analytics/stats
// @access  Private (Admin, Staff)
export const getAnalytics = async (req, res) => {
    try {
        // Total issues count
        const totalIssues = await Issue.countDocuments();

        // Status-wise count
        const statusStats = await Issue.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Category-wise count
        const categoryStats = await Issue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Severity-wise count
        const severityStats = await Issue.aggregate([
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Location-wise count (top 10 buildings)
        const locationStats = await Issue.aggregate([
            {
                $group: {
                    _id: '$location.building',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Average resolution time (in hours)
        const resolvedIssues = await Issue.find({
            status: 'Resolved',
            resolvedAt: { $exists: true },
        });

        let avgResolutionTime = 0;
        if (resolvedIssues.length > 0) {
            const totalTime = resolvedIssues.reduce((sum, issue) => {
                const timeToResolve = issue.resolvedAt - issue.createdAt;
                return sum + timeToResolve;
            }, 0);
            avgResolutionTime = totalTime / resolvedIssues.length / (1000 * 60 * 60); // Convert to hours
        }

        // Recent issues (last 7 days trend)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentIssuesCount = await Issue.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        res.json({
            totalIssues,
            statusStats,
            categoryStats,
            severityStats,
            locationStats,
            avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
            recentIssuesCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle upvote on an issue
// @route   POST /api/issues/:id/upvote
// @access  Private
export const toggleUpvote = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user already upvoted
        const hasUpvoted = issue.upvotes.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (hasUpvoted) {
            // Remove upvote
            issue.upvotes = issue.upvotes.filter(
                (userId) => userId.toString() !== req.user._id.toString()
            );
        } else {
            // Add upvote
            issue.upvotes.push(req.user._id);
        }

        await issue.save();

        res.json({
            success: true,
            upvoteCount: issue.upvotes.length,
            hasUpvoted: !hasUpvoted,
        });
    } catch (error) {
        console.error('Toggle upvote error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default {
    createIssue,
    getAllIssues,
    getMyIssues,
    getIssueById,
    updateIssueStatus,
    deleteIssue,
    getAnalytics,
    toggleUpvote,
    browseAllIssues,
};