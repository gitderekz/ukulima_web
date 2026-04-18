import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from '../controllers/cropsController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllCrops);
router.get('/:id', getCropById);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

export default router;
