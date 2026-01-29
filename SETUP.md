# 🚀 Quick Start Guide - Smart Campus Issue Reporting System

## Prerequisites Checklist
- [x] Node.js installed (v16+)
- [ ] MongoDB Atlas account (free tier)
- [ ] Cloudinary account (free tier)

---

## ⚡ 5-Minute Setup

### 1. Set Up MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click **"Create a New Cluster"** (choose FREE tier)
4. Wait for cluster to deploy (~2 minutes)
5. Click **"Connect"** → **"Connect your application"**
6. **Copy the connection string** - you'll need this!

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/campus-issues?retryWrites=true&w=majority
```

### 2. Set Up Cloudinary (1 minute)

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free
3. Go to **Dashboard**
4. Copy these three values:
   - Cloud Name
   - API Key
   - API Secret

### 3. Configure Backend (.env file)

1. Navigate to `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   copy .env.example .env   # Windows
   # or
   cp .env.example .env     # Mac/Linux
   ```
3. Edit `backend/.env` and paste your values:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=any_random_long_string_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 4. Configure Frontend (.env file)

1. Navigate to `frontend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cd frontend
   copy .env.example .env   # Windows
   # or
   cp .env.example .env     # Mac/Linux
   ```
3. The default value should work as-is:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### 5. Start the Application

**Open TWO terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ You should see: "MongoDB Connected" and server running on port 5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Browser should open automatically at http://localhost:5173

---

## 🎯 First-Time Usage

### Create Your First Student Account

1. Open http://localhost:5173
2. Click **"Register here"**
3. Fill in:
   - Name: John Doe
   - Email: student@test.com
   - Password: 123456
   - Student ID: STU001 (optional)
   - Department: Computer Science (optional)
4. Click **"Create Account"**
5. You'll be auto-logged in to the dashboard!

### Report Your First Issue

1. Click **"Report New Issue"**
2. Fill in:
   - Title: "Broken AC in Lab 301"
   - Category: Infrastructure
   - Description: "The air conditioning system is not working..."
   - Building: "Engineering Block A"
   - Floor: "3"
   - Room: "301"
3. **Optional**: Drag and drop an image
4. Click **"Submit Issue"**
5. Watch the smart severity calculation in action! 🧠

---

## 👨‍💼 Create Admin Account

**Option 1: Via MongoDB Compass/Atlas Web UI**
1. Open MongoDB Atlas or MongoDB Compass
2. Connect to your database
3. Find the `users` collection
4. Find your user document
5. Edit the `role` field from `"student"` to `"admin"`
6. Save
7. Logout and login again

**Option 2: Via API (Postman/Insomnia)**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@campus.edu",
  "password": "admin123",
  "role": "admin"
}
```

---

## 🎬 Demo Scenario

### Complete User Journey (5 minutes)

1. **Register as Student**
   - Create account
   - Explore empty dashboard

2. **Report 3 Issues**
   - One with image (higher severity)
   - Two from the same building (triggers location clustering)
   - Use urgent keywords ("emergency", "broken")

3. **Switch to Admin**
   - Logout
   - Login as admin
   - See analytics dashboard populate
   - View charts and statistics

4. **Manage Issues**
   - Filter by category
   - Search by keyword
   - Update issue status
   - Add admin notes

5. **Back to Student**
   - Logout, login as student
   - See updated status
   - View admin notes

---

## ⚠️ Troubleshooting

### Backend Won't Start

**Error: "MongoServerError: Authentication failed"**
- Check your MongoDB connection string
- Make sure password is correct (no special characters causing issues)
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)

**Error: "Port 5000 already in use"**
- Change `PORT=5000` in `.env` to another port (e.g., `PORT=5001`)
- Update frontend `.env`: `VITE_API_URL=http://localhost:5001/api`

### Frontend Won't Start

**Error: "Cannot connect to API"**
- Make sure backend is running first
- Check `VITE_API_URL` in frontend `.env`
- Try clearing browser cache

**Images Won't Upload**
- Verify Cloudinary credentials in backend `.env`
- Check Cloudinary dashboard for upload quota
- Ensure image is under 5MB

---

## 📋 Checklist Before Demo

- [ ] MongoDB Atlas connected successfully
- [ ] Cloudinary working (test image upload)
- [ ] At least 2 user accounts (1 student, 1 admin)
- [ ] 10-15 sample issues created
- [ ] Various categories represented
- [ ] Different severity levels visible
- [ ] Some issues resolved, some pending
- [ ] Admin notes added to some issues
- [ ] Charts displaying correctly
- [ ] Tested on different screen sizes

---

## 🎨 UI Showcase Points

- **Glass-Morphism Effects**: Frosted glass cards
- **Gradient Backgrounds**: Smooth color transitions
- **Animations**: Fade-in, slide-up effects
- **Responsive Design**: Try resizing browser
- **Drag & Drop**: Image upload experience
- **Color-Coded Badges**: Severity and status indicators
- **Interactive Charts**: Hover over data points
- **Real-Time Filtering**: Watch results update instantly

---

## 📱 Testing on Mobile

1. Open browser dev tools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro
4. Test all features:
   - Registration
   - Login
   - Issue reporting
   - Dashboard navigation
   - Image upload (tap to browse)

---

## 🎯 Key Features to Demonstrate

1. **Smart Severity Algorithm**
   - Report issue without image: See lower severity
   - Report with image: Severity increases
   - Report multiple from same building: Watch severity jump

2. **Analytics Dashboard**
   - Show category distribution
   - Explain status breakdown
   - Highlight top affected locations
   - Point out resolution time metric

3. **Filtering System**
   - Type in search: Instant results
   - Change category filter: Dynamic update
   - Combine filters: Powerful search

4. **Role-Based Access**
   - Student sees own issues only
   - Admin sees all issues
   - Different navigation menus

---

## 💡 Pro Tips

1. **Generate Sample Data**: Use different student accounts to create issues
2. **Vary Timestamps**: Create issues over time for better analytics
3. **Use Real Building Names**: Makes demo more relatable
4. **Upload Actual Images**: More impressive than placeholder icons
5. **Prepare Talking Points**: For each smart feature
6. **Practice Flow**: Student report → Admin review → Resolution

---

## 🚀 You're All Set!

The application is now fully configured and ready to use. Start by creating some sample data and exploring all the features.

**Need Help?**
- Check the comprehensive [walkthrough.md](./walkthrough.md) for detailed documentation
- Review [implementation_plan.md](./implementation_plan.md) for architecture details
- All code is well-commented and organized

**Happy Reporting! 🎓✨**
