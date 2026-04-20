// // backend/migrations/XXXXX-alter-rebales-for-mobile-sync.js
// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('rebales_new', {
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
//       rebaleTag: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       receiptNumber: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       cropId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'crops',
//           key: 'id'
//         }
//       },
//       gradeId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'grades',
//           key: 'id'
//         }
//       },
//       totalMass: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       price: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       totalAmount: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       warehouseId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'warehouses',
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
//       sourceBaleIds: {
//         type: Sequelize.TEXT,
//         allowNull: true
//       },
//       rebaleDate: {
//         type: Sequelize.DATEONLY,
//         allowNull: false
//       },
//       status: {
//         type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
//         allowNull: false,
//         defaultValue: 'stored'
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

//     await queryInterface.sequelize.query(`
//       INSERT INTO rebales_new
//       SELECT 
//         CAST(id AS CHAR),
//         NULL, NULL,
//         rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
//         warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
//         'web', NULL, createdAt, updatedAt
//       FROM rebales
//     `);

//     await queryInterface.dropTable('rebales');
//     await queryInterface.renameTable('rebales_new', 'rebales');

//     await queryInterface.addIndex('rebales', ['originalDeviceId', 'originalLocalId']);
//     await queryInterface.addIndex('rebales', ['syncSource']);
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.createTable('rebales_old', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       rebaleTag: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       receiptNumber: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       cropId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'crops',
//           key: 'id'
//         }
//       },
//       gradeId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'grades',
//           key: 'id'
//         }
//       },
//       totalMass: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       price: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       totalAmount: {
//         type: Sequelize.DECIMAL(10, 2),
//         allowNull: false
//       },
//       warehouseId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'warehouses',
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
//       sourceBaleIds: {
//         type: Sequelize.TEXT,
//         allowNull: true
//       },
//       rebaleDate: {
//         type: Sequelize.DATEONLY,
//         allowNull: false
//       },
//       status: {
//         type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
//         allowNull: false,
//         defaultValue: 'stored'
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
//       INSERT INTO rebales_old
//       SELECT 
//         CAST(id AS UNSIGNED),
//         rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
//         warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
//         createdAt, updatedAt
//       FROM rebales
//       WHERE id REGEXP '^[0-9]+$'
//     `);

//     await queryInterface.dropTable('rebales');
//     await queryInterface.renameTable('rebales_old', 'rebales');
//   }
// };
// backend/migrations/20260420070008-alter-rebales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
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
          allowNull: false,
          references: {
            model: 'crops',
            key: 'id'
          }
        },
        gradeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'grades',
            key: 'id'
          }
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
          allowNull: false,
          references: {
            model: 'warehouses',
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

      await queryInterface.sequelize.query(`
        INSERT INTO rebales_new
        SELECT 
          CAST(id AS CHAR),
          NULL, NULL,
          rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
          warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
          'web', NULL, createdAt, updatedAt
        FROM rebales
      `);

      await queryInterface.dropTable('rebales');
      await queryInterface.renameTable('rebales_new', 'rebales');

      await queryInterface.addIndex('rebales', ['originalDeviceId', 'originalLocalId'], {
        name: 'idx_rebales_device_local'
      });
      await queryInterface.addIndex('rebales', ['syncSource'], {
        name: 'idx_rebales_sync_source'
      });
      
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
      await queryInterface.createTable('rebales_old', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
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
          allowNull: false,
          references: {
            model: 'crops',
            key: 'id'
          }
        },
        gradeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'grades',
            key: 'id'
          }
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
          allowNull: false,
          references: {
            model: 'warehouses',
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
        INSERT INTO rebales_old
        SELECT 
          CAST(id AS UNSIGNED),
          rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
          warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
          createdAt, updatedAt
        FROM rebales
        WHERE id REGEXP '^[0-9]+$'
      `);

      await queryInterface.dropTable('rebales');
      await queryInterface.renameTable('rebales_old', 'rebales');
      
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }
};