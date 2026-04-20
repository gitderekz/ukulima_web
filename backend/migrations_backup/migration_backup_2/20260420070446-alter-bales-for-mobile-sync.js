// // backend/migrations/XXXXX-alter-bales-for-mobile-sync.js
// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('bales_new', {
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
//       baleTag: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       purchaseId: {
//         type: Sequelize.STRING(50),
//         allowNull: false,
//         references: {
//           model: 'purchases',
//           key: 'id'
//         }
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
//       mass: {
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
//       status: {
//         type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
//         allowNull: false,
//         defaultValue: 'purchased'
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
//       INSERT INTO bales_new (
//         id, baleTag, purchaseId, cropId, gradeId, mass, price,
//         totalAmount, warehouseId, status, syncSource, createdAt, updatedAt
//       )
//       SELECT 
//         CAST(id AS CHAR),
//         baleTag,
//         CAST(purchaseId AS CHAR),
//         cropId, gradeId, mass, price,
//         totalAmount, warehouseId, status,
//         'web',
//         createdAt, updatedAt
//       FROM bales
//     `);

//     await queryInterface.dropTable('bales');
//     await queryInterface.renameTable('bales_new', 'bales');

//     await queryInterface.addIndex('bales', ['originalDeviceId', 'originalLocalId']);
//     await queryInterface.addIndex('bales', ['purchaseId']);
//     await queryInterface.addIndex('bales', ['syncSource']);
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.createTable('bales_old', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       baleTag: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true
//       },
//       purchaseId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'purchases',
//           key: 'id'
//         }
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
//       mass: {
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
//       status: {
//         type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
//         allowNull: false,
//         defaultValue: 'purchased'
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
//       INSERT INTO bales_old
//       SELECT 
//         CAST(id AS UNSIGNED),
//         baleTag,
//         CAST(purchaseId AS UNSIGNED),
//         cropId, gradeId, mass, price,
//         totalAmount, warehouseId, status,
//         createdAt, updatedAt
//       FROM bales
//       WHERE id REGEXP '^[0-9]+$'
//     `);

//     await queryInterface.dropTable('bales');
//     await queryInterface.renameTable('bales_old', 'bales');
//   }
// };
// backend/migrations/20260420070007-alter-bales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
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
          allowNull: false,
          references: {
            model: 'purchases',
            key: 'id'
          }
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
          allowNull: false,
          references: {
            model: 'warehouses',
            key: 'id'
          }
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

      await queryInterface.sequelize.query(`
        INSERT INTO bales_new (
          id, baleTag, purchaseId, cropId, gradeId, mass, price,
          totalAmount, warehouseId, status, syncSource, createdAt, updatedAt
        )
        SELECT 
          CAST(id AS CHAR),
          baleTag,
          CAST(purchaseId AS CHAR),
          cropId, gradeId, mass, price,
          totalAmount, warehouseId, status,
          'web',
          createdAt, updatedAt
        FROM bales
      `);

      await queryInterface.dropTable('bales');
      await queryInterface.renameTable('bales_new', 'bales');

      await queryInterface.addIndex('bales', ['originalDeviceId', 'originalLocalId'], {
        name: 'idx_bales_device_local'
      });
      await queryInterface.addIndex('bales', ['purchaseId'], {
        name: 'idx_bales_purchase'
      });
      await queryInterface.addIndex('bales', ['syncSource'], {
        name: 'idx_bales_sync_source'
      });
      
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
      await queryInterface.createTable('bales_old', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        baleTag: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        purchaseId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'purchases',
            key: 'id'
          }
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
          allowNull: false,
          references: {
            model: 'warehouses',
            key: 'id'
          }
        },
        status: {
          type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
          allowNull: false,
          defaultValue: 'purchased'
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
        INSERT INTO bales_old
        SELECT 
          CAST(id AS UNSIGNED),
          baleTag,
          CAST(purchaseId AS UNSIGNED),
          cropId, gradeId, mass, price,
          totalAmount, warehouseId, status,
          createdAt, updatedAt
        FROM bales
        WHERE id REGEXP '^[0-9]+$'
      `);

      await queryInterface.dropTable('bales');
      await queryInterface.renameTable('bales_old', 'bales');
      
    } finally {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }
};