
// --->backend/seeders/XXXXXXXXXXXXXX-demo-loan-deductions.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('loan_deductions', [
      { 
        id: '1', 
        purchaseId: '2', 
        farmerLoanId: '1', 
        deductedAmount: 50000, 
        deductionDate: '2024-01-21',
        syncSource: 'web',
        createdAt: new Date('2024-01-21'), 
        updatedAt: new Date('2024-01-21') 
      },
      { 
        id: '2', 
        purchaseId: '4', 
        farmerLoanId: '2', 
        deductedAmount: 25000, 
        deductionDate: '2024-01-23',
        syncSource: 'web',
        createdAt: new Date('2024-01-23'), 
        updatedAt: new Date('2024-01-23') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loan_deductions', null, {});
  }
};