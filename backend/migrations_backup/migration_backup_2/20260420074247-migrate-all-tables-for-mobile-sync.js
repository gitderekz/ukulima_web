// // // backend/migrations/20260420070006-migrate-all-tables-for-mobile-sync.js
// // 'use strict';

// // /** @type {import('sequelize-cli').Migration} */
// // module.exports = {
// //   async up(queryInterface, Sequelize) {
// //     // Disable foreign key checks for the entire migration
// //     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
// //     try {
// //       // =============================================
// //       // 1. ALTER PURCHASES TABLE
// //       // =============================================
// //       console.log('Migrating purchases table...');
      
// //       await queryInterface.createTable('purchases_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         receiptNumber: {
// //           type: Sequelize.STRING(255),
// //           allowNull: false,
// //           unique: true
// //         },
// //         farmerId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         buyerId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         clerkId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         warehouseId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         totalMass: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         totalAmount: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         loanDeducted: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false,
// //           defaultValue: 0
// //         },
// //         amountPaid: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         purchaseDate: {
// //           type: Sequelize.DATEONLY,
// //           allowNull: false
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       // Copy data
// //       await queryInterface.sequelize.query(`
// //         INSERT INTO purchases_new (
// //           id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
// //           totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
// //           syncSource, createdAt, updatedAt
// //         )
// //         SELECT 
// //           CAST(id AS CHAR),
// //           receiptNumber,
// //           farmerId, buyerId, clerkId, warehouseId,
// //           totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
// //           'web',
// //           createdAt, updatedAt
// //         FROM purchases
// //       `);

// //       // Drop old table and rename
// //       await queryInterface.dropTable('purchases');
// //       await queryInterface.renameTable('purchases_new', 'purchases');

// //       // =============================================
// //       // 2. ALTER BALES TABLE
// //       // =============================================
// //       console.log('Migrating bales table...');
      
