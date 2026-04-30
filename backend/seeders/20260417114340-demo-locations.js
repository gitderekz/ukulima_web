'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('locations', [
      { id: 1, name: 'Tanzania', code: 'TZ', type: 'country', parentId: null, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 2, name: 'Northern Zone', code: 'NZ-001', type: 'zone', parentId: 1, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 3, name: 'Southern Zone', code: 'SZ-001', type: 'zone', parentId: 1, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 4, name: 'Arusha CPP', code: 'CPP-001', type: 'cpp', parentId: 2, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 5, name: 'Kilimanjaro CPP', code: 'CPP-002', type: 'cpp', parentId: 2, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 6, name: 'Mbeya CPP', code: 'CPP-003', type: 'cpp', parentId: 3, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 7, name: 'Arusha Region', code: 'RG-001', type: 'region', parentId: 4, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 8, name: 'Moshi Region', code: 'RG-002', type: 'region', parentId: 5, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 9, name: 'Mbeya Region', code: 'RG-003', type: 'region', parentId: 6, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 10, name: 'Arusha Urban', code: 'DT-001', type: 'district', parentId: 7, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 11, name: 'Meru', code: 'DT-002', type: 'district', parentId: 7, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 12, name: 'Moshi Urban', code: 'DT-003', type: 'district', parentId: 8, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 13, name: 'Kaloleni Ward', code: 'WD-001', type: 'ward', parentId: 10, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 14, name: 'Themi Ward', code: 'WD-002', type: 'ward', parentId: 10, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 15, name: 'Majengo Ward', code: 'WD-003', type: 'ward', parentId: 12, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 16, name: 'Sokoine Street', code: 'ST-001', type: 'street', parentId: 13, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 17, name: 'Makongoro Street', code: 'ST-002', type: 'street', parentId: 13, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },
      { id: 18, name: 'Kilimanjaro Street', code: 'ST-003', type: 'street', parentId: 15, createdAt: new Date('2024-01-01 00:00:00'), updatedAt: new Date('2024-01-01 00:00:00') },

      { id: 19, name: 'Extension North', code: 'EXT019', type: 'extension', parentId: null, createdAt: new Date('2026-04-22 08:32:23'), updatedAt: new Date('2026-04-22 08:32:23') },
      { id: 20, name: 'Extension South', code: 'EXT020', type: 'extension', parentId: null, createdAt: new Date('2026-04-22 08:32:23'), updatedAt: new Date('2026-04-22 08:32:23') },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('locations', null, {});
  }
};