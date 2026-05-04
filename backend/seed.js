import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        // Check if users already exist and delete them to avoid duplicate errors for testing
        await User.deleteMany({ email: { $in: ['admin@testing.com', 'user@testing.com'] } });

        await User.create([
            {
                name: 'Admin User',
                email: 'admin@testing.com',
                password: 'testing',
                role: 'admin'
            },
            {
                name: 'Student User',
                email: 'user@testing.com',
                password: 'testing',
                role: 'student'
            }
        ]);

        console.log('Users created successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding users:', err);
        process.exit(1);
    }
};

seedUsers();
