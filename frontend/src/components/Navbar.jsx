import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiAlertCircle, FiLogOut, FiUser, FiHome, FiBarChart2, FiSun, FiMoon, FiSearch, FiMap } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, logout, isAdmin, isStaff, isStudent } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-[100] mb-8 dark:bg-slate-900/95 bg-white/95 backdrop-blur-xl border-b dark:border-slate-700 border-gray-200 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to={isAdmin || isStaff ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
                        <div className="p-1">
                            <img src="/logo.png" alt="Smart Campus Logo" className="h-10 w-10 rounded-lg" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Smart Campus</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        {isStudent && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiHome />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link
                                    to="/browse-issues"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiSearch />
                                    <span className="font-medium">Browse Issues</span>
                                </Link>
                                <Link
                                    to="/report-issue"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiAlertCircle />
                                    <span className="font-medium">Report Issue</span>
                                </Link>
                                <Link
                                    to="/map"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiMap />
                                    <span className="font-medium">Map View</span>
                                </Link>
                            </>
                        )}

                        {(isAdmin || isStaff) && (
                            <>
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiHome />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link
                                    to="/admin/issues"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiBarChart2 />
                                    <span className="font-medium">Manage Issues</span>
                                </Link>
                                <Link
                                    to="/map"
                                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FiMap />
                                    <span className="font-medium">Map View</span>
                                </Link>
                            </>
                        )}

                        {/* Notification Bell */}
                        <NotificationBell />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg dark:bg-slate-700 bg-gray-200 dark:hover:bg-slate-600 hover:bg-gray-300 transition-colors"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-indigo-600" />}
                        </button>

                        {/* User Menu Border*/}
                        <div className="h-8 w-px dark:bg-gray-700 bg-gray-300"></div>

                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                                    <FiUser className="text-white" />
                                </div>
                                <div>
                                    <p className="dark:text-gray-200 text-gray-800 font-semibold text-sm">{user?.name}</p>
                                    <p className="dark:text-gray-400 text-gray-500 text-xs capitalize">{user?.role}</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                                title="Logout"
                            >
                                <FiLogOut />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
