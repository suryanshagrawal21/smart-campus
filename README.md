# 🎓 Smart Campus Issue Reporting & Management System

A modern, full-stack web application for managing campus facility issues with intelligent prioritization, role-based access, and real-time analytics.

## ✨ Features

- 🔐 **Role-Based Authentication** - Student, Admin, and Staff access levels
- 📝 **Smart Issue Reporting** - Report issues with images and auto-location detection
- 🧠 **Intelligent Severity Detection** - Automatically prioritizes issues based on multiple factors
- 📊 **Analytics Dashboard** - Real-time insights and visual reports
- 📍 **Location-Based Grouping** - Efficiently manage issues by building/area
- 📱 **Responsive Design** - Seamless experience on mobile and desktop
- 🎨 **Modern UI** - Beautiful gradients, animations, and glass-morphism effects

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router
- Axios
- Chart.js for analytics

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Cloudinary for image storage

## 📁 Project Structure

```
Campus issues project/
├── backend/          # Node.js API server
├── frontend/         # React application
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`

## 👥 User Roles

### Students
- Register and login
- Report campus issues with images
- Track issue status in real-time
- View resolution history

### Admins
- View and manage all issues
- Assign tasks to maintenance staff
- Update issue status
- Access analytics dashboard
- Filter by category, severity, location

### Maintenance Staff
- View assigned tasks
- Update progress
- Mark issues as resolved

## 🔧 Configuration

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📸 Screenshots

Coming soon...

## 🎯 Future Enhancements

- Real-time notifications
- Email alerts
- Mobile app (React Native)
- Advanced analytics with ML predictions
- Multi-language support

## 📄 License

MIT

## 👨‍💻 Developer

Built with ❤️ for making campus life better
