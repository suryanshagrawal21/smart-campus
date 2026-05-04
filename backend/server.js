// Fix DNS resolution for MongoDB Atlas SRV records (ISP DNS may not support SRV lookups)
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import issueRoutes from './routes/issues.js';
import notificationRoutes from './routes/notifications.js';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Smart Campus API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🎓 Smart Campus Issue Reporting System 🎓          ║
║                                                        ║
║   Server is running on port ${PORT}                      ║
║   Environment: ${process.env.NODE_ENV || 'development'}                     ║
║                                                        ║
║   API Endpoints:                                       ║
║   ├─ Health Check: http://localhost:${PORT}/api/health    ║
║   ├─ Auth: http://localhost:${PORT}/api/auth              ║
║   └─ Issues: http://localhost:${PORT}/api/issues          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
    });
}

export default app;
