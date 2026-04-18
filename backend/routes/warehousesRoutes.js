import express from 'express';
import * as warehousesController from '../controllers/warehousesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', warehousesController.getAllWarehouses);
router.get('/:id', warehousesController.getWarehouseById);
router.get('/location/:locationId', warehousesController.getWarehousesByLocation);
router.post('/', warehousesController.createWarehouse);
router.put('/:id', warehousesController.updateWarehouse);
router.delete('/:id', warehousesController.deleteWarehouse);

export default router;
