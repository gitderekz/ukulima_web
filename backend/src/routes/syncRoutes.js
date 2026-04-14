import express from 'express';
import { downloadData, uploadData } from '../controllers/syncController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All sync routes require authentication
router.use(protect);

router.post('/download', downloadData);
router.post('/upload', uploadData);

export default router;
