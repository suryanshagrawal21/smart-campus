import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import { issueService } from '../services/issueService';
import { useAuth } from '../context/AuthContext';
import UpvoteButton from '../components/UpvoteButton';
import {
    FiMapPin,
    FiCalendar,
    FiUser,
    FiPhone,
    FiMail,
    FiArrowLeft,
    FiEdit,
} from 'react-icons/fi';

const IssueDetails = () => {
    const { id } = useParams();
    const { isAdmin, isStaff } = useAuth();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateData, setUpdateData] = useState({
        status: '',
        adminNotes: '',
    });

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const fetchIssue = async () => {
        try {
            const data = await issueService.getIssueById(id);
            setIssue(data);
            setUpdateData({
                status: data.status,
                adminNotes: data.adminNotes || '',
            });
        } catch (error) {
            console.error('Failed to fetch issue:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            await issueService.updateIssueStatus(id, updateData);
            await fetchIssue();
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Failed to update issue:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="page-container">
                    <Navbar />
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="min-h-screen">
                <div className="page-container">
                    <Navbar />
                    <div className="text-center py-12">
                        <p className="text-gray-300 text-lg">Issue not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="page-container">
                <Navbar />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 dark:text-gray-300 text-gray-600 hover:text-gray-100 mb-6 transition-colors"
                >
                    <FiArrowLeft />
                    <span className="font-medium">Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 animate-fade-in">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold dark:text-gray-100 text-gray-900 mb-4">{issue.title}</h1>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                                        <SeverityBadge severity={issue.severity} />
                                        <StatusBadge status={issue.status} />
                                        <span className="badge dark:bg-purple-900/50 dark:text-purple-300 dark:border dark:border-purple-700 bg-purple-100 text-purple-800">{issue.category}</span>
                                    </div>
                                    <UpvoteButton issue={issue} onUpvoteChange={() => fetchIssue()} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-300 leading-relaxed">{issue.description}</p>
                            </div>

                            {/* Image */}
                            {issue.imageUrl && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-2">Image</h3>
                                    <img
                                        src={issue.imageUrl}
                                        alt="Issue"
                                        className="w-full max-w-2xl rounded-xl shadow-lg"
                                    />
                                </div>
                            )}

                            {/* Location */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-2 flex items-center">
                                    <FiMapPin className="mr-2 text-blue-400" />
                                    Location
                                </h3>
                                <div className="bg-slate-800/60 border border-blue-500/30 p-4 rounded-lg">
                                    <p className="dark:text-gray-200 text-gray-700">
                                        <span className="font-semibold text-blue-400">Building:</span> {issue.location.building}
                                    </p>
                                    {issue.location.floor && (
                                        <p className="dark:text-gray-200 text-gray-700">
                                            <span className="font-semibold text-blue-400">Floor:</span> {issue.location.floor}
                                        </p>
                                    )}
                                    {issue.location.room && (
                                        <p className="dark:text-gray-200 text-gray-700">
                                            <span className="font-semibold text-blue-400">Room:</span> {issue.location.room}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Admin Notes */}
                            {issue.adminNotes && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-2">Admin Notes</h3>
                                    <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
                                        <p className="dark:text-gray-200 text-gray-700">{issue.adminNotes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Admin Update Form */}
                            {(isAdmin || isStaff) && (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    {!showUpdateForm ? (
                                        <button
                                            onClick={() => setShowUpdateForm(true)}
                                            className="btn-gradient"
                                        >
                                            <FiEdit className="inline mr-2" />
                                            Update Issue
                                        </button>
                                    ) : (
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-4">Update Issue Status</h3>

                                            <div>
                                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    value={updateData.status}
                                                    onChange={(e) =>
                                                        setUpdateData({ ...updateData, status: e.target.value })
                                                    }
                                                    className="input-field px-4"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">
                                                    Admin Notes
                                                </label>
                                                <textarea
                                                    value={updateData.adminNotes}
                                                    onChange={(e) =>
                                                        setUpdateData({ ...updateData, adminNotes: e.target.value })
                                                    }
                                                    className="input-field resize-none"
                                                    rows={4}
                                                    placeholder="Add notes about the resolution..."
                                                />
                                            </div>

                                            <div className="flex space-x-4">
                                                <button
                                                    type="submit"
                                                    disabled={updating}
                                                    className="btn-gradient disabled:opacity-50"
                                                >
                                                    {updating ? 'Updating...' : 'Save Changes'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowUpdateForm(false)}
                                                    className="btn-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Timeline */}
                        <div className="glass-card p-6 mb-6 animate-slide-up">
                            <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-4">Timeline</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-900/50 border border-blue-500/50 p-2 rounded-full">
                                        <FiCalendar className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold dark:text-gray-100 text-gray-900">Reported</p>
                                        <p className="text-sm dark:text-gray-300 text-gray-600">
                                            {format(new Date(issue.createdAt), 'MMM dd, yyyy • hh:mm a')}
                                        </p>
                                    </div>
                                </div>

                                {issue.resolvedAt && (
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-green-900/50 border border-green-500/50 p-2 rounded-full">
                                            <FiCalendar className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold dark:text-gray-100 text-gray-900">Resolved</p>
                                            <p className="text-sm dark:text-gray-300 text-gray-600">
                                                {format(new Date(issue.resolvedAt), 'MMM dd, yyyy • hh:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reporter Info */}
                        <div className="glass-card p-6 animate-slide-up">
                            <h3 className="text-lg font-bold dark:text-gray-100 text-gray-900 mb-4">Reporter Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FiUser className="text-blue-600" />
                                    <div>
                                        <p className="text-sm dark:text-gray-300 text-gray-600">Name</p>
                                        <p className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                                            {issue.reportedBy.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <FiMail className="text-blue-600" />
                                    <div>
                                        <p className="text-sm dark:text-gray-300 text-gray-600">Email</p>
                                        <p className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                                            {issue.reportedBy.email}
                                        </p>
                                    </div>
                                </div>

                                {issue.reportedBy.studentId && (
                                    <div className="flex items-center space-x-3">
                                        <FiUser className="text-blue-600" />
                                        <div>
                                            <p className="text-sm dark:text-gray-300 text-gray-600">Student ID</p>
                                            <p className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                                                {issue.reportedBy.studentId}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {issue.reportedBy.phoneNumber && (
                                    <div className="flex items-center space-x-3">
                                        <FiPhone className="text-blue-600" />
                                        <div>
                                            <p className="text-sm dark:text-gray-300 text-gray-600">Phone</p>
                                            <p className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                                                {issue.reportedBy.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
