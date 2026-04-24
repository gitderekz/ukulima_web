
// --->backend/seeders/XXXXXXXXXXXXXX-demo-rebale-bales.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rebale_bales', [
      { 
        id: '1', 
        rebaleId: '1', 
        baleId: '1', 
        syncSource: 'web',
        createdAt: new Date('2024-01-25'), 
        updatedAt: new Date('2024-01-25') 
      },
      { 
        id: '2', 
        rebaleId: '1', 
        baleId: '2', 
        syncSource: 'web',
        createdAt: new Date('2024-01-25'), 
        updatedAt: new Date('2024-01-25') 
      },
      { 
        id: '3', 
        rebaleId: '2', 
        baleId: '4', 
        syncSource: 'web',
        createdAt: new Date('2024-01-26'), 
        updatedAt: new Date('2024-01-26') 
      },
      { 
        id: '4', 
        rebaleId: '2', 
        baleId: '5', 
        syncSource: 'web',
        createdAt: new Date('2024-01-26'), 
        updatedAt: new Date('2024-01-26') 
      },
      { 
        id: '5', 
        rebaleId: '3', 
        baleId: '6', 
        syncSource: 'web',
        createdAt: new Date('2024-01-27'), 
        updatedAt: new Date('2024-01-27') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rebale_bales', null, {});
  }
};
