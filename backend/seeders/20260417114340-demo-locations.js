'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('locations', [
      { id: 1, name: 'Tanzania', code: 'TZ', type: 'country', parentId: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 2, name: 'Northern Region', code: 'NR', type: 'region', parentId: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 3, name: 'Central Region', code: 'CR', type: 'region', parentId: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 4, name: 'Southern Region', code: 'SR', type: 'region', parentId: 1, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 5, name: 'Kilimanjaro Zone', code: 'KZ', type: 'zone', parentId: 2, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 6, name: 'Arusha Zone', code: 'AZ', type: 'zone', parentId: 2, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 7, name: 'Dodoma Zone', code: 'DZ', type: 'zone', parentId: 3, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 8, name: 'Mbeya Zone', code: 'MZ', type: 'zone', parentId: 4, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 9, name: 'Arusha District', code: 'AD', type: 'district', parentId: 6, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 10, name: 'Meru District', code: 'MD', type: 'district', parentId: 6, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 11, name: 'Moshi District', code: 'MSD', type: 'district', parentId: 5, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 12, name: 'Kaloleni Ward', code: 'WD-001', type: 'ward', parentId: 9, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 13, name: 'Themi Ward', code: 'WD-002', type: 'ward', parentId: 9, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 14, name: 'Majengo Ward', code: 'WD-003', type: 'ward', parentId: 11, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 15, name: 'Sokoine Street', code: 'ST-001', type: 'street', parentId: 12, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 16, name: 'Makongoro Street', code: 'ST-002', type: 'street', parentId: 12, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 17, name: 'Kilimanjaro Street', code: 'ST-003', type: 'street', parentId: 14, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      
      { id: 18, name: 'A Extension', code: 'EXT-001', type: 'extension', parentId: 14, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 19, name: 'B Extension', code: 'EXT-002', type: 'extension', parentId: 14, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 20, name: 'C Extension', code: 'EXT-003', type: 'extension', parentId: 14, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('locations', null, {});
  }
};