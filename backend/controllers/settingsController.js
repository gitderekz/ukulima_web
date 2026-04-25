// backend/controllers/settingsController.js
import { db } from '.././models/index.js';

// @desc    Get all settings (or the single settings record)
// @route   GET /api/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    // Settings table should have only one record (singleton pattern)
    const settings = await db.Setting.findOne({
      order: [['updatedAt', 'DESC']],
    });

    if (!settings) {
      // Return default settings if none exist
      return res.status(200).json({
        success: true,
        data: {
          id: null,
          deductionPercentage: 30,
          primaryColor: '#22c55e',
          secondaryColor: '#3b82f6',
          language: 'en',
          currency: 'TZS',
          updatedAt: null,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
    });
  }
};

// @desc    Create settings (or update if already exists)
// @route   POST /api/settings
// @access  Private/Admin
export const createSettings = async (req, res) => {
  try {
    const { 
      deductionPercentage, 
      primaryColor, 
      secondaryColor, 
      language, 
      currency 
    } = req.body;

    // Check if settings already exist
    const existingSettings = await db.Setting.findOne();

    if (existingSettings) {
      // Update existing
      await existingSettings.update({
        deductionPercentage: deductionPercentage !== undefined ? deductionPercentage : existingSettings.deductionPercentage,
        primaryColor: primaryColor || existingSettings.primaryColor,
        secondaryColor: secondaryColor || existingSettings.secondaryColor,
        language: language || existingSettings.language,
        currency: currency || existingSettings.currency,
      });

      return res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: existingSettings,
      });
    }

    // Create new
    const newSettings = await db.Setting.create({
      deductionPercentage: deductionPercentage || 30,
      primaryColor: primaryColor || '#22c55e',
      secondaryColor: secondaryColor || '#3b82f6',
      language: language || 'en',
      currency: currency || 'TZS',
    });

    res.status(201).json({
      success: true,
      message: 'Settings created successfully',
      data: newSettings,
    });
  } catch (error) {
    console.error('Create/Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save settings',
      error: error.message,
    });
  }
};

// @desc    Update settings (use PUT for idempotent updates)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const { 
      deductionPercentage, 
      primaryColor, 
      secondaryColor, 
      language, 
      currency 
    } = req.body;

    // Find or create settings
    let settings = await db.Setting.findOne();

    if (!settings) {
      // Create if not exists
      settings = await db.Setting.create({
        deductionPercentage: deductionPercentage || 30,
        primaryColor: primaryColor || '#22c55e',
        secondaryColor: secondaryColor || '#3b82f6',
        language: language || 'en',
        currency: currency || 'TZS',
      });

      return res.status(201).json({
        success: true,
        message: 'Settings created successfully',
        data: settings,
      });
    }

    // Update fields if provided
    const updates = {};
    if (deductionPercentage !== undefined) updates.deductionPercentage = deductionPercentage;
    if (primaryColor !== undefined) updates.primaryColor = primaryColor;
    if (secondaryColor !== undefined) updates.secondaryColor = secondaryColor;
    if (language !== undefined) updates.language = language;
    if (currency !== undefined) updates.currency = currency;
    updates.updatedAt = new Date();

    await settings.update(updates);

    // Fetch updated settings
    const updatedSettings = await db.Setting.findOne();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    });
  }
};

// @desc    Delete settings (reset to defaults)
// @route   DELETE /api/settings
// @access  Private/Admin
export const deleteSettings = async (req, res) => {
  try {
    const settings = await db.Setting.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No settings found to delete',
      });
    }

    // Instead of deleting, reset to defaults
    await settings.update({
      deductionPercentage: 30,
      primaryColor: '#22c55e',
      secondaryColor: '#3b82f6',
      language: 'en',
      currency: 'TZS',
    });

    res.status(200).json({
      success: true,
      message: 'Settings reset to defaults successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      error: error.message,
    });
  }
};

// @desc    Get specific setting by key
// @route   GET /api/settings/:key
// @access  Private
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const settings = await db.Setting.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found',
      });
    }

    const allowedKeys = ['deductionPercentage', 'primaryColor', 'secondaryColor', 'language', 'currency'];
    
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({
        success: false,
        message: `Invalid setting key. Allowed keys: ${allowedKeys.join(', ')}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        key,
        value: settings[key],
      },
    });
  } catch (error) {
    console.error('Get setting by key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch setting',
      error: error.message,
    });
  }
};

export default {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings,
  getSettingByKey,
};