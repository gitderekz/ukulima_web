# Ukulima ERP System

**Comprehensive ERP System for Agricultural Companies**

A complete enterprise resource planning system for agricultural companies that handles loans to farmers, crop purchasing, rebaling/repacking, and transport to factories. The system includes a React web application, Node.js backend API, and Flutter mobile app with offline capabilities.

---

## 🌟 Features

### Web Application
- **Master Data Management**: Locations, Warehouses, Users, Farmers, Crops, Grades, Loans, Prices
- **Operational Modules**: 
  - Buying with automatic loan deductions
  - Rebaling with optional bale tracking
  - Transport management
  - Loan assignment
- **Comprehensive Reporting**: PDF, CSV, and Excel export
- **Role-Based Access Control**: Admin, Manager, Buyer, Clerk, Extension Officer
- **Multi-Language Support**: English, Swahili (i18next)
- **Dark/Light Themes**: User preference based
- **Receipt Generation**: For all operations
- **Location-Based Security**: Farmer filtering based on user location

### Mobile Application (Flutter)
- **Offline-First**: Works without internet connection
- **SQLite Local Storage**: Data persisted on device
- **Bidirectional Sync**: Upload local changes, download server updates
- **Buying Workflow**: Complete purchase process offline
- **Farmer Search**: Quick lookup with offline support
- **Receipt Generation**: Print receipts in offline mode
- **Secure Authentication**: Online login + offline PIN

### Backend API
- **RESTful API**: Express.js server
- **JWT Authentication**: Secure token-based auth
- **Mock Database**: In-memory data for development
- **Comprehensive Endpoints**: All CRUD + special operations
- **Sync Endpoints**: For mobile app synchronization
- **Reports Generation**: Dashboard stats and various reports

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Flutter 3.0+ (for mobile app)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd ukulima-erp
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### 3. Start Web Application
```bash
# From root directory
npm install
npm run dev  # or your dev script
```
WebApp runs on `http://localhost:3000`

### 4. Flutter Mobile App (Optional)
```bash
cd flutter_app
flutter pub get
flutter run
```

---

## 📁 Project Structure

```
ukulima-erp/
├── backend/                 # Node.js/Express Backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & other middleware
│   │   ├── db/             # Mock database
│   │   ├── utils/          # Utilities (JWT, etc.)
│   │   └── server.js       # Server entry point
│   └── package.json
│
├── src/app/                 # React Web Application
│   ├── pages/              # All page components
│   ├── components/         # Reusable components
│   ├── services/           # API service layer
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript types
│   └── i18n/               # Internationalization
│
├── flutter_app/             # Flutter Mobile Application
│   ├── lib/
│   │   ├── core/           # Core utilities
│   │   ├── features/       # Feature modules
│   │   └── main.dart       # App entry point
│   └── pubspec.yaml
│
└── Documentation/           # Complete project documentation
    ├── BACKEND_INTEGRATION_COMPLETE_GUIDE.md
    ├── FLUTTER_SCREENS_COMPLETE.md
    ├── QUICK_START_CHEATSHEET.md
    ├── IMPLEMENTATION_ROADMAP.md
    └── PROJECT_STATUS_SUMMARY.md
```

---

## 🔐 Default Login Credentials

### Admin User
- **Username**: admin@ukulima.com
- **Password**: admin123
- **Role**: admin
- **Access**: All locations and features

### Buyer User
- **Username**: john.mwangi@ukulima.com
- **Password**: buyer123
- **Role**: buyer
- **Access**: Arusha District

### Clerk User
- **Username**: james.omondi@ukulima.com
- **Password**: clerk123
- **Role**: clerk
- **Access**: Arusha Warehouse

---

## 📚 Documentation

Comprehensive documentation available in root directory:

### For Developers
- **`/QUICK_START_CHEATSHEET.md`** - Fast integration templates
- **`/BACKEND_INTEGRATION_COMPLETE_GUIDE.md`** - Detailed WebApp integration
- **`/FLUTTER_SCREENS_COMPLETE.md`** - Complete Flutter screen code
- **`/IMPLEMENTATION_ROADMAP.md`** - Project roadmap and timeline

### For Project Managers
- **`/PROJECT_STATUS_SUMMARY.md`** - Current status and next steps
- **`/WEBAPP_INTEGRATION_PROGRESS.md`** - Integration checklist

---

## 🔧 Configuration

