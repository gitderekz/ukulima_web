'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('crop_grade_prices', [
      { id: 1, cropId: 1, gradeId: 1, price: 8500, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 2, cropId: 1, gradeId: 2, price: 7200, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 3, cropId: 1, gradeId: 3, price: 6000, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 4, cropId: 2, gradeId: 1, price: 1200, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 5, cropId: 2, gradeId: 2, price: 980, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 6, cropId: 2, gradeId: 3, price: 750, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 7, cropId: 3, gradeId: 1, price: 2500, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 8, cropId: 3, gradeId: 2, price: 2100, effectiveDate: '2024-01-01', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('crop_grade_prices', null, {});
  }
};