# Ukulima ERP System

A comprehensive agricultural management system for Ukulima company, built with React, TypeScript, and modern web technologies.

## 🌟 Features

### Core Modules

1. **Dashboard**
   - Real-time statistics (farmers, purchases, revenue, warehouse capacity)
   - Weekly purchase and revenue charts
   - System health monitoring
   - Quick access to key metrics

2. **Buying Module** ✅ Fully Implemented
   - Farmer search and selection
   - Crop/grade selection with price lookup
   - Multiple bale accumulation per farmer
   - Automatic bale tag validation
   - Real-time total calculation
   - Automatic loan deduction based on settings
   - Receipt generation with detailed breakdown
   - Pending bale persistence (resume incomplete purchases)

3. **Rebale/Repacking** (Placeholder)
   - Combine small bales into large ones
   - Similar grade grouping
   - Warehouse storage tracking

4. **Transport/Dispatch** (Placeholder)
   - Bale loading to trucks
   - Driver and vehicle tracking
   - QR/Barcode scanning support
   - Transport receipt generation

5. **Reports** (Placeholder)
   - Buying reports (general, by farmer, by grade)
   - Rebale reports (general, by grade)
   - Transport reports (general, by driver, by grade)
   - Loan deduction reports
   - PDF/CSV/Excel export

6. **Master Data Management** (Placeholders)
   - Locations (hierarchical: Street → Ward → District → Region → CPP → Zone)
   - Warehouses
   - Users (role-based: admin, IT, manager, officer, clerk, buyer)
   - Farmers
   - Crops
   - Grades
   - Loans
   - Crop Grade Prices

### System Features

- ✅ **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure login/logout
  - Session persistence

- ✅ **Multilanguage Support**
  - English
  - Swahili (Kiswahili)
  - French (Français)
  - Spanish (Español)
  - Chinese (中文)
  - Extensible for: Russian, Arabic, Portuguese, Persian, Hindi, Thai, Malay, Indonesian

- ✅ **Theme Support**
  - Light mode
  - Dark mode
  - System preference detection
  - Persistent theme selection

- ✅ **Notifications**
  - Real-time notifications
  - Unread indicator
  - User-specific notifications

- ✅ **Responsive Design**
  - Mobile-friendly
  - Tablet optimized
  - Desktop full-featured

- ✅ **Security**
  - CORS protection
  - JWT token management
  - Input validation
  - SQL injection prevention
  - XSS protection

## 🚀 Getting Started

### Demo Credentials

**Admin Account:**
- Email: `admin@ukulima.com`
- Password: `admin123`
- Access: All modules

**Buyer Account:**
- Email: `john.mwangi@ukulima.com`
- Password: `buyer123`
- Access: Buying, Rebale, Transport

