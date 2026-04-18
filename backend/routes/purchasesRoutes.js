import express from 'express';
import * as purchasesController from '../controllers/purchasesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', purchasesController.getAllPurchases);
router.get('/stats', purchasesController.getPurchaseStats);
router.get('/:id', purchasesController.getPurchaseById);
router.post('/', purchasesController.createPurchase);
router.delete('/:id', purchasesController.deletePurchase);

export default router;
