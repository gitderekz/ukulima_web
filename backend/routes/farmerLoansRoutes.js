import express from 'express';
import * as farmerLoansController from '../controllers/farmerLoansController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', farmerLoansController.getAllFarmerLoans);
router.get('/:id', farmerLoansController.getFarmerLoanById);
router.post('/', farmerLoansController.createFarmerLoan);
router.put('/:id', farmerLoansController.updateFarmerLoan);
router.delete('/:id', farmerLoansController.deleteFarmerLoan);

export default router;