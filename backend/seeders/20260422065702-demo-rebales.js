
// --->backend/seeders/XXXXXXXXXXXXXX-demo-rebales.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rebales', [
      { 
        id: '1', 
        rebaleTag: 'REB-2024-001', 
        receiptNumber: 'REB-RCPT-001', 
        cropId: 1, 
        gradeId: 1, 
        totalMass: 100.50, 
        price: 2100, 
        totalAmount: 211050, 
        warehouseId: 1, 
        buyerId: 2, 
        sourceBaleIds: JSON.stringify(['1', '2']), 
        rebaleDate: '2024-01-25', 
        status: 'stored',
        syncSource: 'web',
        createdAt: new Date('2024-01-25'), 
        updatedAt: new Date('2024-01-25') 
      },
      { 
        id: '2', 
        rebaleTag: 'REB-2024-002', 
        receiptNumber: 'REB-RCPT-002', 
        cropId: 2, 
        gradeId: 1, 
        totalMass: 120.00, 
        price: 2100, 
        totalAmount: 252000, 
        warehouseId: 1, 
        buyerId: 2, 
        sourceBaleIds: JSON.stringify(['4', '5']), 
        rebaleDate: '2024-01-26', 
        status: 'transported',
        syncSource: 'web',
        createdAt: new Date('2024-01-26'), 
        updatedAt: new Date('2024-01-27') 
      },
      { 
        id: '3', 
        rebaleTag: 'REB-2024-003', 
        receiptNumber: 'REB-RCPT-003', 
        cropId: 1, 
        gradeId: 3, 
        totalMass: 95.00, 
        price: 1600, 
        totalAmount: 152000, 
        warehouseId: 2, 
        buyerId: 2, 
        sourceBaleIds: JSON.stringify(['6']), 
        rebaleDate: '2024-01-27', 
        status: 'stored',
        syncSource: 'web',
        createdAt: new Date('2024-01-27'), 
        updatedAt: new Date('2024-01-27') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rebales', null, {});
  }
};
