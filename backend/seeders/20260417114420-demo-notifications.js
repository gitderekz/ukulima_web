'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      { id: 1, userId: 2, title: 'New Farmer Registered', message: 'Farmer Peter Kamau (FRM-005) has been registered in your zone.', type: 'info', isRead: false, createdAt: new Date('2026-04-13T08:00:00') },
      { id: 2, userId: 5, title: 'Warehouse Capacity Alert', message: 'Arusha Central Warehouse is at 25% capacity.', type: 'warning', isRead: false, createdAt: new Date('2026-04-13T09:30:00') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};