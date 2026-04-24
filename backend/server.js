import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import database and models
import { db } from './models/index.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import farmersRoutes from './routes/farmersRoutes.js';
import cropsRoutes from './routes/cropsRoutes.js';
import gradesRoutes from './routes/gradesRoutes.js';
import locationsRoutes from './routes/locationsRoutes.js';
import warehousesRoutes from './routes/warehousesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import loansRoutes from './routes/loansRoutes.js';
import pricesRoutes from './routes/pricesRoutes.js';
import purchasesRoutes from './routes/purchasesRoutes.js';
import rebalesRoutes from './routes/rebalesRoutes.js';
import transportsRoutes from './routes/transportsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import balesRoutes from './routes/balesRoutes.js';
import farmerLoansRoutes from './routes/farmerLoansRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(helmet()); // Security headers
// ✅ Safe way to read from .env
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

  app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON with increased limit for sync
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ukulima ERP API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/farmers', farmersRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/warehouses', warehousesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/rebales', rebalesRoutes);
app.use('/api/transports', transportsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/bales', balesRoutes);
app.use('/api/farmer-loans', farmerLoansRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Initialize database
async function initializeDatabase() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅Database connection has been established successfully.');

    // // Sync database (in development only)
    // if (process.env.NODE_ENV === 'development') {
    //   await db.sequelize.sync();
    //   console.log('✅ Database synchronized successfully.');
    // }

    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
}

// Initialize database and start server
initializeDatabase();

export default app;