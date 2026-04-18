import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllGrades, getGradeById, createGrade, updateGrade, deleteGrade } from '../controllers/gradesController.js';

const router = express.Router();

router.use(protect);
router.get('/', getAllGrades);
router.get('/:id', getGradeById);
router.post('/', createGrade);
router.put('/:id', updateGrade);
router.delete('/:id', deleteGrade);

export default router;
