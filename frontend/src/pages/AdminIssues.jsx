import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import IssueCard from '../components/IssueCard';
import { issueService } from '../services/issueService';
import { FiFilter, FiSearch } from 'react-icons/fi';

const AdminIssues = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        severity: '',
        search: '',
    });
    const navigate = useNavigate();

    const categories = ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Infrastructure', 'Other'];
    const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issues, filters]);

    const fetchIssues = async () => {
        try {
            const data = await issueService.getAllIssues();
            setIssues(data);
            setFilteredIssues(data);
        } catch (error) {
            console.error('Failed to fetch issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...issues];

        if (filters.status) {
            filtered = filtered.filter((issue) => issue.status === filters.status);
        }
        if (filters.category) {
            filtered = filtered.filter((issue) => issue.category === filters.category);
        }
        if (filters.severity) {
            filtered = filtered.filter((issue) => issue.severity === filters.severity);
        }
        if (filters.search) {
            filtered = filtered.filter(
                (issue) =>
                    issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                    issue.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredIssues(filtered);
    };

    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            category: '',
            severity: '',
            search: '',
        });
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
                    <h1 className="section-title">Manage Issues</h1>
                    <p className="dark:text-gray-300 text-gray-600">View, filter, and manage all reported issues</p>
                </div>

                {/* Filters */}
                <div className="glass-card p-6 mb-8 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 flex items-center">
                            <FiFilter className="mr-2" />
                            Filters
                        </h3>
                        <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-medium">
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="dark:text-gray-400 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search issues..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="input-field pl-10 pr-4"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="input-field px-4"
                            >
                                <option value="">All Statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="input-field px-4"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700 border-gray-200">
                        <p className="dark:text-gray-300 text-gray-600">
                            Showing <span className="font-bold text-blue-600">{filteredIssues.length}</span> of{' '}
                            <span className="font-bold">{issues.length}</span> issues
                        </p>
                    </div>
                </div>

                {/* Issues Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                ) : filteredIssues.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-gray-300 text-lg">No issues found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIssues.map((issue) => (
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

export default AdminIssues;
