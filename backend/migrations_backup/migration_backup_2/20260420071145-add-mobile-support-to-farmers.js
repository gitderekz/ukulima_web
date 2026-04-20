// backend/migrations/XXXXX-add-mobile-support-to-farmers.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('farmers', 'mobileId', {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true
    });
    
    await queryInterface.addColumn('farmers', 'originalDeviceId', {
      type: Sequelize.STRING(20),
      allowNull: true
    });
    
    await queryInterface.addColumn('farmers', 'syncSource', {
      type: Sequelize.ENUM('web', 'mobile'),
      defaultValue: 'web'
    });
    
    await queryInterface.addColumn('farmers', 'syncedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addIndex('farmers', ['mobileId']);
    await queryInterface.addIndex('farmers', ['syncSource']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('farmers', 'mobileId');
    await queryInterface.removeColumn('farmers', 'originalDeviceId');
    await queryInterface.removeColumn('farmers', 'syncSource');
    await queryInterface.removeColumn('farmers', 'syncedAt');
  }
};