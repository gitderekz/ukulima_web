
// --->backend/seeders/XXXXXXXXXXXXXX-demo-purchases.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('purchases', [
      { 
        id: '1', 
        receiptNumber: 'PUR-2024-001', 
        farmerId: '1', 
        buyerId: 2, 
        clerkId: 3, 
        warehouseId: 1, 
        totalMass: 250.50, 
        totalAmount: 500000, 
        loanDeducted: 0, 
        amountPaid: 500000, 
        purchaseDate: '2024-01-20',
        syncSource: 'web',
        createdAt: new Date('2024-01-20'), 
        updatedAt: new Date('2024-01-20') 
      },
      { 
        id: '2', 
        receiptNumber: 'PUR-2024-002', 
        farmerId: '3', 
        buyerId: 2, 
        clerkId: 3, 
        warehouseId: 1, 
        totalMass: 300.00, 
        totalAmount: 600000, 
        loanDeducted: 50000, 
        amountPaid: 550000, 
        purchaseDate: '2024-01-21',
        syncSource: 'web',
        createdAt: new Date('2024-01-21'), 
        updatedAt: new Date('2024-01-21') 
      },
      { 
        id: '3', 
        receiptNumber: 'PUR-2024-003', 
        farmerId: '4', 
        buyerId: 2, 
        clerkId: 4, 
        warehouseId: 2, 
        totalMass: 180.75, 
        totalAmount: 360000, 
        loanDeducted: 0, 
        amountPaid: 360000, 
        purchaseDate: '2024-01-22',
        syncSource: 'web',
        createdAt: new Date('2024-01-22'), 
        updatedAt: new Date('2024-01-22') 
      },
      { 
        id: '4', 
        receiptNumber: 'PUR-2024-004', 
        farmerId: '5', 
        buyerId: 2, 
        clerkId: 3, 
        warehouseId: 1, 
        totalMass: 220.25, 
        totalAmount: 440000, 
        loanDeducted: 25000, 
        amountPaid: 415000, 
        purchaseDate: '2024-01-23',
        syncSource: 'web',
        createdAt: new Date('2024-01-23'), 
        updatedAt: new Date('2024-01-23') 
      },
      { 
        id: '5', 
        receiptNumber: 'PUR-2024-005', 
        farmerId: '2', 
        buyerId: 2, 
        clerkId: 4, 
        warehouseId: 3, 
        totalMass: 350.00, 
        totalAmount: 700000, 
        loanDeducted: 0, 
        amountPaid: 700000, 
        purchaseDate: '2024-01-24',
        syncSource: 'web',
        createdAt: new Date('2024-01-24'), 
        updatedAt: new Date('2024-01-24') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('purchases', null, {});
  }
};
