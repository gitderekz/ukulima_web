import * as mockData from './mockData.js';

// Clone data to avoid mutations
let locations = [...mockData.locations];
let warehouses = [...mockData.warehouses];
let users = [...mockData.users];
let roles = [...mockData.roles];
let loans = [...mockData.loans];
let farmers = [...mockData.farmers];
let farmerLoans = [...mockData.farmerLoans];
let crops = [...mockData.crops];
let grades = [...mockData.grades];
let cropGradePrices = [...mockData.cropGradePrices];
let purchases = [...mockData.purchases];
let bales = [...mockData.bales];
let rebales = [...mockData.rebales];
let transports = [...mockData.transports];
let loanDeductions = [...mockData.loanDeductions];
let settings = { ...mockData.settings };
let auditLogs = [...mockData.auditLogs];
let notifications = [...mockData.notifications];

// Helper to generate IDs
const generateId = (prefix) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to get current timestamp
const now = () => new Date().toISOString();

// Helper to get all child location IDs (recursive)
const getAllChildLocationIds = (locationId) => {
  const result = [locationId];
  const children = locations.filter((l) => l.parentId === locationId);
  children.forEach((child) => {
    result.push(...getAllChildLocationIds(child.id));
  });
  return result;
};

// Database API
export const db = {
  // Helper function
  _getAllChildLocationIds: getAllChildLocationIds,

  // Locations
  locations: {
    findAll: () => Promise.resolve([...locations]),
    findById: (id) => Promise.resolve(locations.find((l) => l.id === id) || null),
    findByParentId: (parentId) => Promise.resolve(locations.filter((l) => l.parentId === parentId)),
  },

  // Warehouses
  warehouses: {
    findAll: () => Promise.resolve([...warehouses]),
    findById: (id) => Promise.resolve(warehouses.find((w) => w.id === id) || null),
    findByLocationId: (locationId) => Promise.resolve(warehouses.filter((w) => w.locationId === locationId)),
  },

  // Users
  users: {
    findAll: () => Promise.resolve([...users]),
    findById: (id) => Promise.resolve(users.find((u) => u.id === id) || null),
    findByEmail: (email) => Promise.resolve(users.find((u) => u.email === email) || null),
    create: (data) => {
      const user = {
        ...data,
        id: generateId('user'),
        createdAt: now(),
        updatedAt: now(),
      };
      users.push(user);
      return Promise.resolve(user);
    },
    update: (id, data) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('User not found');
      users[index] = { ...users[index], ...data, updatedAt: now() };
      return Promise.resolve(users[index]);
    },
  },

  // Roles
  roles: {
    findAll: () => Promise.resolve([...roles]),
    findById: (id) => Promise.resolve(roles.find((r) => r.id === id) || null),
    create: (data) => {
      const role = {
        ...data,
        id: generateId('role'),
        createdAt: now(),
        updatedAt: now(),
      };
      roles.push(role);
      return Promise.resolve(role);
    },
    update: (id, data) => {
      const index = roles.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Role not found');
      roles[index] = { ...roles[index], ...data, updatedAt: now() };
      return Promise.resolve(roles[index]);
    },
    delete: (id) => {
      const index = roles.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Role not found');
      roles.splice(index, 1);
      return Promise.resolve();
    },
  },

  // Crops
  crops: {
    findAll: () => Promise.resolve([...crops]),
    findById: (id) => Promise.resolve(crops.find((c) => c.id === id) || null),
  },

  // Grades
  grades: {
    findAll: () => Promise.resolve([...grades]),
    findById: (id) => Promise.resolve(grades.find((g) => g.id === id) || null),
  },

  // Crop Grade Prices
  cropGradePrices: {
    findAll: () => Promise.resolve([...cropGradePrices]),
    findByCropAndGrade: (cropId, gradeId) => {
      const prices = cropGradePrices
        .filter((p) => p.cropId === cropId && p.gradeId === gradeId)
        .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
      return Promise.resolve(prices[0] || null);
    },
  },

  // Loans
  loans: {
    findAll: () => Promise.resolve([...loans]),
    findById: (id) => Promise.resolve(loans.find((l) => l.id === id) || null),
  },

  // Farmers
  farmers: {
    findAll: () => Promise.resolve([...farmers]),
    findById: (id) => Promise.resolve(farmers.find((f) => f.id === id) || null),
    search: (query, locationId = null) => {
      let results = farmers.filter((f) =>
        f.firstName.toLowerCase().includes(query.toLowerCase()) ||
        f.lastName.toLowerCase().includes(query.toLowerCase()) ||
        f.code.toLowerCase().includes(query.toLowerCase())
      );

      if (locationId) {
        const validLocationIds = getAllChildLocationIds(locationId);
        results = results.filter((f) => validLocationIds.includes(f.locationId));
      }

      return Promise.resolve(results);
    },
    create: (data) => {
      const farmer = {
        ...data,
        id: generateId('farmer'),
        createdAt: now(),
        updatedAt: now(),
      };
      farmers.push(farmer);
      return Promise.resolve(farmer);
    },
    update: (id, data) => {
      const index = farmers.findIndex((f) => f.id === id);
      if (index === -1) throw new Error('Farmer not found');
      farmers[index] = { ...farmers[index], ...data, updatedAt: now() };
      return Promise.resolve(farmers[index]);
    },
  },

  // Farmer Loans
  farmerLoans: {
    findAll: () => Promise.resolve([...farmerLoans]),
    findByFarmerId: (farmerId) => Promise.resolve(farmerLoans.filter((fl) => fl.farmerId === farmerId)),
    create: (data) => {
      const farmerLoan = {
        ...data,
        id: generateId('fl'),
        createdAt: now(),
        updatedAt: now(),
      };
      farmerLoans.push(farmerLoan);
      return Promise.resolve(farmerLoan);
    },
    bulkCreate: (dataArray) => {
      const created = dataArray.map((data) => {
        const farmerLoan = {
          ...data,
          id: generateId('fl'),
          createdAt: now(),
          updatedAt: now(),
        };
        farmerLoans.push(farmerLoan);
        return farmerLoan;
      });
      return Promise.resolve(created);
    },
  },

  // Purchases
  purchases: {
    findAll: () => Promise.resolve([...purchases]),
    findById: (id) => Promise.resolve(purchases.find((p) => p.id === id) || null),
    create: (data) => {
      const purchase = {
        ...data,
        id: generateId('purch'),
        createdAt: now(),
        updatedAt: now(),
      };
      purchases.push(purchase);
      return Promise.resolve(purchase);
    },
    bulkCreate: (dataArray) => {
      const created = dataArray.map((data) => {
        const purchase = {
          ...data,
          createdAt: now(),
          updatedAt: now(),
        };
        purchases.push(purchase);
        return purchase;
      });
      return Promise.resolve(created);
    },
  },

  // Bales
  bales: {
    findAll: () => Promise.resolve([...bales]),
    findById: (id) => Promise.resolve(bales.find((b) => b.id === id) || null),
    findByPurchaseId: (purchaseId) => Promise.resolve(bales.filter((b) => b.purchaseId === purchaseId)),
    create: (data) => {
      const bale = {
        ...data,
        id: generateId('bale'),
        createdAt: now(),
        updatedAt: now(),
      };
      bales.push(bale);
      return Promise.resolve(bale);
    },
    bulkCreate: (dataArray) => {
      const created = dataArray.map((data) => {
        const bale = {
          ...data,
          createdAt: now(),
          updatedAt: now(),
        };
        bales.push(bale);
        return bale;
      });
      return Promise.resolve(created);
    },
  },

  // Rebales
  rebales: {
    findAll: () => Promise.resolve([...rebales]),
    findById: (id) => Promise.resolve(rebales.find((r) => r.id === id) || null),
    create: (data) => {
      const rebale = {
        ...data,
        id: generateId('rebale'),
        createdAt: now(),
        updatedAt: now(),
      };
      rebales.push(rebale);
      return Promise.resolve(rebale);
    },
    bulkCreate: (dataArray) => {
      const created = dataArray.map((data) => {
        const rebale = {
          ...data,
          createdAt: now(),
          updatedAt: now(),
        };
        rebales.push(rebale);
        return rebale;
      });
      return Promise.resolve(created);
    },
  },

  // Transports
  transports: {
    findAll: () => Promise.resolve([...transports]),
    findById: (id) => Promise.resolve(transports.find((t) => t.id === id) || null),
    create: (data) => {
      const transport = {
        ...data,
        id: generateId('trans'),
        createdAt: now(),
        updatedAt: now(),
      };
      transports.push(transport);
      return Promise.resolve(transport);
    },
    bulkCreate: (dataArray) => {
      const created = dataArray.map((data) => {
        const transport = {
          ...data,
          createdAt: now(),
          updatedAt: now(),
        };
        transports.push(transport);
        return transport;
      });
      return Promise.resolve(created);
    },
  },

  // Loan Deductions
  loanDeductions: {
    findAll: () => Promise.resolve([...loanDeductions]),
    create: (data) => {
      const deduction = {
        ...data,
        id: generateId('deduct'),
        createdAt: now(),
        updatedAt: now(),
      };
      loanDeductions.push(deduction);
      return Promise.resolve(deduction);
    },
  },

  // Settings
  settings: {
    get: () => Promise.resolve({ ...settings }),
    update: (data) => {
      settings = { ...settings, ...data, updatedAt: now() };
      return Promise.resolve(settings);
    },
  },

  // Audit Logs
  auditLogs: {
    findAll: () => Promise.resolve([...auditLogs]),
    create: (data) => {
      const log = {
        ...data,
        id: generateId('log'),
        createdAt: now(),
      };
      auditLogs.push(log);
      return Promise.resolve(log);
    },
  },
};

export default db;