### Backend Environment Variables
Create `/backend/.env`:
```env
PORT=5000
HOST=localhost
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### WebApp Environment Variables
Create `/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Ukulima ERP
VITE_APP_VERSION=1.0.0
```

---

## 📊 Current Status

### ✅ Completed (100%)
- Backend API with all endpoints
- WebApp UI/UX and pages
- API service layer
- Flutter documentation and designs
- Comprehensive documentation

### 🔄 In Progress (21%)
- WebApp-Backend integration
  - ✅ Login, Dashboard, Farmers, Crops, Grades
  - ⏳ 14 remaining pages

### ⏳ Pending (0%)
- Flutter implementation
- Full end-to-end testing
- Deployment setup

**Overall Progress: ~40% Complete**

---

## 🎯 Next Steps

1. **Complete WebApp Integration** (~5 hours)
   - Integrate remaining 14 pages with backend
   - Follow patterns in `/QUICK_START_CHEATSHEET.md`

2. **Implement Flutter App** (~9 hours)
   - Use code from `/FLUTTER_SCREENS_COMPLETE.md`
   - Test offline functionality

3. **Add Animations** (~3.5 hours)
   - WebApp page transitions
   - Flutter screen animations

4. **Testing & Polish** (~7 hours)
   - End-to-end testing
   - Bug fixes
   - Performance optimization

**Estimated Total: 5-7 working days**

---

## 🛠️ Technology Stack

### Frontend (Web)
- React 18
- TypeScript
- Tailwind CSS v4
- Zustand (State Management)
- i18next (Internationalization)
- React Router
- Recharts (Charts)
- jsPDF (PDF Generation)
- Motion/React (Animations)

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs (Password Hashing)
- Express Validator
- Morgan (Logging)
- Helmet (Security)
- CORS

### Mobile (Flutter)
- Flutter 3.0+
- Provider (State Management)
- SQLite (Local Database)
- Dio/HTTP (Networking)
- SharedPreferences (Settings)
- Connectivity Plus (Network Status)
- PDF Generation

---

## 📖 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset

### Master Data
- `/api/farmers` - Farmers CRUD + Search
- `/api/crops` - Crops CRUD
- `/api/grades` - Grades CRUD
- `/api/locations` - Locations CRUD (6-level hierarchy)
- `/api/warehouses` - Warehouses CRUD
- `/api/users` - Users CRUD
- `/api/roles` - Roles CRUD
- `/api/loans` - Loans CRUD + Assignment + Deduction
- `/api/prices` - Prices CRUD

### Operations
- `/api/purchases` - Buying operations
- `/api/rebales` - Rebaling operations
- `/api/transports` - Transport operations

### Reports
- `/api/reports/dashboard` - Dashboard statistics
- `/api/reports/purchases` - Purchase reports
- `/api/reports/rebales` - Rebale reports
- `/api/reports/transports` - Transport reports
- `/api/reports/farmers` - Farmer reports
- `/api/reports/loans` - Loan reports

### Sync (Mobile App)
- `POST /api/sync/download` - Download master data
- `POST /api/sync/upload` - Upload transactions

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test  # (when tests are added)
```

### WebApp Testing
```bash
npm test  # (when tests are added)
```

### API Testing with cURL
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@ukulima.com","password":"admin123"}'

# Get farmers (replace TOKEN)
curl http://localhost:5000/api/farmers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📱 Mobile App Features

### Offline Capabilities
- Complete buying workflow without internet
- Local data storage with SQLite
- Secure offline authentication with PIN
- Queue transactions for sync
- Automatic sync when online

### Sync Mechanism
- Bidirectional synchronization
- Conflict resolution (last-write-wins)
- Incremental sync for efficiency
- Background sync support
- Manual sync option

---

## 🚢 Deployment

### Backend Deployment
1. Set production environment variables
2. Use process manager (PM2 recommended)
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Configure database (replace mock data)

### WebApp Deployment
1. Build production bundle: `npm run build`
2. Deploy to hosting (Vercel, Netlify, etc.)
3. Set production API URL
4. Enable CDN

### Mobile App Deployment
1. Build APK: `flutter build apk`
2. Build iOS: `flutter build ios`
3. Publish to Play Store / App Store

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Contributors

- System Architecture & Backend: [Your Name]
- Frontend Development: [Your Name]
- Mobile Development: [Your Name]
- Documentation: [Your Name]

---

## 📞 Support

For issues, questions, or contributions:
- Email: support@ukulima.com
- Documentation: See `/Documentation/` folder
- Issue Tracker: [Your Issue Tracker URL]

---

## 🎉 Acknowledgments

Built with ❤️ for agricultural companies to streamline operations and empower farmers.

---

**Current Version: 1.0.0**  
**Last Updated: April 15, 2026**
