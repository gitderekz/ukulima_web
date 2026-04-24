// import express from 'express';
// import { downloadData, uploadData } from '../controllers/syncController.js';
// import { protect } from '../middleware/auth.js';

// const router = express.Router();

// // All sync routes require authentication
// router.use(protect);

// router.post('/download', downloadData);
// router.post('/upload', uploadData);

// export default router;
// backend/routes/syncRoutes.js
import express from 'express';
import { 
  downloadData, 
  uploadData, 
  getSyncStatus, 
  downloadPartial 
} from '../controllers/syncController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All sync routes require authentication
router.use(protect);

router.post('/download', downloadData);
router.post('/download-partial', downloadPartial);
router.post('/upload', uploadData);
router.get('/status', getSyncStatus);

export default router;