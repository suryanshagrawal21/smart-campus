import React from 'react';

const StatusBadge = ({ status }) => {
    const getClassName = () => {
        switch (status) {
            case 'Pending':
                return 'status-pending';
            case 'In Progress':
                return 'status-in-progress';
            case 'Resolved':
                return 'status-resolved';
            case 'Rejected':
                return 'status-rejected';
            default:
                return 'badge bg-gray-800/50 text-gray-300 border border-gray-600';
        }
    };

    return <span className={getClassName()}>{status}</span>;
};

export default StatusBadge;
