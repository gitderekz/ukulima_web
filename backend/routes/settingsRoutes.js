// backend/routes/settingsRoutes.js
import express from 'express';
import {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings,
  getSettingByKey,
} from '../controllers/settingsController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/settings - Get all settings
router.get('/', getSettings);

// GET /api/settings/:key - Get specific setting by key
router.get('/:key', getSettingByKey);

// POST /api/settings - Create settings
router.post('/', restrictTo('admin', 'IT', 'developer'), createSettings);

// PUT /api/settings - Update settings
router.put('/', restrictTo('admin', 'IT', 'developer'), updateSettings);

// DELETE /api/settings - Reset settings to defaults
router.delete('/', restrictTo('admin', 'IT', 'developer'), deleteSettings);

export default router;