'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('farmer_loans', [
      { 
        id: '1',
        farmerId: 3,
        officerId:1,
        loanId: 1,
        quantity: 5.00,
        totalAmount: 6050000.00,
        remainingDebt: 6000000.00,
        issuedDate: '2024-01-10',
        status: 'active',
        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: null,
        createdAt: new Date('2024-01-10 00:00:00'),
        updatedAt: new Date('2024-01-10 00:00:00')
      },
      { 
        id: '2',
        farmerId: 5,
        officerId:1,
        loanId: 2,
        quantity: 3.00,
        totalAmount: 4075000.00,
        remainingDebt: 4050000.00,
        issuedDate: '2024-01-15',
        status: 'active',
        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: null,
        createdAt: new Date('2024-01-15 00:00:00'),
        updatedAt: new Date('2024-01-15 00:00:00')
      },
      { 
        id: '3',
        farmerId: 1,
        officerId:1,
        loanId: 1,
        quantity: 4.00,
        totalAmount: 200000.00,
        remainingDebt: 200000.00,
        issuedDate: '2023-12-01',
        status: 'active',
        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: null,
        createdAt: new Date('2023-12-01 00:00:00'),
        updatedAt: new Date('2024-01-05 00:00:00')
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('farmer_loans', null, {});
  }
};