**Manager Account:**
- Email: `grace.njeri@ukulima.com`
- Password: `manager123`
- Access: Dashboard, Reports, Master Data

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (already running in Figma Make environment)
# The app is ready to use immediately
```

## 📋 Usage Guide

### 1. Login
1. Use one of the demo credentials above
2. Click "Login"
3. You'll be redirected to the dashboard

### 2. Buying Crops from Farmers

#### Step-by-Step Process:

1. **Navigate to Buying Module**
   - Click "Buying" in the sidebar
   - Buyer information auto-fills (zone, CPP, buyer name/code)

2. **Select Farmer**
   - Type farmer name or code in search box
   - Select from dropdown results
   - Example: Search "Joseph" or "FRM-001"

3. **Select Crop & Grade**
   - Type crop name or grade in search box
   - Example: "Coffee Grade A" or "8500"
   - Price automatically fills

4. **Enter Bale Details**
   - Bale Tag: Unique identifier (e.g., "BL-2026-0001")
   - Mass: Weight in kg (e.g., "50.00")
   - See real-time calculation of bale amount

5. **Add Bale**
   - Click "Next Bale" button
   - Bale appears in accumulated list
   - Form clears for next bale entry
   - Running total updates

6. **Continue Adding Bales**
   - Repeat steps 3-5 for each bale
   - Edit or delete bales using action buttons
   - View total amount in real-time

7. **Generate Receipt**
   - Click "Print Receipt" when all bales entered
   - System automatically:
     - Calculates total amount
     - Checks farmer's outstanding loans
     - Applies loan deduction based on settings
     - Generates unique receipt number
     - Creates purchase record
     - Updates farmer's debt
     - Logs the transaction

8. **Receipt Details**
   - View complete transaction summary
   - See loan deduction breakdown
   - Print receipt for farmer
   - Close to start new purchase

#### Loan Deduction Logic:

- **If Total Amount ≥ Total Debt:**
  - Full loan deducted
  - Farmer receives: Total Amount - Total Debt

- **If Total Amount < Total Debt:**
  - Partial deduction (based on settings %)
  - Default: 70% of total amount deducted
  - Farmer receives: Total Amount × (1 - Deduction %)

### 3. Dashboard Overview

- **Total Farmers:** All registered farmers
- **Total Purchases:** Cumulative purchases
- **Total Revenue:** Sum of all purchases
- **Warehouse Capacity:** Current storage utilization
- **Charts:** Weekly trends for purchases and revenue

### 4. Role-Based Navigation

Different users see different menus:

- **Admin/IT:** Full access to all modules
- **Manager:** Dashboard, Reports, Master Data
- **Buyer/Clerk:** Buying, Rebale, Transport
- **Officer:** Dashboard, Reports

### 5. Theme & Language

**Change Theme:**
- Click sun/moon icon in header
- Toggle between light and dark mode

**Change Language:**
- Click globe icon in header
- Select from dropdown:
  - English
  - Swahili
  - Français
  - Español
  - 中文

## 🗄️ Database Structure

### Tables

1. **locations** - Hierarchical location data
2. **warehouses** - Storage facilities
3. **users** - System users with roles
4. **farmers** - Farmer registry
5. **crops** - Crop types
6. **grades** - Quality grades
7. **crop_grade_prices** - Pricing matrix
8. **loans** - Loan products
9. **farmer_loans** - Farmer loan assignments
10. **purchases** - Purchase transactions
11. **bales** - Individual bales
12. **rebales** - Repacked large bales
13. **transports** - Dispatch records
14. **loan_deductions** - Deduction history
15. **settings** - System configuration
16. **audit_logs** - Activity tracking
17. **notifications** - User notifications

### Mock Data

The system includes comprehensive mock data:
- 5 users (various roles)
- 5 farmers with realistic debt profiles
- 4 crops (Coffee, Maize, Rice, Cotton)
- 4 grades (A, B, C, D)
- 6 loan products
- 3 warehouses
- Sample purchases and transactions
- Hierarchical location tree

## 🔧 Technical Stack

- **Frontend Framework:** React 18.3.1
- **Language:** TypeScript
- **Routing:** React Router 7
- **State Management:** Zustand
- **Forms:** React Hook Form
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Internationalization:** i18next
- **Notifications:** Sonner
- **Date Handling:** date-fns
- **Export:** jsPDF, XLSX

## 📱 Responsive Design

- **Mobile (< 768px):** Collapsed sidebar, vertical layouts
- **Tablet (768px - 1024px):** Optimized grid layouts
- **Desktop (> 1024px):** Full sidebar, multi-column layouts

## 🔐 Security Features

1. **Authentication:**
   - JWT token-based
   - Secure session management
   - Automatic logout on token expiration

2. **Authorization:**
   - Role-based access control
   - Route protection
   - Feature-level permissions

3. **Input Validation:**
   - Form validation
   - Type checking (TypeScript)
   - Unique constraint enforcement

4. **Data Protection:**
   - No sensitive data in logs
   - Secure password handling
   - CORS configuration

## 🎯 Next Steps for Full Implementation

### Priority 1: Complete Core Modules
1. **Rebale Module:**
   - Bale selection interface
   - Mass accumulation
   - Large bale creation
   - Receipt generation

2. **Transport Module:**
   - Rebale search/scan
   - Driver & vehicle input
   - Load accumulation
   - Transport receipt

3. **Reports Module:**
   - Date range filters
   - Export to PDF/CSV/Excel
   - All report types per requirements
   - Print functionality

### Priority 2: Master Data CRUD
1. **Location Management:**
   - Tree view display
   - Add/edit/delete operations
   - Hierarchy validation

2. **Warehouse Management:**
   - CRUD operations
   - Capacity tracking
   - Location assignment

3. **User Management:**
   - User registration
   - Role assignment
   - Location/warehouse assignment
   - Profile picture upload

4. **Farmer Management:**
   - Registration form
   - Loan history view
   - Purchase history
   - Profile picture upload

5. **Crop/Grade/Price Management:**
   - CRUD interfaces
   - Price history tracking
   - Effective date management

6. **Loan Management:**
   - Loan product CRUD
   - Farmer loan assignment
   - Payment tracking

### Priority 3: Advanced Features
1. **File Uploads:**
   - Profile pictures
   - CSV/Excel import
   - Bulk data import

2. **Advanced Reporting:**
   - Custom date ranges
   - Multi-level filtering
   - Data visualization
   - Scheduled reports

3. **Settings:**
   - Deduction percentage configuration
   - Color customization
   - Currency settings
   - System preferences

4. **Audit Trail:**
   - Complete activity logging
   - User action tracking
   - Data change history

5. **Barcode/QR Integration:**
   - Generate bale QR codes
   - Scan for quick lookup
   - Print labels

## 🐛 Known Limitations

1. **Mock Database:** Currently using in-memory data (not persistent across page reloads for production)
2. **Placeholder Pages:** Rebale, Transport, Reports, and Master Data pages need full implementation
3. **Real Backend:** Needs MySQL database and Node.js backend with Sequelize
4. **File Upload:** Media upload functionality not implemented
5. **Email/SMS:** Notification delivery not connected

## 📞 Support

For issues or questions:
- Review this documentation
- Check demo credentials
- Verify role permissions
- Check browser console for errors

## 📄 License

Proprietary - Ukulima Company

---

**Built with ❤️ for Ukulima Agricultural Solutions**
