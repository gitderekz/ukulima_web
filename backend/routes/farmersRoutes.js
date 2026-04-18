import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  searchFarmers,
} from '../controllers/farmersController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/farmers - Get all farmers (with optional location filter)
router.get('/', getAllFarmers);

// GET /api/farmers/search?q=query&locationId=xxx - Search farmers
router.get('/search', searchFarmers);

// GET /api/farmers/:id - Get farmer by ID
router.get('/:id', getFarmerById);

// POST /api/farmers - Create new farmer
router.post('/', createFarmer);

// PUT /api/farmers/:id - Update farmer
router.put('/:id', updateFarmer);

// DELETE /api/farmers/:id - Delete farmer
router.delete('/:id', deleteFarmer);

export default router;
