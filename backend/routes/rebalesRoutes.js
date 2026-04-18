import express from 'express';
import * as rebalesController from '../controllers/rebalesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', rebalesController.getAllRebales);
router.get('/stats', rebalesController.getRebaleStats);
router.get('/:id', rebalesController.getRebaleById);
router.post('/', rebalesController.createRebale);
router.post('/batch', rebalesController.createBatchRebales);
router.patch('/:id/status', rebalesController.updateRebaleStatus);
router.delete('/:id', rebalesController.deleteRebale);

export default router;
