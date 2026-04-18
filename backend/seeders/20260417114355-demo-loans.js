'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('loans', [
      { id: 1, name: 'Fertilizer Pack', type: 'fertilizer', price: 50.00, unit: 'bag', description: 'NPK 20-10-10 fertilizer', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 2, name: 'Seeds Package', type: 'seeds', price: 30.00, unit: 'kg', description: 'High-yield tobacco seeds', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 3, name: 'Pesticide Spray', type: 'pesticide', price: 45.00, unit: 'liter', description: 'Organic pesticide', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 4, name: 'Tools Kit', type: 'equipment', price: 120.00, unit: 'set', description: 'Farming tools bundle', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loans', null, {});
  }
};