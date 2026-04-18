import express from 'express';
import * as pricesController from '../controllers/pricesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', pricesController.getAllPrices);
router.get('/:id', pricesController.getPriceById);
router.get('/current/:cropId/:gradeId', pricesController.getCurrentPrice);
router.post('/', pricesController.createPrice);
router.put('/:id', pricesController.updatePrice);
router.delete('/:id', pricesController.deletePrice);

export default router;
