// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.bulkInsert('roles', [
//       {
//         id: 1,
//         name: 'Administrator',
//         code: 'ADMIN',
//         description: 'Full system access with all permissions',
//         permissions: ['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'loans.assign', 'loans.view', 'farmers.create', 'farmers.view', 'farmers.edit', 'reports.view', 'reports.export', 'receipts.view', 'receipts.print', 'master-data.view', 'master-data.edit', 'settings.view', 'settings.edit'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//       {
//         id: 2,
//         name: 'Buyer',
//         code: 'BUYER',
//         description: 'Authorized to purchase crops from farmers',
//         permissions: ['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'receipts.view', 'receipts.print'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//       {
//         id: 3,
//         name: 'Extension Officer',
//         code: 'OFFICER',
//         description: 'Field officers who assign loans to farmers',
//         permissions: ['dashboard.view', 'loans.assign', 'loans.view', 'farmers.view', 'reports.view', 'receipts.view', 'receipts.print'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//       {
//         id: 4,
//         name: 'Data Clerk',
//         code: 'CLERK',
//         description: 'Data entry and record keeping',
//         permissions: ['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'receipts.view', 'receipts.print'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//       {
//         id: 5,
//         name: 'Manager',
//         code: 'MANAGER',
//         description: 'Management with reporting and oversight access',
//         permissions: ['dashboard.view', 'reports.view', 'reports.export', 'receipts.view', 'master-data.view', 'settings.view'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//       {
//         id: 6,
//         name: 'IT Support',
//         code: 'IT',
//         description: 'IT department with technical access',
//         permissions: ['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'loans.assign', 'loans.view', 'farmers.create', 'farmers.view', 'farmers.edit', 'reports.view', 'reports.export', 'receipts.view', 'receipts.print', 'master-data.view', 'master-data.edit', 'settings.view', 'settings.edit'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//       {
//         id: 7,
//         name: 'Developer',
//         code: 'DEV',
//         description: 'Mobile app developer with database access',
//         permissions: ['dashboard.view', 'buying.view', 'rebale.view', 'transport.view', 'loans.view', 'farmers.view', 'reports.view', 'receipts.view'],
//         isActive: true,
//         createdAt: new Date('2026-01-01'),
//         updatedAt: new Date('2026-01-01'),
//       },
//     ], {});
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete('roles', null, {});
//   }
// };
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'Administrator',
        code: 'ADMIN',
        description: 'Full system access with all permissions',
        permissions: JSON.stringify(['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'loans.assign', 'loans.view', 'farmers.create', 'farmers.view', 'farmers.edit', 'reports.view', 'reports.export', 'receipts.view', 'receipts.print', 'master-data.view', 'master-data.edit', 'settings.view', 'settings.edit']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 2,
        name: 'Buyer',
        code: 'BUYER',
        description: 'Authorized to purchase crops from farmers',
        permissions: JSON.stringify(['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'receipts.view', 'receipts.print']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 3,
        name: 'Extension Officer',
        code: 'OFFICER',
        description: 'Field officers who assign loans to farmers',
        permissions: JSON.stringify(['dashboard.view', 'loans.assign', 'loans.view', 'farmers.view', 'reports.view', 'receipts.view', 'receipts.print']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 4,
        name: 'Data Clerk',
        code: 'CLERK',
        description: 'Data entry and record keeping',
        permissions: JSON.stringify(['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'receipts.view', 'receipts.print']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 5,
        name: 'Manager',
        code: 'MANAGER',
        description: 'Management with reporting and oversight access',
        permissions: JSON.stringify(['dashboard.view', 'reports.view', 'reports.export', 'receipts.view', 'master-data.view', 'settings.view']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 6,
        name: 'IT Support',
        code: 'IT',
        description: 'IT department with technical access',
        permissions: JSON.stringify(['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'loans.assign', 'loans.view', 'farmers.create', 'farmers.view', 'farmers.edit', 'reports.view', 'reports.export', 'receipts.view', 'receipts.print', 'master-data.view', 'master-data.edit', 'settings.view', 'settings.edit']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 7,
        name: 'Developer',
        code: 'DEV',
        description: 'Mobile app developer with database access',
        permissions: JSON.stringify(['dashboard.view', 'buying.view', 'rebale.view', 'transport.view', 'loans.view', 'farmers.view', 'reports.view', 'receipts.view']),
        isActive: true,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};