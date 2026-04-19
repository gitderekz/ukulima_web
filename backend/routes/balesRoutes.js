import express from 'express';
import * as balesController from '../controllers/balesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', balesController.getAllBales);
router.get('/available', balesController.getAvailableBales);
router.get('/:id', balesController.getBaleById);
router.post('/', balesController.createBale);
router.put('/:id', balesController.updateBale);
router.delete('/:id', balesController.deleteBale);

export default router;