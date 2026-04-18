import express from 'express';
import * as usersController from '../controllers/usersController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.get('/role/:role', usersController.getUsersByRole);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router;
