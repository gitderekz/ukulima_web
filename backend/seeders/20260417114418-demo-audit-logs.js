'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('audit_logs', [
      { id: 1, userId: 2, action: 'CREATE_PURCHASE', entityType: 'purchase', entityId: '1', details: 'Created purchase RCP-2026-0001 for farmer FRM-002', ipAddress: '192.168.1.100', createdAt: new Date('2026-04-10T10:30:00') },
      { id: 2, userId: 2, action: 'CREATE_REBALE', entityType: 'rebale', entityId: '1', details: 'Created rebale RB-2026-0001', ipAddress: '192.168.1.100', createdAt: new Date('2026-04-11T14:15:00') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('audit_logs', null, {});
  }
};