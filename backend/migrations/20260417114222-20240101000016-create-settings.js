'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deductionPercentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30
      },
      primaryColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#22c55e'
      },
      secondaryColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#3b82f6'
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'en'
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'TZS'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('settings');
  }
};