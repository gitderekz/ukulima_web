'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rebale_bales', [
      { id: 1, rebaleId: 1, baleId: 1, createdAt: new Date('2026-04-11'), updatedAt: new Date('2026-04-11') },
      { id: 2, rebaleId: 1, baleId: 2, createdAt: new Date('2026-04-11'), updatedAt: new Date('2026-04-11') },
      { id: 3, rebaleId: 2, baleId: 3, createdAt: new Date('2026-04-11'), updatedAt: new Date('2026-04-11') },
      { id: 4, rebaleId: 2, baleId: 4, createdAt: new Date('2026-04-11'), updatedAt: new Date('2026-04-11') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rebale_bales', null, {});
  }
};