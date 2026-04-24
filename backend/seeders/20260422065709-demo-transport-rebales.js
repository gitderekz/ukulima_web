
// --->backend/seeders/XXXXXXXXXXXXXX-demo-transport-rebales.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transport_rebales', [
      { 
        id: '1', 
        transportId: '1', 
        rebaleId: '2', 
        loadedAt: new Date('2024-01-27 08:30:00'),
        syncSource: 'web',
        createdAt: new Date('2024-01-27'), 
        updatedAt: new Date('2024-01-27') 
      },
      { 
        id: '2', 
        transportId: '2', 
        rebaleId: '1', 
        loadedAt: new Date('2024-01-29 09:15:00'),
        syncSource: 'web',
        createdAt: new Date('2024-01-29'), 
        updatedAt: new Date('2024-01-29') 
      },
      { 
        id: '3', 
        transportId: '2', 
        rebaleId: '3', 
        loadedAt: new Date('2024-01-29 09:30:00'),
        syncSource: 'web',
        createdAt: new Date('2024-01-29'), 
        updatedAt: new Date('2024-01-29') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transport_rebales', null, {});
  }
};
