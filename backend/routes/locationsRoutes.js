import express from 'express';
import * as locationsController from '../controllers/locationsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', locationsController.getAllLocations);
router.get('/:id', locationsController.getLocationById);
// router.get('/:id/path', locationsController.getLocationPath);
router.get('/:id/path', locationsController.getFullLocationPath);
router.get('/type/:type', locationsController.getLocationsByType);
router.get('/children/:parentId', locationsController.getChildLocations);
router.post('/', locationsController.createLocation);
router.put('/:id', locationsController.updateLocation);
router.delete('/:id', locationsController.deleteLocation);

export default router;
