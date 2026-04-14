import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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

app.use((req, res) => {
  console.log('❌ 404 HIT:', req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
app.listen(PORT, /*HOST,*/ '0.0.0.0', () => {
  console.log('===========================================');
  console.log('🚀 Ukulima ERP Backend Server Started');
  console.log('===========================================');
  console.log(`📍 Server: http://${HOST}:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log('===========================================');
  console.log('📚 Available Routes:');
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   POST /api/auth/signup - User registration`);
  console.log(`   POST /api/auth/forgot-password - Request password reset`);
  console.log(`   POST /api/auth/reset-password - Reset password`);
  console.log(`   GET  /api/auth/me - Get current user (Protected)`);
  console.log(`   POST /api/sync/download - Download data (Protected)`);
  console.log(`   POST /api/sync/upload - Upload data (Protected)`);
  console.log('===========================================');
});

export default app;
