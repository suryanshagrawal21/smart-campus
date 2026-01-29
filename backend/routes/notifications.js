import express from 'express';
import {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get unread count (must be before /:id routes)
router.get('/unread-count', protect, getUnreadCount);

// Mark all as read
router.put('/mark-all-read', protect, markAllAsRead);

// Get all notifications
router.get('/', protect, getMyNotifications);

// Mark as read and delete specific notification
router
    .route('/:id')
    .put(protect, markAsRead)
    .delete(protect, deleteNotification);

export default router;
