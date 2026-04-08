# 🎨 WallCraft — Premium Wallpaper Marketplace

A full-stack wallpaper marketplace where users can browse, download free wallpapers, purchase premium wallpapers, and creators can upload and sell their work.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Storage | Cloudinary |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Payments | Razorpay |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
wallpaper-marketplace/
├── client/                        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── WallpaperCard.jsx
│   │   │   ├── WallpaperGrid.jsx
│   │   │   └── CategoryFilter.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── WallpaperDetailPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── FavoritesPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useWallpapers.js
│   │   │   └── usePayment.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── wallpaperService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                        # Node.js Backend
    ├── config/
    │   ├── db.js
    │   └── cloudinary.js
    ├── controllers/
    │   ├── authController.js
    │   ├── wallpaperController.js
    │   └── orderController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── User.js
    │   ├── Wallpaper.js
    │   └── Order.js
    ├── routes/
    │   ├── auth.js
    │   ├── wallpapers.js
    │   ├── orders.js
    │   └── users.js
    ├── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ and npm
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)
- **Razorpay** account (test mode for development)

---

## 🛠️ Step-by-Step Setup

### Step 1 — Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd wallpaper-marketplace

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2 — Configure MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **Cluster** (M0 Free Tier)
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs) or your server IP
5. Click **Connect → Connect your application** and copy the connection string
6. Replace `<username>` and `<password>` with your database user credentials

---

### Step 3 — Configure Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier: 25GB storage)
2. Go to **Dashboard** and copy your:
   - Cloud Name
   - API Key
   - API Secret

---

### Step 4 — Configure Razorpay

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys**
3. Generate a new key pair for **Test Mode**
4. Copy the **Key ID** and **Key Secret**

---

### Step 5 — Set Environment Variables

**Server** — Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wallpaper_marketplace?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

**Client** — Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

---

### Step 6 — Run the Application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Frontend running on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

---

## 🎯 Features Overview

### For Users
- ✅ Browse wallpapers in masonry grid layout
- ✅ Search by title, description, tags
- ✅ Filter by category and free/premium
- ✅ Sort by newest, popular, most liked
- ✅ Infinite scroll pagination
- ✅ Like/favorite wallpapers
- ✅ Download free wallpapers instantly
- ✅ Purchase premium wallpapers via Razorpay
- ✅ View purchases in dashboard
- ✅ Lightbox image preview

### For Creators
- ✅ Register as Creator role
- ✅ Upload wallpapers with metadata
- ✅ Set free or paid pricing
- ✅ Auto-generate thumbnails via Cloudinary
- ✅ View upload stats (downloads, likes)
- ✅ Track earnings (80% revenue share)
- ✅ Manage and delete uploads

### Security
- ✅ JWT authentication on all protected routes
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Razorpay signature verification on payments
- ✅ Premium wallpaper URLs only released after purchase verification
- ✅ Creator-only routes protected by role middleware
- ✅ CORS restricted to frontend origin

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Set:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
5. Add all environment variables from `server/.env`
6. Deploy — note your Render URL (e.g., `https://wallcraft-api.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set **Root Directory** to `client`
4. Add environment variables:
   - `VITE_API_URL=https://wallcraft-api.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID=your_razorpay_key`
5. Deploy

### Post-Deployment
Update `CLIENT_URL` in your Render backend environment variables to your Vercel URL.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile |

### Wallpapers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wallpapers` | Optional | List wallpapers (with filters) |
| GET | `/api/wallpapers/:id` | Optional | Get single wallpaper |
| POST | `/api/wallpapers/upload` | Creator | Upload wallpaper |
| DELETE | `/api/wallpapers/:id` | Creator/Admin | Delete wallpaper |
| POST | `/api/wallpapers/:id/like` | Yes | Like/unlike |
| GET | `/api/wallpapers/:id/download` | Optional | Get download URL |
| GET | `/api/wallpapers/creator/my` | Creator | Get own uploads |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/create` | Yes | Create Razorpay order |
| POST | `/api/orders/verify` | Yes | Verify payment |
| GET | `/api/orders/user` | Yes | Get user's purchases |
| GET | `/api/orders/check/:wallpaperId` | Yes | Check if purchased |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/favorites` | Yes | Get liked wallpapers |
| GET | `/api/users/creator/stats` | Creator | Get earnings stats |

---

## 💳 Payment Flow

```
User clicks "Buy" → Backend creates Razorpay order
       ↓
Razorpay checkout opens in browser
       ↓
User completes payment on Razorpay
       ↓
Frontend receives payment_id, order_id, signature
       ↓
Backend verifies HMAC-SHA256 signature
       ↓
Order marked "completed" in MongoDB
       ↓
Creator earnings updated (80% share)
       ↓
User can now download wallpaper
```

---

## 🧪 Test Credentials (Razorpay Test Mode)

For testing payments, use Razorpay test cards:
- **Card:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

UPI: `success@razorpay`

---

## 🔧 Customization

### Add New Categories
In `server/models/Wallpaper.js`, update the `enum` array in the `category` field.
Also update `CATEGORIES` in `client/src/components/CategoryFilter.jsx`.

### Change Revenue Split
In `server/controllers/orderController.js`, change `0.8` (80%) to your desired creator share.

### Enable Moderation
In `server/models/Wallpaper.js`, change `isApproved` default from `true` to `false`.
Add an admin endpoint to approve wallpapers.

---

## 📦 Key Dependencies

### Server
- `express` — Web framework
- `mongoose` — MongoDB ODM
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT auth
- `cloudinary` + `multer-storage-cloudinary` — Image uploads
- `razorpay` — Payment gateway
- `cors` — Cross-origin resource sharing

### Client
- `react-router-dom` — Routing
- `axios` — HTTP client
- `react-hot-toast` — Notifications
- `lucide-react` — Icons
- `framer-motion` — Animations

---

## 🐛 Troubleshooting

**CORS errors** → Check `CLIENT_URL` in server `.env` matches your frontend URL exactly.

**Cloudinary upload fails** → Verify all 3 Cloudinary credentials are correct in `.env`.

**Razorpay "invalid key"** → Ensure you're using the correct Key ID (not the secret) in both `.env` files.

**MongoDB connection fails** → Check your IP is whitelisted in Atlas Network Access.

**Images not loading after deployment** → Check Cloudinary dashboard that images are uploaded to the `wallpaper_marketplace` folder.

---

## 📄 License

MIT License — free to use, modify, and distribute.
