import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import IssueCard from '../components/IssueCard';
import { issueService } from '../services/issueService';

const StudentDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('-createdAt');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchIssues();
    }, [sortBy]);

    const fetchIssues = async () => {
        try {
            const data = await issueService.getMyIssues(sortBy);
            setIssues(data);

            // Calculate stats
            const stats = {
                total: data.length,
                pending: data.filter(i => i.status === 'Pending').length,
                inProgress: data.filter(i => i.status === 'In Progress').length,
                resolved: data.filter(i => i.status === 'Resolved').length,
            };
            setStats(stats);
        } catch (error) {
            console.error('Failed to fetch issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueClick = (issueId) => {
        navigate(`/issue/${issueId}`);
    };

    return (
        <div className="min-h-screen">
            <div className="page-container">
                <Navbar />

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="section-title">My Dashboard</h1>
                    <p className="dark:text-gray-300 text-gray-600">Track and manage your reported issues</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="dark:text-gray-300 text-gray-600 text-sm font-medium">Total Issues</p>
                                <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <FiAlertCircle className="text-blue-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="dark:text-gray-300 text-gray-600 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mt-2">{stats.pending}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <FiClock className="text-yellow-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="dark:text-gray-300 text-gray-600 text-sm font-medium">In Progress</p>
                                <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mt-2">{stats.inProgress}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <FiClock className="text-blue-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="dark:text-gray-300 text-gray-600 text-sm font-medium">Resolved</p>
                                <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mt-2">{stats.resolved}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <FiCheckCircle className="text-green-600 text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report New Issue Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/report-issue')}
                        className="btn-gradient"
                    >
                        <FiAlertCircle className="inline mr-2" />
                        Report New Issue
                    </button>
                </div>

                {/* Issues List */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold dark:text-gray-100 text-gray-900">My Issues</h2>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field px-4 py-2 w-auto"
                        >
                            <option value="-createdAt">Most Recent</option>
                            <option value="createdAt">Oldest First</option>
                            <option value="-upvotes">Most Upvoted</option>
                            <option value="upvotes">Least Upvoted</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                        </div>
                    ) : issues.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <FiXCircle className="text-gray-400 text-5xl mx-auto mb-4" />
                            <p className="text-gray-300 text-lg">No issues reported yet</p>
                            <p className="text-gray-500 mt-2">Click "Report New Issue" to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {issues.map((issue) => (
                                <IssueCard
                                    key={issue._id}
                                    issue={issue}
                                    onClick={() => handleIssueClick(issue._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
