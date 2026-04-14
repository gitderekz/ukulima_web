# Ukulima ERP Backend API

Backend API server for the Ukulima ERP system. Built with Express.js and using mock data (no real database required).

## Features

✅ **Authentication**
- JWT-based authentication
- Login, Signup, Forgot Password, Reset Password
- Protected routes with role-based access control

✅ **Data Synchronization**
- Download data for mobile app (location-filtered)
- Upload data from mobile app (batch operations)
- Automatic farmer debt updates

✅ **Mock Database**
- In-memory mock data (similar to frontend)
- Full CRUD operations
- No MySQL installation required for development

✅ **Security**
- Helmet for security headers
- CORS protection
- Password hashing with bcryptjs
- JWT token verification

✅ **Performance**
- Response compression
- Request logging with Morgan
- Optimized data filtering

## Installation

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Or start production server
npm start
```

## Environment Variables

Create a `.env` file in the backend root:

```env
NODE_ENV=development
PORT=5000
HOST=localhost

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000

API_VERSION=v1
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login user

**Request Body:**
```json
{
  "email": "admin@ukulima.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "firstName": "Admin",
    "lastName": "System",
    "email": "admin@ukulima.com",
    "role": "admin",
    "locationId": "loc-1",
    "isActive": true
  }
}
```

#### POST /api/auth/signup
Register new user

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@ukulima.com",
  "phone": "+255712345678",
  "password": "password123",
  "role": "buyer",
  "code": "BUY-003",
  "locationId": "loc-9",
  "warehouseId": "wh-1"
}
```

#### POST /api/auth/forgot-password
Request password reset

**Request Body:**
```json
{
  "email": "admin@ukulima.com"
}
```

#### POST /api/auth/reset-password
Reset password with token

**Request Body:**
```json
{
  "email": "admin@ukulima.com",
  "newPassword": "newpassword123",
  "resetToken": "abc123def456"
}
```

#### GET /api/auth/me
Get current authenticated user (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

### Data Sync

#### POST /api/sync/download
Download data for mobile app (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user-2",
  "locationId": "loc-9"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "locations": [...],
    "warehouses": [...],
    "farmers": [...],
    "crops": [...],
    "grades": [...],
    "cropGradePrices": [...],
    "loans": [...],
    "farmerLoans": [...],
    "settings": {...}
  }
}
```

#### POST /api/sync/upload
Upload data from mobile app (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user-2",
  "purchases": [...],
  "bales": [...],
  "rebales": [...],
  "transports": [...],
  "farmerLoans": [...],
  "loanDeductions": [...],
  "errorLogs": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data synced successfully",
  "summary": {
    "purchases": 5,
    "bales": 15,
    "rebales": 3,
    "transports": 2,
    "farmerLoans": 8,
    "loanDeductions": 5,
    "errorLogs": 0,
    "total": 38
  }
}
```

## Default Users

The system comes with pre-configured users:

| Email | Password | Role |
|-------|----------|------|
| admin@ukulima.com | admin123 | admin |
| john.mwangi@ukulima.com | buyer123 | buyer |
| mary.kimani@ukulima.com | buyer123 | buyer |
| james.omondi@ukulima.com | clerk123 | clerk |
| grace.njeri@ukulima.com | manager123 | manager |
| daniel.kimani@ukulima.com | it123 | IT |
| sarah.wanjiku@ukulima.com | officer123 | officer |
| peter.kamau@ukulima.com | officer123 | officer |

## Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ukulima.com","password":"admin123"}'
```

### Test Protected Route
```bash
# First login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ukulima.com","password":"admin123"}' \
  | jq -r '.token')

# Use token to access protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   └── syncController.js
│   ├── middleware/       # Express middleware
│   │   └── auth.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   └── syncRoutes.js
│   ├── db/              # Mock database
│   │   ├── database.js
│   │   └── mockData.js
│   ├── utils/           # Utility functions
│   │   └── jwt.js
│   └── server.js        # Express app entry point
├── .env                 # Environment variables
├── .env.example         # Environment template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
└── README.md           # This file
```

## Development Notes

- **No Real Database**: Uses in-memory mock data for development
- **Auto-Reload**: Uses nodemon for automatic server restart on file changes
- **Password Hashing**: All passwords are hashed with bcryptjs (salt rounds: 10)
- **JWT Expiry**: Default token expiry is 7 days
- **Location Filtering**: Sync endpoints automatically filter data by user's location hierarchy

## Production Deployment

For production deployment:

1. Update `.env` with production values
2. Change `NODE_ENV=production`
3. Use strong `JWT_SECRET`
4. Set proper `CORS_ORIGIN`
5. Implement real database (MySQL recommended)
6. Add rate limiting
7. Enable HTTPS
8. Set up logging service
9. Implement email service for password reset

## License

MIT

## Support

For issues or questions, contact the development team.
