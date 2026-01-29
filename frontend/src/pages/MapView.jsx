import React, { useState, useEffect } from 'react';
import { FiMap, FiFilter, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import CampusMap from '../components/CampusMap';
import { issueService } from '../services/issueService';
import { STATUS_COLORS, CATEGORY_ICONS } from '../utils/mapUtils';

const MapView = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    const categories = ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Infrastructure', 'Other'];

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [issues, statusFilter, categoryFilter]);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const data = await issueService.browseAllIssues();
            setIssues(data);
        } catch (err) {
            setError('Failed to load issues');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...issues];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(issue => issue.status === statusFilter);
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(issue => issue.category === categoryFilter);
        }

        setFilteredIssues(filtered);
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setCategoryFilter('all');
    };

    const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all';

    return (
        <div className="min-h-screen">
            <div className="page-container">
                <Navbar />

                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="section-title flex items-center gap-3">
                                    <FiMap className="text-blue-600 dark:text-blue-400" />
                                    Campus Issues Map
                                </h1>
                                <p className="dark:text-gray-300 text-gray-600">
                                    Visual overview of all reported issues across campus
                                </p>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <FiFilter />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                        {(statusFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0)}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="glass-card p-6 mb-6 animate-slide-up">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                        Filter Issues
                                    </h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1"
                                        >
                                            <FiX size={16} />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="all">All Statuses</option>
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="all">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="glass-card p-4 mb-6 animate-fade-in">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
                            Map Legend
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {statuses.map(status => (
                                <div key={status} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-white shadow"
                                        style={{ backgroundColor: STATUS_COLORS[status] }}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {categories.map(category => (
                                    <div key={category} className="flex items-center gap-1.5">
                                        <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    {loading ? (
                        <div className="glass-card p-12 text-center animate-pulse">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                        </div>
                    ) : error ? (
                        <div className="glass-card p-8 text-center">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={fetchIssues}
                                className="mt-4 btn-secondary"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="animate-slide-up">
                            <CampusMap
                                issues={filteredIssues}
                                height="calc(100vh - 400px)"
                                showClustering={true}
                                autoFitBounds={hasActiveFilters}
                            />

                            {/* Stats */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="glass-card p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {filteredIssues.length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {hasActiveFilters ? 'Filtered' : 'Total'} Issues
                                    </p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                        {filteredIssues.filter(i => i.status === 'Pending').length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Pending
                                    </p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {filteredIssues.filter(i => i.status === 'In Progress').length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        In Progress
                                    </p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {filteredIssues.filter(i => i.status === 'Resolved').length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Resolved
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapView;
