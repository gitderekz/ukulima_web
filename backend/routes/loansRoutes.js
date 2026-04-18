import express from 'express';
import * as loansController from '../controllers/loansController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', loansController.getAllLoans);
router.get('/:id', loansController.getLoanById);
router.get('/farmer/:farmerId', loansController.getFarmerLoans);
router.post('/', loansController.createLoan);
router.post('/assign', loansController.assignLoanToFarmer);
router.post('/deduct', loansController.deductFromLoan);
router.put('/:id', loansController.updateLoan);
router.delete('/:id', loansController.deleteLoan);

export default router;
