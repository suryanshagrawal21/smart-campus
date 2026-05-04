# 🎓 Smart Campus Issue Reporting & Management System

A modern, full-stack web application for managing campus facility issues with intelligent prioritization, role-based access, and real-time analytics.

## 🌐 Live Demo

> **Frontend (Vercel):** [https://smart-campus-zbhp.vercel.app](https://smart-campus-zbhp.vercel.app)
> **Backend (Render):** [https://smart-campus-k63w.onrender.com](https://smart-campus-k63w.onrender.com)

### 🔑 Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@testing.com` | `testing` |
| Student | `user@testing.com` | `testing` |

---

## ✨ Features

- 🔐 **Role-Based Authentication** — Student, Admin, and Staff access levels
- 📝 **Smart Issue Reporting** — Report issues with images and auto-location detection
- 🧠 **Intelligent Severity Detection** — Automatically prioritizes issues based on multiple factors
- 📊 **Analytics Dashboard** — Real-time insights and visual reports
- 📍 **Location-Based Grouping** — Efficiently manage issues by building/area
- 🗺️ **Interactive Map View** — View all issues on a live campus map
- 📱 **Responsive Design** — Seamless experience on mobile and desktop
- 🎨 **Modern UI** — Beautiful gradients, animations, and glass-morphism effects
- 📧 **Email Notifications** — Get notified on login and registration via Gmail

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router
- Axios
- Chart.js for analytics
- Leaflet.js for maps

### Backend
- Node.js & Express
- MongoDB Atlas with Mongoose
- JWT Authentication
- Nodemailer for email notifications
- Cloudinary for image storage

## 📁 Project Structure

```
smartcampus/
├── backend/          # Node.js API server
├── frontend/         # React application (Vite)
└── README.md
```

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel (Root Directory: `frontend`) |
| Backend | Render |
| Database | MongoDB Atlas |

### Environment Variables (Backend)
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
PORT=5001
```

### Environment Variables (Frontend)
```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

## 🚀 Local Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

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
npm install --legacy-peer-deps
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
- Update issue status (pending → in-progress → resolved)
- Access full analytics dashboard
- Filter by category, severity, location

## 📄 License

MIT

## 👨‍💻 Developer

**Suryansh Agrawal**
Built with ❤️ for making campus life better
