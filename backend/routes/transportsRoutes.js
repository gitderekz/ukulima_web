import express from 'express';
import * as transportsController from '../controllers/transportsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', transportsController.getAllTransports);
router.get('/stats', transportsController.getTransportStats);
router.get('/:id', transportsController.getTransportById);
router.post('/', transportsController.createTransport);
router.put('/:id', transportsController.updateTransport);
router.delete('/:id', transportsController.deleteTransport);

export default router;
