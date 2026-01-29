import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { issueService } from '../services/issueService';
import ParticleBackground from '../components/ParticleBackground';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FiAlertCircle, FiClock, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await issueService.getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="page-container">
                    <Navbar />
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare chart data
    const categoryData = {
        labels: analytics?.categoryStats?.map((s) => s._id) || [],
        datasets: [
            {
                label: 'Issues by Category',
                data: analytics?.categoryStats?.map((s) => s.count) || [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
            },
        ],
    };

    const statusData = {
        labels: analytics?.statusStats?.map((s) => s._id) || [],
        datasets: [
            {
                data: analytics?.statusStats?.map((s) => s.count) || [],
                backgroundColor: [
                    'rgba(156, 163, 175, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
            },
        ],
    };

    const severityData = {
        labels: analytics?.severityStats?.map((s) => s._id) || [],
        datasets: [
            {
                data: analytics?.severityStats?.map((s) => s.count) || [],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
            },
        ],
    };

    const pendingCount = analytics?.statusStats?.find((s) => s._id === 'Pending')?.count || 0;
    const inProgressCount = analytics?.statusStats?.find((s) => s._id === 'In Progress')?.count || 0;
    const resolvedCount = analytics?.statusStats?.find((s) => s._id === 'Resolved')?.count || 0;

    return (
        <div className="min-h-screen">
            <ParticleBackground />
            <div className="page-container">
                <Navbar />

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="section-title">Analytics Dashboard</h1>
                    <p className="dark:text-gray-300 text-gray-600">Overview of campus issues and system performance</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Total Issues</p>
                                <p className="text-3xl font-bold dark:text-gray-100 text-gray-900 mt-2">{analytics?.totalIssues || 0}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <FiAlertCircle className="text-blue-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <FiClock className="text-yellow-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Resolved</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{resolvedCount}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <FiCheckCircle className="text-green-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Avg Resolution</p>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">
                                    {analytics?.avgResolutionTime || 0}h
                                </p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-xl">
                                <FiTrendingUp className="text-indigo-600 text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Category Chart */}
                    <div className="glass-card p-6 animate-scale-in">
                        <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900 mb-4">Issues by Category</h3>
                        <Bar
                            data={categoryData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Status Chart */}
                    <div className="glass-card p-6 animate-scale-in">
                        <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900 mb-4">Issues by Status</h3>
                        <div className="max-w-sm mx-auto">
                            <Doughnut
                                data={statusData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Secondary Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Severity Chart */}
                    <div className="glass-card p-6 animate-scale-in">
                        <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900 mb-4">Issues by Severity</h3>
                        <div className="max-w-sm mx-auto">
                            <Doughnut
                                data={severityData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Top Locations */}
                    <div className="glass-card p-6 animate-scale-in">
                        <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900 mb-4">Top Affected Locations</h3>
                        <div className="space-y-3">
                            {analytics?.locationStats?.map((location, index) => (
                                <div
                                    key={location._id}
                                    className="flex items-center justify-between p-3 dark:bg-slate-800/50 bg-blue-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium dark:text-gray-200 text-gray-900">{location._id}</span>
                                    </div>
                                    <span className="text-blue-600 font-bold">{location.count} issues</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/admin/issues')}
                        className="btn-gradient"
                    >
                        Manage All Issues
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
