import { db } from '.././models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllGrades = async (req, res) => {
  try {
    const grades = await db.Grade.findAll({
      order: [['name', 'ASC']],
    });
    
    res.json({
      success: true,
      data: grades,
      total: grades.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
      error: error.message,
    });
  }
};

export const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await db.Grade.findByPk(id);
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found',
      });
    }
    
    res.json({
      success: true,
      data: grade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grade',
      error: error.message,
    });
  }
};

export const createGrade = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required',
      });
    }
    
    // Check if code already exists
    const existingGrade = await db.Grade.findOne({ where: { code } });
    if (existingGrade) {
      return res.status(400).json({
        success: false,
        message: 'Grade with this code already exists',
      });
    }
    
    const newGrade = await db.Grade.create({
      id: uuidv4(),
      name,
      code,
      description: description || null,
    });
    
    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      data: newGrade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create grade',
      error: error.message,
    });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    
    const grade = await db.Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found',
      });
    }
    
    // Check if code is being changed and already exists
    if (code && code !== grade.code) {
      const existingGrade = await db.Grade.findOne({ where: { code } });
      if (existingGrade) {
        return res.status(400).json({
          success: false,
          message: 'Another grade with this code already exists',
        });
      }
    }
    
    await grade.update({
      name: name || grade.name,
      code: code || grade.code,
      description: description !== undefined ? description : grade.description,
    });
    
    res.json({
      success: true,
      message: 'Grade updated successfully',
      data: grade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update grade',
      error: error.message,
    });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    
    const grade = await db.Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found',
      });
    }
    
    await grade.destroy();
    
    res.json({
      success: true,
      message: 'Grade deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete grade',
      error: error.message,
    });
  }
};
