import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import IssueCard from '../components/IssueCard';
import { issueService } from '../services/issueService';

const BrowseIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        severity: '',
        building: '',
        search: '',
    });
    const [sortBy, setSortBy] = useState('-createdAt');
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIssues();
    }, [filters, sortBy]);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            const data = await issueService.browseAllIssues(cleanFilters, sortBy);
            setIssues(data);
        } catch (error) {
            console.error('Failed to fetch issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            status: '',
            severity: '',
            building: '',
            search: '',
        });
    };

    const handleIssueClick = (issueId) => {
        navigate(`/issue/${issueId}`);
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    return (
        <div className="min-h-screen">
            <div className="page-container">
                <Navbar />

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="section-title">Browse All Issues</h1>
                    <p className="dark:text-gray-300 text-gray-600">
                        View campus-wide issues and upvote the ones that matter to you
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="glass-card p-6 mb-8 animate-slide-up">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="input-field pl-10 pr-4 w-full"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field px-4 py-2 w-full md:w-auto"
                        >
                            <option value="-createdAt">Most Recent</option>
                            <option value="createdAt">Oldest First</option>
                            <option value="-upvotes">Most Upvoted</option>
                            <option value="upvotes">Least Upvoted</option>
                            <option value="-severity">Highest Severity</option>
                        </select>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-secondary flex items-center space-x-2 ${activeFilterCount > 0 ? 'bg-blue-600 text-white' : ''
                                }`}
                        >
                            <FiFilter />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t dark:border-gray-700 border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Category */}
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="input-field px-4 py-2"
                            >
                                <option value="">All Categories</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Water">Water</option>
                                <option value="Internet">Internet</option>
                                <option value="Cleanliness">Cleanliness</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Other">Other</option>
                            </select>

                            {/* Status */}
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="input-field px-4 py-2"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                            {/* Severity */}
                            <select
                                value={filters.severity}
                                onChange={(e) => handleFilterChange('severity', e.target.value)}
                                className="input-field px-4 py-2"
                            >
                                <option value="">All Severities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>

                            {/* Building */}
                            <input
                                type="text"
                                placeholder="Building/Location"
                                value={filters.building}
                                onChange={(e) => handleFilterChange('building', e.target.value)}
                                className="input-field px-4 py-2"
                            />

                            {/* Clear Filters */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="btn-secondary flex items-center justify-center space-x-2 md:col-span-4"
                                >
                                    <FiX />
                                    <span>Clear All Filters</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="dark:text-gray-400 text-gray-600">
                        {loading ? 'Loading...' : `Showing ${issues.length} ${issues.length === 1 ? 'issue' : 'issues'}`}
                    </p>
                </div>

                {/* Issues Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                ) : issues.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FiSearch className="text-gray-400 text-5xl mx-auto mb-4" />
                        <p className="dark:text-gray-300 text-gray-700 text-lg">No issues found</p>
                        <p className="dark:text-gray-500 text-gray-500 mt-2">
                            Try adjusting your filters or search query
                        </p>
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
    );
};

export default BrowseIssues;
