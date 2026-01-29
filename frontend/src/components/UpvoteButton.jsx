import React, { useState } from 'react';
import { FiThumbsUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/issueService';

const UpvoteButton = ({ issue, onUpvoteChange }) => {
    const { user, isStudent } = useAuth();
    const [upvoteCount, setUpvoteCount] = useState(issue.upvotes?.length || issue.upvoteCount || 0);
    const [hasUpvoted, setHasUpvoted] = useState(
        issue.upvotes?.some(id => id.toString() === user?._id?.toString()) || false
    );
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpvote = async (e) => {
        e.stopPropagation(); // Prevent card click

        if (!isStudent || isLoading) return;

        setIsLoading(true);
        setIsAnimating(true);

        // Optimistic update
        const newHasUpvoted = !hasUpvoted;
        const newCount = newHasUpvoted ? upvoteCount + 1 : upvoteCount - 1;

        setHasUpvoted(newHasUpvoted);
        setUpvoteCount(newCount);

        try {
            const response = await issueService.toggleUpvote(issue._id);

            // Update with server response
            setUpvoteCount(response.upvoteCount);
            setHasUpvoted(response.hasUpvoted);

            if (onUpvoteChange) {
                onUpvoteChange(response);
            }
        } catch (error) {
            // Revert on error
            setHasUpvoted(!newHasUpvoted);
            setUpvoteCount(upvoteCount);
            console.error('Upvote error:', error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <button
            onClick={handleUpvote}
            disabled={!isStudent || isLoading}
            className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold
                transition-all duration-300 transform
                ${hasUpvoted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'dark:bg-slate-700/50 bg-gray-100 dark:text-gray-300 text-gray-700 dark:hover:bg-slate-600/50 hover:bg-gray-200'
                }
                ${isAnimating ? 'scale-110' : 'scale-100'}
                ${!isStudent ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                disabled:cursor-not-allowed
            `}
            title={!isStudent ? 'Only students can upvote' : hasUpvoted ? 'Remove upvote' : 'Upvote this issue'}
        >
            <FiThumbsUp className={`text-lg ${isAnimating ? 'animate-bounce' : ''}`} />
            <span>{upvoteCount}</span>
            {hasUpvoted && <span className="text-xs">(Voted)</span>}
        </button>
    );
};

export default UpvoteButton;
