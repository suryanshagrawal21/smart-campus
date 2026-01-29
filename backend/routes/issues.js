import express from 'express';
import {
    createIssue,
    getAllIssues,
    getMyIssues,
    getIssueById,
    updateIssueStatus,
    deleteIssue,
    getAnalytics,
    toggleUpvote,
    browseAllIssues,
} from '../controllers/issueController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import upload from '../middleware/upload.js';
import { validate, issueValidation } from '../utils/validators.js';

const router = express.Router();

// Analytics route (admin/staff only)
router.get('/analytics/stats', protect, authorize('admin', 'staff'), getAnalytics);

// Browse all issues (public for all authenticated users)
router.get('/browse', protect, browseAllIssues);

// Get user's own issues
router.get('/my', protect, getMyIssues);

// Create new issue (with image upload)
router.post(
    '/',
    protect,
    upload.single('image'),
    validate(issueValidation),
    createIssue
);

// Get all issues (admin/staff only)
router.get('/', protect, authorize('admin', 'staff'), getAllIssues);

// Get, update, delete specific issue
router
    .route('/:id')
    .get(protect, getIssueById)
    .delete(protect, authorize('admin'), deleteIssue);

// Update issue status (admin/staff only)
router.put('/:id/status', protect, authorize('admin', 'staff'), updateIssueStatus);

// Toggle upvote
router.post('/:id/upvote', protect, toggleUpvote);

export default router;
