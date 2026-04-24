
// --->backend/seeders/XXXXXXXXXXXXXX-demo-farmer-loans.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('farmer_loans', [
      { 
        id: '1', 
        farmerId: '3', 
        loanId: 1, 
        quantity: 5, 
        totalAmount: 250000, 
        remainingDebt: 150000, 
        issuedDate: '2024-01-10', 
        status: 'active',
        syncSource: 'web',
        createdAt: new Date('2024-01-10'), 
        updatedAt: new Date('2024-01-10') 
      },
      { 
        id: '2', 
        farmerId: '5', 
        loanId: 2, 
        quantity: 3, 
        totalAmount: 120000, 
        remainingDebt: 75000, 
        issuedDate: '2024-01-15', 
        status: 'active',
        syncSource: 'web',
        createdAt: new Date('2024-01-15'), 
        updatedAt: new Date('2024-01-15') 
      },
      { 
        id: '3', 
        farmerId: '1', 
        loanId: 1, 
        quantity: 4, 
        totalAmount: 200000, 
        remainingDebt: 0, 
        issuedDate: '2023-12-01', 
        status: 'completed',
        syncSource: 'web',
        createdAt: new Date('2023-12-01'), 
        updatedAt: new Date('2024-01-05') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('farmer_loans', null, {});
  }
};
