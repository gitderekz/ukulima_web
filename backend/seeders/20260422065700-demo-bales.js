
// --->backend/seeders/XXXXXXXXXXXXXX-demo-bales.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('bales', [
      { 
        id: '1', 
        baleTag: 'BALE-2024-001', 
        purchaseId: '1', 
        cropId: 1, 
        gradeId: 1, 
        mass: 50.50, 
        price: 2000, 
        totalAmount: 101000, 
        warehouseId: 1, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-20'), 
        updatedAt: new Date('2024-01-20') 
      },
      { 
        id: '2', 
        baleTag: 'BALE-2024-002', 
        purchaseId: '1', 
        cropId: 1, 
        gradeId: 1, 
        mass: 50.00, 
        price: 2000, 
        totalAmount: 100000, 
        warehouseId: 1, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-20'), 
        updatedAt: new Date('2024-01-20') 
      },
      { 
        id: '3', 
        baleTag: 'BALE-2024-003', 
        purchaseId: '1', 
        cropId: 1, 
        gradeId: 2, 
        mass: 50.00, 
        price: 1800, 
        totalAmount: 90000, 
        warehouseId: 1, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-20'), 
        updatedAt: new Date('2024-01-20') 
      },
      { 
        id: '4', 
        baleTag: 'BALE-2024-004', 
        purchaseId: '2', 
        cropId: 2, 
        gradeId: 1, 
        mass: 60.00, 
        price: 2000, 
        totalAmount: 120000, 
        warehouseId: 1, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-21'), 
        updatedAt: new Date('2024-01-21') 
      },
      { 
        id: '5', 
        baleTag: 'BALE-2024-005', 
        purchaseId: '2', 
        cropId: 2, 
        gradeId: 1, 
        mass: 60.00, 
        price: 2000, 
        totalAmount: 120000, 
        warehouseId: 1, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-21'), 
        updatedAt: new Date('2024-01-21') 
      },
      { 
        id: '6', 
        baleTag: 'BALE-2024-006', 
        purchaseId: '3', 
        cropId: 1, 
        gradeId: 3, 
        mass: 45.00, 
        price: 1500, 
        totalAmount: 67500, 
        warehouseId: 2, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-22'), 
        updatedAt: new Date('2024-01-22') 
      },
      { 
        id: '7', 
        baleTag: 'BALE-2024-007', 
        purchaseId: '4', 
        cropId: 3, 
        gradeId: 2, 
        mass: 55.00, 
        price: 2000, 
        totalAmount: 110000, 
        warehouseId: 1, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-23'), 
        updatedAt: new Date('2024-01-23') 
      },
      { 
        id: '8', 
        baleTag: 'BALE-2024-008', 
        purchaseId: '5', 
        cropId: 1, 
        gradeId: 1, 
        mass: 50.00, 
        price: 2000, 
        totalAmount: 100000, 
        warehouseId: 3, 
        status: 'purchased',
        syncSource: 'web',
        createdAt: new Date('2024-01-24'), 
        updatedAt: new Date('2024-01-24') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bales', null, {});
  }
};
