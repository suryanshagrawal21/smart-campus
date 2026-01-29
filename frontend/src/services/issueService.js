import api from './api';

export const issueService = {
    // Create new issue
    createIssue: async (formData) => {
        const response = await api.post('/issues', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get all issues (admin)
    getAllIssues: async (sortBy = '-createdAt') => {
        const response = await api.get(`/issues?sort=${sortBy}`);
        return response.data;
    },

    // Get user's issues
    getMyIssues: async (sortBy = '-createdAt') => {
        const response = await api.get(`/issues/my?sort=${sortBy}`);
        return response.data;
    },

    // Get issue by ID
    getIssueById: async (id) => {
        const response = await api.get(`/issues/${id}`);
        return response.data;
    },

    // Update issue status (admin/staff)
    updateIssueStatus: async (id, data) => {
        const response = await api.put(`/issues/${id}/status`, data);
        return response.data;
    },

    // Delete issue
    deleteIssue: async (id) => {
        const response = await api.delete(`/issues/${id}`);
        return response.data;
    },

    // Get analytics
    getAnalytics: async () => {
        const response = await api.get('/issues/analytics/stats');
        return response.data;
    },

    // Toggle upvote
    toggleUpvote: async (id) => {
        const response = await api.post(`/issues/${id}/upvote`);
        return response.data;
    },

    // Browse all public issues
    browseAllIssues: async (filters = {}, sortBy = '-createdAt') => {
        const params = new URLSearchParams({ ...filters, sort: sortBy });
        const response = await api.get(`/issues/browse?${params.toString()}`);
        return response.data;
    },
};
