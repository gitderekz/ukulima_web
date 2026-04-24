// ---> backend/seeders/XXXXXXXXXXXXXX-demo-farmers.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('farmers', [
      { 
        id: '1',
        firstName: 'John',
        lastName: 'Makonde',
        code: 'F001',
        phone: '+255712345678',

        locationId: 16,
        cppId: 4,
        extensionId: 19,

        totalDebt: 0,

        // Mobile sync tracking
        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: new Date(),

        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },

      { 
        id: '2',
        firstName: 'Maria',
        lastName: 'Mushi',
        code: 'F002',
        phone: '+255723456789',

        locationId: 16,
        cppId: 4,
        extensionId: 19,

        totalDebt: 0,

        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: new Date(),

        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      },

      { 
        id: '3',
        firstName: 'Peter',
        lastName: 'Shayo',
        code: 'F003',
        phone: '+255734567890',

        locationId: 16,
        cppId: 4,
        extensionId: 19,

        totalDebt: 150000,

        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: new Date(),

        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
      },

      { 
        id: '4',
        firstName: 'Grace',
        lastName: 'Mwakipesile',
        code: 'F004',
        phone: '+255745678901',

        locationId: 16,
        cppId: 5,
        extensionId: 20,

        totalDebt: 0,

        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: new Date(),

        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04')
      },

      { 
        id: '5',
        firstName: 'James',
        lastName: 'Lyimo',
        code: 'F005',
        phone: '+255756789012',

        locationId: 16,
        cppId: 5,
        extensionId: 20,

        totalDebt: 75000,

        originalDeviceId: null,
        originalLocalId: null,
        syncSource: 'web',
        syncedAt: new Date(),

        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('farmers', null, {});
  }
};