import bcrypt from 'bcryptjs';
import { db } from '.././models/index.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }    

    // Find user by email using Sequelize
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // Convert to plain object and remove password
    const userObj = user.get({ plain: true });
    delete userObj.password;

    res.status(200).json({
      success: true,
      data: {
        token,
        user: userObj,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public (can be restricted to admin later)
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, code, locationId, warehouseId } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      code,
      locationId,
      warehouseId,
      isActive: true,
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // Convert to plain object and remove password
    const userObj = user.get({ plain: true });
    delete userObj.password;

    res.status(201).json({
      success: true,
      token,
      user: userObj,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address',
      });
    }

    // Find user
    const user = await db.users.findByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    // In a real app, you would:
    // 1. Generate reset token
    // 2. Save token to database with expiry
    // 3. Send email with reset link

    // For now, just simulate success
    const resetToken = Math.random().toString(36).substring(2, 15);

    // Create audit log
    await db.auditLogs.create({
      userId: user.id,
      action: 'FORGOT_PASSWORD',
      entityType: 'user',
      entityId: user.id,
      details: `Password reset requested for ${user.email}`,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
      // In development, return the token (remove in production)
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Find user
    const user = await db.users.findByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token',
      });
    }

    // In a real app, you would verify the reset token from database
    // For now, just allow password reset

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db.users.update(user.id, { password: hashedPassword });

    // Create audit log
    await db.auditLogs.create({
      userId: user.id,
      action: 'RESET_PASSWORD',
      entityType: 'user',
      entityId: user.id,
      details: `Password reset for ${user.email}`,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export default {
  login,
  signup,
  forgotPassword,
  resetPassword,
  getMe,
};
