import api from './api';

export const notificationService = {
    // Get all notifications
    getMyNotifications: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/notifications?${queryString}`);
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    // Mark notification as read
    markAsRead: async (id) => {
        const response = await api.put(`/notifications/${id}`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const response = await api.put('/notifications/mark-all-read');
        return response.data;
    },

    // Delete notification
    deleteNotification: async (id) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    },
};
