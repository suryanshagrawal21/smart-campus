import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from './pages/AdminDashboard';
import AdminIssues from './pages/AdminIssues';
import IssueDetails from './pages/IssueDetails';
import BrowseIssues from './pages/BrowseIssues';
import MapView from './pages/MapView';
import NotificationsPage from './pages/NotificationsPage';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, isStaff } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin && !isStaff) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, isStaff } = useAuth();

    if (isAuthenticated) {
        if (isAdmin || isStaff) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <PageTransition>
                            <Login />
                        </PageTransition>
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <PageTransition>
                            <Register />
                        </PageTransition>
                    </PublicRoute>
                }
            />

            {/* Student Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <PageTransition>
                            <StudentDashboard />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/browse-issues"
                element={
                    <ProtectedRoute>
                        <PageTransition>
                            <BrowseIssues />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/report-issue"
                element={
                    <ProtectedRoute>
                        <PageTransition>
                            <ReportIssue />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/map"
                element={
                    <ProtectedRoute>
                        <PageTransition>
                            <MapView />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute adminOnly>
                        <PageTransition>
                            <AdminDashboard />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/issues"
                element={
                    <ProtectedRoute adminOnly>
                        <PageTransition>
                            <AdminIssues />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />

            {/* Shared Routes */}
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <PageTransition>
                            <NotificationsPage />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/issue/:id"
                element={
                    <ProtectedRoute>
                        <PageTransition>
                            <IssueDetails />
                        </PageTransition>
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <Chatbot />
            </AuthProvider>
        </Router>
    );
}

export default App;
