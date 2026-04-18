import express from 'express';
import * as reportsController from '../controllers/reportsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/purchases', reportsController.generatePurchasesReport);
router.get('/rebales', reportsController.generateRebalesReport);
router.get('/transports', reportsController.generateTransportsReport);
router.get('/farmers', reportsController.generateFarmersReport);
router.get('/loans', reportsController.generateLoansReport);
router.get('/dashboard', reportsController.generateDashboardStats);

export default router;
