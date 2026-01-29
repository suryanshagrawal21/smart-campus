import React from 'react';
import { FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';
import UpvoteButton from './UpvoteButton';

const IssueCard = ({ issue, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="issue-card glass-card p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-2">{issue.title}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                        <SeverityBadge severity={issue.severity} />
                        <StatusBadge status={issue.status} />
                        <span className="badge dark:bg-purple-900/50 dark:text-purple-300 dark:border dark:border-purple-700 bg-purple-100 text-purple-800">{issue.category}</span>
                    </div>
                </div>
                {issue.imageUrl && (
                    <img
                        src={issue.imageUrl}
                        alt="Issue"
                        className="w-20 h-20 object-cover rounded-lg ml-4"
                    />
                )}
            </div>

            {/* Description */}
            <p className="dark:text-gray-300 text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm dark:text-gray-500 text-gray-400">
                    <div className="flex items-center space-x-1">
                        <FiMapPin className="text-blue-600" />
                        <span>{issue.location?.building}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <FiCalendar className="text-blue-600" />
                        <span>{format(new Date(issue.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    {issue.reportedBy?.name && (
                        <div className="flex items-center space-x-1">
                            <FiUser className="text-blue-600" />
                            <span>{issue.reportedBy.name}</span>
                        </div>
                    )}
                </div>

                {/* Upvote Button */}
                <div onClick={(e) => e.stopPropagation()}>
                    <UpvoteButton issue={issue} />
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
