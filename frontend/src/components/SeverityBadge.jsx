import React from 'react';

const SeverityBadge = ({ severity }) => {
    const getClassName = () => {
        switch (severity) {
            case 'Low':
                return 'severity-low';
            case 'Medium':
                return 'severity-medium';
            case 'High':
                return 'severity-high';
            case 'Critical':
                return 'severity-critical';
            default:
                return 'badge bg-gray-800/50 text-gray-300 border border-gray-600';
        }
    };

    return <span className={getClassName()}>{severity}</span>;
};

export default SeverityBadge;
