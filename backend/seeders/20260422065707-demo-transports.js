
// --->backend/seeders/XXXXXXXXXXXXXX-demo-transports.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transports', [
      { 
        id: '1', 
        receiptNumber: 'TRN-2024-001', 
        rebaleId: '2', 
        driverName: 'Juma Hassan', 
        driverPhone: '+255765432109', 
        truckPlate1: 'T123ABC', 
        truckPlate2: 'T456XYZ', 
        totalMass: 120.00, 
        totalAmount: 252000, 
        buyerId: 2, 
        warehouseId: 1, 
        originLocationId: 1, 
        destinationLocationId: 2, 
        status: 'delivered', 
        transportDate: '2024-01-27', 
        arrivalDate: '2024-01-28',
        syncSource: 'web',
        createdAt: new Date('2024-01-27'), 
        updatedAt: new Date('2024-01-28') 
      },
      { 
        id: '2', 
        receiptNumber: 'TRN-2024-002', 
        rebaleId: null, 
        driverName: 'Ally Mohamed', 
        driverPhone: '+255776543210', 
        truckPlate1: 'T789DEF', 
        truckPlate2: null, 
        totalMass: 150.50, 
        totalAmount: 300000, 
        buyerId: 2, 
        warehouseId: 2, 
        originLocationId: 1, 
        destinationLocationId: 3, 
        status: 'in_transit', 
        transportDate: '2024-01-29', 
        arrivalDate: null,
        syncSource: 'web',
        createdAt: new Date('2024-01-29'), 
        updatedAt: new Date('2024-01-29') 
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transports', null, {});
  }
};