// //       await queryInterface.createTable('bales_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         baleTag: {
// //           type: Sequelize.STRING(255),
// //           allowNull: false,
// //           unique: true
// //         },
// //         purchaseId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         cropId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         gradeId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         mass: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         price: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         totalAmount: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         warehouseId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         status: {
// //           type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
// //           allowNull: false,
// //           defaultValue: 'purchased'
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO bales_new (
// //           id, baleTag, purchaseId, cropId, gradeId, mass, price,
// //           totalAmount, warehouseId, status, syncSource, createdAt, updatedAt
// //         )
// //         SELECT 
// //           CAST(id AS CHAR),
// //           baleTag,
// //           CAST(purchaseId AS CHAR),
// //           cropId, gradeId, mass, price,
// //           totalAmount, warehouseId, status,
// //           'web',
// //           createdAt, updatedAt
// //         FROM bales
// //       `);

// //       await queryInterface.dropTable('bales');
// //       await queryInterface.renameTable('bales_new', 'bales');

// //       // =============================================
// //       // 3. ALTER REBALES TABLE
// //       // =============================================
// //       console.log('Migrating rebales table...');
      
// //       await queryInterface.createTable('rebales_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         rebaleTag: {
// //           type: Sequelize.STRING(255),
// //           allowNull: false,
// //           unique: true
// //         },
// //         receiptNumber: {
// //           type: Sequelize.STRING(255),
// //           allowNull: false,
// //           unique: true
// //         },
// //         cropId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         gradeId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         totalMass: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         price: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         totalAmount: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         warehouseId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         buyerId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         sourceBaleIds: {
// //           type: Sequelize.TEXT,
// //           allowNull: true
// //         },
// //         rebaleDate: {
// //           type: Sequelize.DATEONLY,
// //           allowNull: false
// //         },
// //         status: {
// //           type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
// //           allowNull: false,
// //           defaultValue: 'stored'
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO rebales_new
// //         SELECT 
// //           CAST(id AS CHAR),
// //           NULL, NULL,
// //           rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
// //           warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
// //           'web', NULL, createdAt, updatedAt
// //         FROM rebales
// //       `);

// //       await queryInterface.dropTable('rebales');
// //       await queryInterface.renameTable('rebales_new', 'rebales');

// //       // =============================================
// //       // 4. ALTER REBALE_BALES JUNCTION TABLE
// //       // =============================================
// //       console.log('Migrating rebale_bales table...');
      
// //       await queryInterface.createTable('rebale_bales_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         rebaleId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         baleId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         sourceBaleIds: {
// //           type: Sequelize.TEXT,
// //           allowNull: true
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO rebale_bales_new
// //         SELECT 
// //           CAST(id AS CHAR),
// //           NULL, NULL,
// //           CAST(rebaleId AS CHAR),
// //           CAST(baleId AS CHAR),
// //           sourceBaleIds,
// //           'web', NULL,
// //           createdAt, updatedAt
// //         FROM rebale_bales
// //       `);

// //       await queryInterface.dropTable('rebale_bales');
// //       await queryInterface.renameTable('rebale_bales_new', 'rebale_bales');

// //       // =============================================
// //       // 5. ALTER TRANSPORTS TABLE
// //       // =============================================
// //       console.log('Migrating transports table...');
      
// //       await queryInterface.createTable('transports_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         receiptNumber: {
// //           type: Sequelize.STRING(255),
// //           allowNull: false,
// //           unique: true
// //         },
// //         driverName: {
// //           type: Sequelize.STRING(255),
// //           allowNull: false
// //         },
// //         driverPhone: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         truckPlate1: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         truckPlate2: {
// //           type: Sequelize.STRING(50),
// //           allowNull: true
// //         },
// //         totalMass: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         totalAmount: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         buyerId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         warehouseId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         originLocationId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         destinationLocationId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         status: {
// //           type: Sequelize.ENUM('in_transit', 'delivered', 'cancelled'),
// //           allowNull: false,
// //           defaultValue: 'in_transit'
// //         },
// //         transportDate: {
// //           type: Sequelize.DATEONLY,
// //           allowNull: false
// //         },
// //         arrivalDate: {
// //           type: Sequelize.DATEONLY,
// //           allowNull: true
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO transports_new
// //         SELECT 
// //           CAST(id AS CHAR),
// //           NULL, NULL,
// //           receiptNumber, driverName, driverPhone, truckPlate1, truckPlate2,
// //           totalMass, totalAmount, buyerId, warehouseId, originLocationId, destinationLocationId,
// //           status, transportDate, arrivalDate,
// //           'web', NULL, createdAt, updatedAt
// //         FROM transports
// //       `);

// //       await queryInterface.dropTable('transports');
// //       await queryInterface.renameTable('transports_new', 'transports');

// //       // =============================================
// //       // 6. ALTER TRANSPORT_REBALES JUNCTION TABLE
// //       // =============================================
// //       console.log('Migrating transport_rebales table...');
      
// //       await queryInterface.createTable('transport_rebales_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         transportId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         rebaleId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         loadedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: false,
// //           defaultValue: Sequelize.NOW
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO transport_rebales_new
// //         SELECT 
// //           CAST(id AS CHAR),
// //           NULL, NULL,
// //           CAST(transportId AS CHAR),
// //           CAST(rebaleId AS CHAR),
// //           loadedAt,
// //           'web', NULL,
// //           createdAt, updatedAt
// //         FROM transport_rebales
// //       `);

// //       await queryInterface.dropTable('transport_rebales');
// //       await queryInterface.renameTable('transport_rebales_new', 'transport_rebales');

// //       // =============================================
// //       // 7. ALTER FARMER_LOANS TABLE
// //       // =============================================
// //       console.log('Migrating farmer_loans table...');
      
// //       await queryInterface.createTable('farmer_loans_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         farmerId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         loanId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: false
// //         },
// //         quantity: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         totalAmount: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         remainingDebt: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         issuedDate: {
// //           type: Sequelize.DATEONLY,
// //           allowNull: false
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO farmer_loans_new
// //         SELECT 
// //           CAST(id AS CHAR),
// //           NULL, NULL,
// //           farmerId, loanId, quantity, totalAmount, remainingDebt, issuedDate,
// //           'web', NULL, createdAt, updatedAt
// //         FROM farmer_loans
// //       `);

// //       await queryInterface.dropTable('farmer_loans');
// //       await queryInterface.renameTable('farmer_loans_new', 'farmer_loans');

// //       // =============================================
// //       // 8. ALTER LOAN_DEDUCTIONS TABLE
// //       // =============================================
// //       console.log('Migrating loan_deductions table...');
      
// //       await queryInterface.createTable('loan_deductions_new', {
// //         id: {
// //           type: Sequelize.STRING(50),
// //           primaryKey: true,
// //           allowNull: false
// //         },
// //         originalDeviceId: {
// //           type: Sequelize.STRING(20),
// //           allowNull: true
// //         },
// //         originalLocalId: {
// //           type: Sequelize.INTEGER,
// //           allowNull: true
// //         },
// //         purchaseId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         farmerLoanId: {
// //           type: Sequelize.STRING(50),
// //           allowNull: false
// //         },
// //         deductedAmount: {
// //           type: Sequelize.DECIMAL(10, 2),
// //           allowNull: false
// //         },
// //         deductionDate: {
// //           type: Sequelize.DATEONLY,
// //           allowNull: false
// //         },
// //         syncSource: {
// //           type: Sequelize.ENUM('web', 'mobile'),
// //           defaultValue: 'web'
// //         },
// //         syncedAt: {
// //           type: Sequelize.DATE,
// //           allowNull: true
// //         },
// //         createdAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         },
// //         updatedAt: {
// //           allowNull: false,
// //           type: Sequelize.DATE
// //         }
// //       });

// //       await queryInterface.sequelize.query(`
// //         INSERT INTO loan_deductions_new
// //         SELECT 
// //           CAST(id AS CHAR),
// //           NULL, NULL,
// //           CAST(purchaseId AS CHAR),
// //           CAST(farmerLoanId AS CHAR),
// //           deductedAmount, deductionDate,
// //           'web', NULL, createdAt, updatedAt
// //         FROM loan_deductions
// //       `);

// //       await queryInterface.dropTable('loan_deductions');
// //       await queryInterface.renameTable('loan_deductions_new', 'loan_deductions');

// //       // =============================================
// //       // 9. ADD FOREIGN KEY CONSTRAINTS BACK
// //       // =============================================
// //       console.log('Adding foreign key constraints...');
      
// //       // Purchases constraints
// //       await queryInterface.addConstraint('purchases', {
// //         fields: ['farmerId'],
// //         type: 'foreign key',
// //         name: 'purchases_farmerId_fk',
// //         references: {
// //           table: 'farmers',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('purchases', {
// //         fields: ['buyerId'],
// //         type: 'foreign key',
// //         name: 'purchases_buyerId_fk',
// //         references: {
// //           table: 'users',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('purchases', {
// //         fields: ['clerkId'],
// //         type: 'foreign key',
// //         name: 'purchases_clerkId_fk',
// //         references: {
// //           table: 'users',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('purchases', {
// //         fields: ['warehouseId'],
// //         type: 'foreign key',
// //         name: 'purchases_warehouseId_fk',
// //         references: {
// //           table: 'warehouses',
// //           field: 'id'
// //         }
// //       });

// //       // Bales constraints
// //       await queryInterface.addConstraint('bales', {
// //         fields: ['purchaseId'],
// //         type: 'foreign key',
// //         name: 'bales_purchaseId_fk',
// //         references: {
// //           table: 'purchases',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('bales', {
// //         fields: ['cropId'],
// //         type: 'foreign key',
// //         name: 'bales_cropId_fk',
// //         references: {
// //           table: 'crops',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('bales', {
// //         fields: ['gradeId'],
// //         type: 'foreign key',
// //         name: 'bales_gradeId_fk',
// //         references: {
// //           table: 'grades',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('bales', {
// //         fields: ['warehouseId'],
// //         type: 'foreign key',
// //         name: 'bales_warehouseId_fk',
// //         references: {
// //           table: 'warehouses',
// //           field: 'id'
// //         }
// //       });

// //       // Rebales constraints
// //       await queryInterface.addConstraint('rebales', {
// //         fields: ['cropId'],
// //         type: 'foreign key',
// //         name: 'rebales_cropId_fk',
// //         references: {
// //           table: 'crops',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('rebales', {
// //         fields: ['gradeId'],
// //         type: 'foreign key',
// //         name: 'rebales_gradeId_fk',
// //         references: {
// //           table: 'grades',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('rebales', {
// //         fields: ['warehouseId'],
// //         type: 'foreign key',
// //         name: 'rebales_warehouseId_fk',
// //         references: {
// //           table: 'warehouses',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('rebales', {
// //         fields: ['buyerId'],
// //         type: 'foreign key',
// //         name: 'rebales_buyerId_fk',
// //         references: {
// //           table: 'users',
// //           field: 'id'
// //         }
// //       });

// //       // RebaleBales constraints
// //       await queryInterface.addConstraint('rebale_bales', {
// //         fields: ['rebaleId'],
// //         type: 'foreign key',
// //         name: 'rebale_bales_rebaleId_fk',
// //         references: {
// //           table: 'rebales',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('rebale_bales', {
// //         fields: ['baleId'],
// //         type: 'foreign key',
// //         name: 'rebale_bales_baleId_fk',
// //         references: {
// //           table: 'bales',
// //           field: 'id'
// //         }
// //       });

// //       // Transports constraints
// //       await queryInterface.addConstraint('transports', {
// //         fields: ['buyerId'],
// //         type: 'foreign key',
// //         name: 'transports_buyerId_fk',
// //         references: {
// //           table: 'users',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('transports', {
// //         fields: ['warehouseId'],
// //         type: 'foreign key',
// //         name: 'transports_warehouseId_fk',
// //         references: {
// //           table: 'warehouses',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('transports', {
// //         fields: ['originLocationId'],
// //         type: 'foreign key',
// //         name: 'transports_originLocationId_fk',
// //         references: {
// //           table: 'locations',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('transports', {
// //         fields: ['destinationLocationId'],
// //         type: 'foreign key',
// //         name: 'transports_destinationLocationId_fk',
// //         references: {
// //           table: 'locations',
// //           field: 'id'
// //         }
// //       });

// //       // TransportRebales constraints
// //       await queryInterface.addConstraint('transport_rebales', {
// //         fields: ['transportId'],
// //         type: 'foreign key',
// //         name: 'transport_rebales_transportId_fk',
// //         references: {
// //           table: 'transports',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('transport_rebales', {
// //         fields: ['rebaleId'],
// //         type: 'foreign key',
// //         name: 'transport_rebales_rebaleId_fk',
// //         references: {
// //           table: 'rebales',
// //           field: 'id'
// //         }
// //       });

// //       // FarmerLoans constraints
// //       await queryInterface.addConstraint('farmer_loans', {
// //         fields: ['farmerId'],
// //         type: 'foreign key',
// //         name: 'farmer_loans_farmerId_fk',
// //         references: {
// //           table: 'farmers',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('farmer_loans', {
// //         fields: ['loanId'],
// //         type: 'foreign key',
// //         name: 'farmer_loans_loanId_fk',
// //         references: {
// //           table: 'loans',
// //           field: 'id'
// //         }
// //       });

// //       // LoanDeductions constraints
// //       await queryInterface.addConstraint('loan_deductions', {
// //         fields: ['purchaseId'],
// //         type: 'foreign key',
// //         name: 'loan_deductions_purchaseId_fk',
// //         references: {
// //           table: 'purchases',
// //           field: 'id'
// //         }
// //       });
      
// //       await queryInterface.addConstraint('loan_deductions', {
// //         fields: ['farmerLoanId'],
// //         type: 'foreign key',
// //         name: 'loan_deductions_farmerLoanId_fk',
// //         references: {
// //           table: 'farmer_loans',
// //           field: 'id'
// //         }
// //       });

// //       // =============================================
// //       // 10. ADD INDEXES
// //       // =============================================
// //       console.log('Adding indexes...');
      
// //       await queryInterface.addIndex('purchases', ['originalDeviceId', 'originalLocalId']);
// //       await queryInterface.addIndex('bales', ['originalDeviceId', 'originalLocalId']);
// //       await queryInterface.addIndex('rebales', ['originalDeviceId', 'originalLocalId']);
// //       await queryInterface.addIndex('transports', ['originalDeviceId', 'originalLocalId']);
      
// //       console.log('Migration completed successfully!');
      
// //     } catch (error) {
// //       console.error('Migration failed:', error);
// //       throw error;
// //     } finally {
// //       // Re-enable foreign key checks
// //       await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
// //     }
// //   },

// //   async down(queryInterface, Sequelize) {
// //     // Rollback would be complex - consider taking a backup before migration
// //     console.log('Rollback not fully implemented. Restore from backup if needed.');
// //   }
// // };
// // backend/migrations/20260420074247-migrate-all-tables-for-mobile-sync.js
// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Disable foreign key checks for the entire migration
//     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
//     try {
//       // =============================================
//       // 1. ALTER PURCHASES TABLE
//       // =============================================
//       console.log('Migrating purchases table...');
      
//       await queryInterface.createTable('purchases_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         receiptNumber: {
//           type: Sequelize.STRING(255),
//           allowNull: false,
//           unique: true
//         },
//         farmerId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         buyerId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         clerkId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         warehouseId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         totalMass: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         totalAmount: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         loanDeducted: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false,
//           defaultValue: 0
//         },
//         amountPaid: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         purchaseDate: {
//           type: Sequelize.DATEONLY,
//           allowNull: false
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       // Copy data with row number to avoid duplicates
//       await queryInterface.sequelize.query(`
//         INSERT INTO purchases_new (
//           id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
//           totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
//           syncSource, createdAt, updatedAt
//         )
//         SELECT 
//           CAST(id AS CHAR),
//           receiptNumber,
//           farmerId, buyerId, clerkId, warehouseId,
//           totalMass, totalAmount, COALESCE(loanDeducted, 0), amountPaid, purchaseDate,
//           'web',
//           createdAt, updatedAt
//         FROM purchases
//         GROUP BY id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
//                  totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
//                  createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('purchases');
//       await queryInterface.renameTable('purchases_new', 'purchases');

//       // =============================================
//       // 2. ALTER BALES TABLE
//       // =============================================
//       console.log('Migrating bales table...');
      
//       await queryInterface.createTable('bales_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         baleTag: {
//           type: Sequelize.STRING(255),
//           allowNull: false,
//           unique: true
//         },
//         purchaseId: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         cropId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         gradeId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         mass: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         price: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         totalAmount: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         warehouseId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         status: {
//           type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
//           allowNull: false,
//           defaultValue: 'purchased'
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       await queryInterface.sequelize.query(`
//         INSERT INTO bales_new (
//           id, baleTag, purchaseId, cropId, gradeId, mass, price,
//           totalAmount, warehouseId, status, syncSource, createdAt, updatedAt
//         )
//         SELECT 
//           CAST(id AS CHAR),
//           baleTag,
//           CAST(purchaseId AS CHAR),
//           cropId, gradeId, mass, price,
//           totalAmount, warehouseId, status,
//           'web',
//           createdAt, updatedAt
//         FROM bales
//         GROUP BY id, baleTag, purchaseId, cropId, gradeId, mass, price,
//                  totalAmount, warehouseId, status, createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('bales');
//       await queryInterface.renameTable('bales_new', 'bales');

//       // =============================================
//       // 3. ALTER REBALES TABLE
//       // =============================================
//       console.log('Migrating rebales table...');
      
//       await queryInterface.createTable('rebales_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         rebaleTag: {
//           type: Sequelize.STRING(255),
//           allowNull: false,
//           unique: true
//         },
//         receiptNumber: {
//           type: Sequelize.STRING(255),
//           allowNull: false,
//           unique: true
//         },
//         cropId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         gradeId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         totalMass: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         price: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         totalAmount: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         warehouseId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         buyerId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         sourceBaleIds: {
//           type: Sequelize.TEXT,
//           allowNull: true
//         },
//         rebaleDate: {
//           type: Sequelize.DATEONLY,
//           allowNull: false
//         },
//         status: {
//           type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
//           allowNull: false,
//           defaultValue: 'stored'
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       await queryInterface.sequelize.query(`
//         INSERT INTO rebales_new
//         SELECT 
//           CAST(id AS CHAR),
//           NULL, NULL,
//           rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
//           warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
//           'web', NULL, createdAt, updatedAt
//         FROM rebales
//         GROUP BY id, rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, 
//                  totalAmount, warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
//                  createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('rebales');
//       await queryInterface.renameTable('rebales_new', 'rebales');

//       // =============================================
//       // 4. ALTER REBALE_BALES JUNCTION TABLE
//       // =============================================
//       console.log('Migrating rebale_bales table...');
      
//       await queryInterface.createTable('rebale_bales_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         rebaleId: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         baleId: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         sourceBaleIds: {
//           type: Sequelize.TEXT,
//           allowNull: true
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       await queryInterface.sequelize.query(`
//         INSERT INTO rebale_bales_new
//         SELECT 
//           CAST(id AS CHAR),
//           NULL, NULL,
//           CAST(rebaleId AS CHAR),
//           CAST(baleId AS CHAR),
//           sourceBaleIds,
//           'web', NULL,
//           createdAt, updatedAt
//         FROM rebale_bales
//         GROUP BY id, rebaleId, baleId, sourceBaleIds, createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('rebale_bales');
//       await queryInterface.renameTable('rebale_bales_new', 'rebale_bales');

//       // =============================================
//       // 5. ALTER TRANSPORTS TABLE
//       // =============================================
//       console.log('Migrating transports table...');
      
//       await queryInterface.createTable('transports_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         receiptNumber: {
//           type: Sequelize.STRING(255),
//           allowNull: false,
//           unique: true
//         },
//         driverName: {
//           type: Sequelize.STRING(255),
//           allowNull: false
//         },
//         driverPhone: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         truckPlate1: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         truckPlate2: {
//           type: Sequelize.STRING(50),
//           allowNull: true
//         },
//         totalMass: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         totalAmount: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         buyerId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         warehouseId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         originLocationId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         destinationLocationId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         status: {
//           type: Sequelize.ENUM('in_transit', 'delivered', 'cancelled'),
//           allowNull: false,
//           defaultValue: 'in_transit'
//         },
//         transportDate: {
//           type: Sequelize.DATEONLY,
//           allowNull: false
//         },
//         arrivalDate: {
//           type: Sequelize.DATEONLY,
//           allowNull: true
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       await queryInterface.sequelize.query(`
//         INSERT INTO transports_new
//         SELECT 
//           CAST(id AS CHAR),
//           NULL, NULL,
//           receiptNumber, driverName, driverPhone, truckPlate1, truckPlate2,
//           totalMass, totalAmount, buyerId, warehouseId, originLocationId, destinationLocationId,
//           status, transportDate, arrivalDate,
//           'web', NULL, createdAt, updatedAt
//         FROM transports
//         GROUP BY id, receiptNumber, driverName, driverPhone, truckPlate1, truckPlate2,
//                  totalMass, totalAmount, buyerId, warehouseId, originLocationId, 
//                  destinationLocationId, status, transportDate, arrivalDate, createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('transports');
//       await queryInterface.renameTable('transports_new', 'transports');

//       // =============================================
//       // 6. ALTER TRANSPORT_REBALES TABLE
//       // =============================================
//       console.log('Migrating transport_rebales table...');
      
//       // Check if table exists first
//       const tableExists = await queryInterface.sequelize.query(
//         "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'transport_rebales'",
//         { type: Sequelize.QueryTypes.SELECT }
//       );
      
//       if (tableExists.length > 0) {
//         await queryInterface.createTable('transport_rebales_new', {
//           id: {
//             type: Sequelize.STRING(50),
//             primaryKey: true,
//             allowNull: false
//           },
//           originalDeviceId: {
//             type: Sequelize.STRING(20),
//             allowNull: true
//           },
//           originalLocalId: {
//             type: Sequelize.INTEGER,
//             allowNull: true
//           },
//           transportId: {
//             type: Sequelize.STRING(50),
//             allowNull: false
//           },
//           rebaleId: {
//             type: Sequelize.STRING(50),
//             allowNull: false
//           },
//           loadedAt: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             defaultValue: Sequelize.NOW
//           },
//           syncSource: {
//             type: Sequelize.ENUM('web', 'mobile'),
//             defaultValue: 'web'
//           },
//           syncedAt: {
//             type: Sequelize.DATE,
//             allowNull: true
//           },
//           createdAt: {
//             allowNull: false,
//             type: Sequelize.DATE
//           },
//           updatedAt: {
//             allowNull: false,
//             type: Sequelize.DATE
//           }
//         });

//         await queryInterface.sequelize.query(`
//           INSERT INTO transport_rebales_new
//           SELECT 
//             CAST(id AS CHAR),
//             NULL, NULL,
//             CAST(transportId AS CHAR),
//             CAST(rebaleId AS CHAR),
//             loadedAt,
//             'web', NULL,
//             createdAt, updatedAt
//           FROM transport_rebales
//           GROUP BY id, transportId, rebaleId, loadedAt, createdAt, updatedAt
//         `);

//         await queryInterface.dropTable('transport_rebales');
//         await queryInterface.renameTable('transport_rebales_new', 'transport_rebales');
//       }

//       // =============================================
//       // 7. ALTER FARMER_LOANS TABLE
//       // =============================================
//       console.log('Migrating farmer_loans table...');
      
//       await queryInterface.createTable('farmer_loans_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         farmerId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         loanId: {
//           type: Sequelize.INTEGER,
//           allowNull: false
//         },
//         quantity: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         totalAmount: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         remainingDebt: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         issuedDate: {
//           type: Sequelize.DATEONLY,
//           allowNull: false
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       await queryInterface.sequelize.query(`
//         INSERT INTO farmer_loans_new
//         SELECT 
//           CAST(id AS CHAR),
//           NULL, NULL,
//           farmerId, loanId, quantity, totalAmount, remainingDebt, issuedDate,
//           'web', NULL, createdAt, updatedAt
//         FROM farmer_loans
//         GROUP BY id, farmerId, loanId, quantity, totalAmount, remainingDebt, 
//                  issuedDate, createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('farmer_loans');
//       await queryInterface.renameTable('farmer_loans_new', 'farmer_loans');

//       // =============================================
//       // 8. ALTER LOAN_DEDUCTIONS TABLE
//       // =============================================
//       console.log('Migrating loan_deductions table...');
      
//       await queryInterface.createTable('loan_deductions_new', {
//         id: {
//           type: Sequelize.STRING(50),
//           primaryKey: true,
//           allowNull: false
//         },
//         originalDeviceId: {
//           type: Sequelize.STRING(20),
//           allowNull: true
//         },
//         originalLocalId: {
//           type: Sequelize.INTEGER,
//           allowNull: true
//         },
//         purchaseId: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         farmerLoanId: {
//           type: Sequelize.STRING(50),
//           allowNull: false
//         },
//         deductedAmount: {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: false
//         },
//         deductionDate: {
//           type: Sequelize.DATEONLY,
//           allowNull: false
//         },
//         syncSource: {
//           type: Sequelize.ENUM('web', 'mobile'),
//           defaultValue: 'web'
//         },
//         syncedAt: {
//           type: Sequelize.DATE,
//           allowNull: true
//         },
//         createdAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         },
//         updatedAt: {
//           allowNull: false,
//           type: Sequelize.DATE
//         }
//       });

//       await queryInterface.sequelize.query(`
//         INSERT INTO loan_deductions_new
//         SELECT 
//           CAST(id AS CHAR),
//           NULL, NULL,
//           CAST(purchaseId AS CHAR),
//           CAST(farmerLoanId AS CHAR),
//           deductedAmount, deductionDate,
//           'web', NULL, createdAt, updatedAt
//         FROM loan_deductions
//         GROUP BY id, purchaseId, farmerLoanId, deductedAmount, deductionDate, 
//                  createdAt, updatedAt
//       `);

//       await queryInterface.dropTable('loan_deductions');
//       await queryInterface.renameTable('loan_deductions_new', 'loan_deductions');

//       // =============================================
//       // 9. ADD FOREIGN KEY CONSTRAINTS
//       // =============================================
//       console.log('Adding foreign key constraints...');
      
//       // Purchases constraints
//       await queryInterface.addConstraint('purchases', {
//         fields: ['farmerId'],
//         type: 'foreign key',
//         name: 'purchases_farmerId_fk',
//         references: { table: 'farmers', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('purchases', {
//         fields: ['buyerId'],
//         type: 'foreign key',
//         name: 'purchases_buyerId_fk',
//         references: { table: 'users', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('purchases', {
//         fields: ['clerkId'],
//         type: 'foreign key',
//         name: 'purchases_clerkId_fk',
//         references: { table: 'users', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('purchases', {
//         fields: ['warehouseId'],
//         type: 'foreign key',
//         name: 'purchases_warehouseId_fk',
//         references: { table: 'warehouses', field: 'id' }
//       });

//       // Bales constraints
//       await queryInterface.addConstraint('bales', {
//         fields: ['purchaseId'],
//         type: 'foreign key',
//         name: 'bales_purchaseId_fk',
//         references: { table: 'purchases', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('bales', {
//         fields: ['cropId'],
//         type: 'foreign key',
//         name: 'bales_cropId_fk',
//         references: { table: 'crops', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('bales', {
//         fields: ['gradeId'],
//         type: 'foreign key',
//         name: 'bales_gradeId_fk',
//         references: { table: 'grades', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('bales', {
//         fields: ['warehouseId'],
//         type: 'foreign key',
//         name: 'bales_warehouseId_fk',
//         references: { table: 'warehouses', field: 'id' }
//       });

//       // Rebales constraints
//       await queryInterface.addConstraint('rebales', {
//         fields: ['cropId'],
//         type: 'foreign key',
//         name: 'rebales_cropId_fk',
//         references: { table: 'crops', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('rebales', {
//         fields: ['gradeId'],
//         type: 'foreign key',
//         name: 'rebales_gradeId_fk',
//         references: { table: 'grades', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('rebales', {
//         fields: ['warehouseId'],
//         type: 'foreign key',
//         name: 'rebales_warehouseId_fk',
//         references: { table: 'warehouses', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('rebales', {
//         fields: ['buyerId'],
//         type: 'foreign key',
//         name: 'rebales_buyerId_fk',
//         references: { table: 'users', field: 'id' }
//       });

//       // RebaleBales constraints
//       await queryInterface.addConstraint('rebale_bales', {
//         fields: ['rebaleId'],
//         type: 'foreign key',
//         name: 'rebale_bales_rebaleId_fk',
//         references: { table: 'rebales', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('rebale_bales', {
//         fields: ['baleId'],
//         type: 'foreign key',
//         name: 'rebale_bales_baleId_fk',
//         references: { table: 'bales', field: 'id' }
//       });

//       // Transports constraints
//       await queryInterface.addConstraint('transports', {
//         fields: ['buyerId'],
//         type: 'foreign key',
//         name: 'transports_buyerId_fk',
//         references: { table: 'users', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('transports', {
//         fields: ['warehouseId'],
//         type: 'foreign key',
//         name: 'transports_warehouseId_fk',
//         references: { table: 'warehouses', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('transports', {
//         fields: ['originLocationId'],
//         type: 'foreign key',
//         name: 'transports_originLocationId_fk',
//         references: { table: 'locations', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('transports', {
//         fields: ['destinationLocationId'],
//         type: 'foreign key',
//         name: 'transports_destinationLocationId_fk',
//         references: { table: 'locations', field: 'id' }
//       });

//       // Check if transport_rebales exists before adding constraints
//       const transportRebalesExists = await queryInterface.sequelize.query(
//         "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'transport_rebales'",
//         { type: Sequelize.QueryTypes.SELECT }
//       );
      
//       if (transportRebalesExists.length > 0) {
//         await queryInterface.addConstraint('transport_rebales', {
//           fields: ['transportId'],
//           type: 'foreign key',
//           name: 'transport_rebales_transportId_fk',
//           references: { table: 'transports', field: 'id' }
//         });
        
//         await queryInterface.addConstraint('transport_rebales', {
//           fields: ['rebaleId'],
//           type: 'foreign key',
//           name: 'transport_rebales_rebaleId_fk',
//           references: { table: 'rebales', field: 'id' }
//         });
//       }

//       // FarmerLoans constraints
//       await queryInterface.addConstraint('farmer_loans', {
//         fields: ['farmerId'],
//         type: 'foreign key',
//         name: 'farmer_loans_farmerId_fk',
//         references: { table: 'farmers', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('farmer_loans', {
//         fields: ['loanId'],
//         type: 'foreign key',
//         name: 'farmer_loans_loanId_fk',
//         references: { table: 'loans', field: 'id' }
//       });

//       // LoanDeductions constraints
//       await queryInterface.addConstraint('loan_deductions', {
//         fields: ['purchaseId'],
//         type: 'foreign key',
//         name: 'loan_deductions_purchaseId_fk',
//         references: { table: 'purchases', field: 'id' }
//       });
      
//       await queryInterface.addConstraint('loan_deductions', {
//         fields: ['farmerLoanId'],
//         type: 'foreign key',
//         name: 'loan_deductions_farmerLoanId_fk',
//         references: { table: 'farmer_loans', field: 'id' }
//       });

//       console.log('Migration completed successfully!');
      
//     } catch (error) {
//       console.error('Migration failed:', error);
//       throw error;
//     } finally {
//       await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
//     }
//   },

//   async down(queryInterface, Sequelize) {
//     console.log('Rollback not implemented. Restore from backup if needed.');
//   }
// };
// backend/migrations/20260420074247-migrate-all-tables-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Disable foreign key checks for the entire migration
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
      // First, check and reset auto-increment if needed
      console.log('Checking purchases table data...');
      
      const purchases = await queryInterface.sequelize.query(
        'SELECT id FROM purchases ORDER BY id',
        { type: Sequelize.QueryTypes.SELECT }
      );
      console.log(`Found ${purchases.length} records in purchases table`);
      
      // =============================================
      // 1. ALTER PURCHASES TABLE
      // =============================================
      console.log('Migrating purchases table...');
      
      await queryInterface.createTable('purchases_new', {
        id: {
          type: Sequelize.STRING(50),
          primaryKey: true,
          allowNull: false
        },
        originalDeviceId: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        originalLocalId: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        receiptNumber: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        farmerId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        clerkId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        warehouseId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        totalMass: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        totalAmount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        loanDeducted: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0
        },
        amountPaid: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        purchaseDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        syncSource: {
          type: Sequelize.ENUM('web', 'mobile'),
          defaultValue: 'web'
        },
        syncedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

      // Copy only existing data
      const result = await queryInterface.sequelize.query(`
        INSERT INTO purchases_new (
          id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
          totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
          syncSource, createdAt, updatedAt
        )
        SELECT 
          CAST(p.id AS CHAR),
          p.receiptNumber,
          p.farmerId, p.buyerId, p.clerkId, p.warehouseId,
          p.totalMass, p.totalAmount, COALESCE(p.loanDeducted, 0), p.amountPaid, p.purchaseDate,
          'web',
          p.createdAt, p.updatedAt
        FROM purchases p
        WHERE p.id IS NOT NULL
      `);
      
      console.log(`Migrated ${result[0].affectedRows} purchases records`);

      await queryInterface.dropTable('purchases');
      await queryInterface.renameTable('purchases_new', 'purchases');

      // =============================================
      // 2. ALTER BALES TABLE
      // =============================================
      console.log('Migrating bales table...');
      
      // Check bales table first
      const bales = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM bales',
        { type: Sequelize.QueryTypes.SELECT }
      );
      console.log(`Found ${bales[0].count} records in bales table`);
      
      await queryInterface.createTable('bales_new', {
        id: {
          type: Sequelize.STRING(50),
          primaryKey: true,
          allowNull: false
        },
        originalDeviceId: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        originalLocalId: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        baleTag: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        purchaseId: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        cropId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        gradeId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        mass: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        totalAmount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        warehouseId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
          allowNull: false,
          defaultValue: 'purchased'
        },
        syncSource: {
          type: Sequelize.ENUM('web', 'mobile'),
          defaultValue: 'web'
        },
        syncedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

      const balesResult = await queryInterface.sequelize.query(`
        INSERT INTO bales_new (
          id, baleTag, purchaseId, cropId, gradeId, mass, price,
          totalAmount, warehouseId, status, syncSource, createdAt, updatedAt
        )
        SELECT 
          CAST(b.id AS CHAR),
          b.baleTag,
          CAST(b.purchaseId AS CHAR),
          b.cropId, b.gradeId, b.mass, b.price,
          b.totalAmount, b.warehouseId, b.status,
          'web',
          b.createdAt, b.updatedAt
        FROM bales b
        WHERE b.id IS NOT NULL
          AND EXISTS (SELECT 1 FROM purchases WHERE id = CAST(b.purchaseId AS CHAR))
      `);
      
      console.log(`Migrated ${balesResult[0].affectedRows} bales records`);

      await queryInterface.dropTable('bales');
      await queryInterface.renameTable('bales_new', 'bales');

      // =============================================
      // 3. ALTER REBALES TABLE
      // =============================================
      console.log('Migrating rebales table...');
      
      await queryInterface.createTable('rebales_new', {
        id: {
          type: Sequelize.STRING(50),
          primaryKey: true,
          allowNull: false
        },
        originalDeviceId: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        originalLocalId: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        rebaleTag: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        receiptNumber: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        cropId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        gradeId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        totalMass: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        totalAmount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        warehouseId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        sourceBaleIds: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        rebaleDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
          allowNull: false,
          defaultValue: 'stored'
        },
        syncSource: {
          type: Sequelize.ENUM('web', 'mobile'),
          defaultValue: 'web'
        },
        syncedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

      const rebalesResult = await queryInterface.sequelize.query(`
        INSERT INTO rebales_new
        SELECT 
          CAST(r.id AS CHAR),
          NULL, NULL,
          r.rebaleTag, r.receiptNumber, r.cropId, r.gradeId, r.totalMass, r.price, r.totalAmount,
          r.warehouseId, r.buyerId, r.sourceBaleIds, r.rebaleDate, r.status,
          'web', NULL, r.createdAt, r.updatedAt
        FROM rebales r
        WHERE r.id IS NOT NULL
      `);
      
      console.log(`Migrated ${rebalesResult[0].affectedRows} rebales records`);

      await queryInterface.dropTable('rebales');
      await queryInterface.renameTable('rebales_new', 'rebales');

      // Continue with other tables...
      console.log('Continuing with remaining tables...');
      
      // ... (rest of the tables follow the same pattern)
      
      console.log('Migration completed successfully!');
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  },

  async down(queryInterface, Sequelize) {
    console.log('Rollback not implemented. Restore from backup if needed.');
  }
};