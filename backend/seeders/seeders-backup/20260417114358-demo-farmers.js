'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('farmers', [
      { id: 1, firstName: 'Joseph', lastName: 'Mwenda', code: 'FRM-001', phone: '+255711111001', locationId: 12, totalDebt: 0, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-13') },
      { id: 2, firstName: 'Grace', lastName: 'Njau', code: 'FRM-002', phone: '+255711111002', locationId: 12, totalDebt: 250.00, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-10') },
      { id: 3, firstName: 'Daniel', lastName: 'Kisanga', code: 'FRM-003', phone: '+255711111003', locationId: 13, totalDebt: 180.00, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-08') },
      { id: 4, firstName: 'Elizabeth', lastName: 'Mollel', code: 'FRM-004', phone: '+255711111004', locationId: 14, totalDebt: 90.00, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-05') },
      { id: 5, firstName: 'Peter', lastName: 'Kamau', code: 'FRM-005', phone: '+255711111005', locationId: 15, totalDebt: 450.00, createdAt: new Date('2024-01-05'), updatedAt: new Date('2026-04-12') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('farmers', null, {});
  }
};