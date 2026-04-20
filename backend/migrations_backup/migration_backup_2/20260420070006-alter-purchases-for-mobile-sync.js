// // backend/migrations/XXXXX-alter-purchases-for-mobile-sync.js
// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Create new table with string ID
//     await queryInterface.createTable('purchases_new', {
//       id: {
//         type: Sequelize.STRING(50),
//         primaryKey: true,
//         allowNull: false
//       },
//       originalDeviceId: {
//         type: Sequelize.STRING(20),
//         allowNull: true
//       },
//       originalLocalId: {
//         type: Sequelize.INTEGER,
//         allowNull: true
//       },
//       receiptNumber: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       farmerId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'farmers',
//           key: 'id'
//         }
//       },
//       buyerId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users',
//           key: 'id'
//         }
//       },
//       clerkId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users',
//           key: 'id'
//         }
//       },
//       warehouseId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'warehouses',
//           key: 'id'
//         }
//       },
//       totalMass: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       totalAmount: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       loanDeducted: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0
//       },
//       amountPaid: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       purchaseDate: {
//         type: Sequelize.DATEONLY,
//         allowNull: false
//       },
//       syncSource: {
//         type: Sequelize.ENUM('web', 'mobile'),
//         defaultValue: 'web'
//       },
//       syncedAt: {
//         type: Sequelize.DATE,
//         allowNull: true
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });

//     // Copy data from old table to new table
//     await queryInterface.sequelize.query(`
//       INSERT INTO purchases_new (
//         id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
//         totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
//         syncSource, createdAt, updatedAt
//       )
//       SELECT 
//         CAST(id AS CHAR),
//         receiptNumber,
//         farmerId, buyerId, clerkId, warehouseId,
//         totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
//         'web',
//         createdAt, updatedAt
//       FROM purchases
//     `);

//     // Drop old table and rename new one
//     await queryInterface.dropTable('purchases');
//     await queryInterface.renameTable('purchases_new', 'purchases');

//     // Add indexes
//     await queryInterface.addIndex('purchases', ['originalDeviceId', 'originalLocalId']);
//     await queryInterface.addIndex('purchases', ['syncSource']);
//     await queryInterface.addIndex('purchases', ['syncedAt']);
//   },

//   async down(queryInterface, Sequelize) {
//     // Revert back to INTEGER ID
//     await queryInterface.createTable('purchases_old', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       receiptNumber: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       farmerId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'farmers',
//           key: 'id'
//         }
//       },
//       buyerId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users',
//           key: 'id'
//         }
//       },
//       clerkId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users',
//           key: 'id'
//         }
//       },
//       warehouseId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'warehouses',
//           key: 'id'
//         }
//       },
//       totalMass: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       totalAmount: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       loanDeducted: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0
//       },
//       amountPaid: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       purchaseDate: {
//         type: Sequelize.DATEONLY,
//         allowNull: false
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });

//     await queryInterface.sequelize.query(`
//       INSERT INTO purchases_old (
//         id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
//         totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
//         createdAt, updatedAt
//       )
//       SELECT 
//         CAST(id AS UNSIGNED),
//         receiptNumber,
//         farmerId, buyerId, clerkId, warehouseId,
//         totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
//         createdAt, updatedAt
//       FROM purchases
//       WHERE id REGEXP '^[0-9]+$'
//     `);

//     await queryInterface.dropTable('purchases');
//     await queryInterface.renameTable('purchases_old', 'purchases');
//   }
// };
// backend/migrations/20260420070006-alter-purchases-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Temporarily disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
      // Create new table with string ID
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
          allowNull: false,
          references: {
            model: 'farmers',
            key: 'id'
          }
        },
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        clerkId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        warehouseId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'warehouses',
            key: 'id'
          }
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

      // Copy data from old table to new table
      await queryInterface.sequelize.query(`
        INSERT INTO purchases_new (
          id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
          totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
          syncSource, createdAt, updatedAt
        )
        SELECT 
          CAST(id AS CHAR),
          receiptNumber,
          farmerId, buyerId, clerkId, warehouseId,
          totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
          'web',
          createdAt, updatedAt
        FROM purchases
      `);

      // Drop old table (foreign key check is disabled so this works)
      await queryInterface.dropTable('purchases');
      
      // Rename new table
      await queryInterface.renameTable('purchases_new', 'purchases');

      // Add indexes
      await queryInterface.addIndex('purchases', ['originalDeviceId', 'originalLocalId'], {
        name: 'idx_purchases_device_local'
      });
      await queryInterface.addIndex('purchases', ['syncSource'], {
        name: 'idx_purchases_sync_source'
      });
      await queryInterface.addIndex('purchases', ['syncedAt'], {
        name: 'idx_purchases_synced_at'
      });
      
    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
      await queryInterface.createTable('purchases_old', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        receiptNumber: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        farmerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'farmers',
            key: 'id'
          }
        },
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        clerkId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        warehouseId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'warehouses',
            key: 'id'
          }
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
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

      await queryInterface.sequelize.query(`
        INSERT INTO purchases_old (
          id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
          totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
          createdAt, updatedAt
        )
        SELECT 
          CAST(id AS UNSIGNED),
          receiptNumber,
          farmerId, buyerId, clerkId, warehouseId,
          totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
          createdAt, updatedAt
        FROM purchases
        WHERE id REGEXP '^[0-9]+$'
      `);

      await queryInterface.dropTable('purchases');
      await queryInterface.renameTable('purchases_old', 'purchases');
      
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }
};