import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiTrash2, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { notificationService } from '../services/notificationService';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = filter === 'unread' ? { unreadOnly: true } : {};
            const data = await notificationService.getMyNotifications(params);
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                await notificationService.markAsRead(notification._id);
            }
            navigate(`/issue/${notification.issue?._id || notification.issue}`);
        } catch (error) {
            console.error('Failed to navigate:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDeleteNotification = async (e, notificationId) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(notificationId);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'resolved':
                return '✅';
            case 'in_progress':
                return '🔧';
            case 'rejected':
                return '❌';
            case 'comment':
                return '💬';
            case 'upvote_milestone':
                return '🎉';
            default:
                return '📝';
        }
    };

    const groupNotificationsByDate = (notifications) => {
        const groups = {
            today: [],
            yesterday: [],
            thisWeek: [],
            older: [],
        };

        notifications.forEach((notification) => {
            const date = new Date(notification.createdAt);
            if (isToday(date)) {
                groups.today.push(notification);
            } else if (isYesterday(date)) {
                groups.yesterday.push(notification);
            } else if (isThisWeek(date)) {
                groups.thisWeek.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    };

    const renderNotificationGroup = (title, notifications) => {
        if (notifications.length === 0) return null;

        return (
            <div className="mb-8">
                <h3 className="text-sm font-bold dark:text-gray-400 text-gray-600 mb-3 uppercase tracking-wide">
                    {title}
                </h3>
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`glass-card p-4 cursor-pointer transition-all hover:scale-[1.01] ${notification.read
                                    ? 'opacity-70'
                                    : 'ring-2 ring-blue-500/20'
                                }`}
                        >
                            <div className="flex items-start space-x-4">
                                <span className="text-3xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${notification.read ? 'dark:text-gray-300 text-gray-700' : 'dark:text-gray-100 text-gray-900 font-medium'}`}>
                                        {notification.message}
                                    </p>
                                    {notification.issue && (
                                        <p className="text-xs dark:text-gray-500 text-gray-500 mt-1">
                                            {notification.issue.title} • {notification.issue.category}
                                        </p>
                                    )}
                                    <p className="text-xs dark:text-gray-500 text-gray-500 mt-2">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                    <button
                                        onClick={(e) => handleDeleteNotification(e, notification._id)}
                                        className="p-2 rounded-lg dark:hover:bg-red-600/10 hover:bg-red-50 text-red-600 transition-colors"
                                        aria-label="Delete notification"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const filteredNotifications = filter === 'read'
        ? notifications.filter(n => n.read)
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications;

    const groupedNotifications = groupNotificationsByDate(filteredNotifications);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen">
            <div className="page-container">
                <Navbar />

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="section-title">Notifications</h1>
                    <p className="dark:text-gray-300 text-gray-600">
                        Stay updated on your reported issues
                    </p>
                </div>

                {/* Controls */}
                <div className="glass-card p-6 mb-8 animate-slide-up">
                    <div className="flex items-center justify-between">
                        {/* Filter Tabs */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'dark:bg-slate-700 bg-gray-200 dark:text-gray-300 text-gray-700'
                                    }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                        ? 'bg-blue-600 text-white'
                                        : 'dark:bg-slate-700 bg-gray-200 dark:text-gray-300 text-gray-700'
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                            <button
                                onClick={() => setFilter('read')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'read'
                                        ? 'bg-blue-600 text-white'
                                        : 'dark:bg-slate-700 bg-gray-200 dark:text-gray-300 text-gray-700'
                                    }`}
                            >
                                Read ({notifications.length - unreadCount})
                            </button>
                        </div>

                        {/* Mark All Read */}
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <FiCheck />
                                <span>Mark all as read</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FiBell className="text-gray-400 text-5xl mx-auto mb-4" />
                        <p className="dark:text-gray-300 text-gray-700 text-lg">
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </p>
                        <p className="dark:text-gray-500 text-gray-500 mt-2">
                            We'll let you know when there are updates on your issues
                        </p>
                    </div>
                ) : (
                    <div>
                        {renderNotificationGroup('Today', groupedNotifications.today)}
                        {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
                        {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
                        {renderNotificationGroup('Older', groupedNotifications.older)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
