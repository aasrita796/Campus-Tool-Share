# 🎓 CampusTS — Campus Tool Share

> Borrow smarter. Buy cheaper. The exclusive student marketplace for tools, books & gadgets.

![CampusTS](https://img.shields.io/badge/Stack-MERN-E63946?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

- 🔐 JWT-based Authentication (Register / Login)
- 📦 Post Items with image upload (Buy / Borrow)
- 🛒 Marketplace with category & search filters
- 🔄 Borrow & Buy request system
- 📋 My Listings management (toggle availability, delete)
- 📬 Order tracking (incoming & outgoing)
- 👤 Profile editing
- 📱 Fully responsive design
- 🎨 Gen-Z premium light theme (Student Tribe Red)

---

## 🗂️ Project Structure

```
campusTS/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Navbar, ItemCard
│       ├── context/        # AuthContext
│       └── pages/          # Home, Marketplace, PostItem, etc.
├── server/                 # Node + Express backend
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded images (auto-created)
│   └── index.js
├── package.json            # Root with concurrent scripts
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### 1. Clone / Extract the project

```bash
cd campusts
```

### 2. Install all dependencies

```bash
# From root directory
npm install
cd client && npm install
cd ../server && npm install
```

Or use the shortcut:
```bash
npm run install-all
```

### 3. Configure environment variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusts
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string.

### 4. Start the project

```bash
# From root — runs both server and client concurrently
npm run dev
```

Or run separately:
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run client
```

### 5. Open in browser

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items (with filters) |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create item (auth required) |
| PUT | `/api/items/:id` | Update item (owner only) |
| DELETE | `/api/items/:id` | Delete item (owner only) |
| GET | `/api/items/my` | Get current user's listings |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | My placed orders |
| GET | `/api/orders/incoming` | Requests for my items |
| PUT | `/api/orders/:id/status` | Update order status |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/me` | Update own profile |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Red | `#E63946` |
| Accent Red | `#FF4D4F` |
| Background | `#F8F9FA` |
| Card | `#FFFFFF` |
| Text | `#1A1A1A` |
| Font Heading | Syne (800) |
| Font Body | DM Sans |
| Border Radius | 20px |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Pure CSS with CSS Variables |
| State | React Context API |
| HTTP | Axios |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |

---

## 🌱 Seed Data (Optional)

To seed sample items, run the following after starting MongoDB:

```bash
cd server
node seed.js
```

---

## 📝 License

MIT — Built for students, by students. 💪

---

**Made with ❤️ for the campus community**
