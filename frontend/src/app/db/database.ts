import type {
  Location,
  Warehouse,
  User,
  Loan,
  Farmer,
  FarmerLoan,
  Crop,
  Grade,
  CropGradePrice,
  Purchase,
  Bale,
  Rebale,
  Transport,
  LoanDeduction,
  Settings,
  AuditLog,
  Notification,
  PurchaseWithDetails,
  BaleWithDetails,
  Role,
} from '../types';
import * as mockData from './mockData';

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
const generateId = (prefix: string) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to get current timestamp
const now = () => new Date().toISOString();

// Database API
export const db = {
  // Locations
  locations: {
    findAll: () => Promise.resolve([...locations]),
    findById: (id: string) => Promise.resolve(locations.find((l) => l.id === id)),
    findByType: (type: string) => Promise.resolve(locations.filter((l) => l.type === type)),
    findByParent: (parentId: string) => Promise.resolve(locations.filter((l) => l.parentId === parentId)),
    create: (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
      const location: Location = {
        ...data,
        id: generateId('loc'),
        createdAt: now(),
        updatedAt: now(),
      };
      locations.push(location);
      return Promise.resolve(location);
    },
    update: (id: string, data: Partial<Location>) => {
      const index = locations.findIndex((l) => l.id === id);
      if (index === -1) return Promise.reject(new Error('Location not found'));
      locations[index] = { ...locations[index], ...data, updatedAt: now() };
      return Promise.resolve(locations[index]);
    },
    delete: (id: string) => {
      locations = locations.filter((l) => l.id !== id);
      return Promise.resolve();
    },
  },

  // Warehouses
  warehouses: {
    findAll: () => Promise.resolve([...warehouses]),
    findById: (id: string) => Promise.resolve(warehouses.find((w) => w.id === id)),
    findByLocation: (locationId: string) => Promise.resolve(warehouses.filter((w) => w.locationId === locationId)),
    create: (data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => {
      const warehouse: Warehouse = {
        ...data,
        id: generateId('wh'),
        createdAt: now(),
        updatedAt: now(),
      };
      warehouses.push(warehouse);
      return Promise.resolve(warehouse);
    },
    update: (id: string, data: Partial<Warehouse>) => {
      const index = warehouses.findIndex((w) => w.id === id);
      if (index === -1) return Promise.reject(new Error('Warehouse not found'));
      warehouses[index] = { ...warehouses[index], ...data, updatedAt: now() };
      return Promise.resolve(warehouses[index]);
    },
    delete: (id: string) => {
      warehouses = warehouses.filter((w) => w.id !== id);
      return Promise.resolve();
    },
  },

  // Users
  users: {
    findAll: () => Promise.resolve([...users]),
    findById: (id: string) => Promise.resolve(users.find((u) => u.id === id)),
    findByEmail: (email: string) => Promise.resolve(users.find((u) => u.email === email)),
    findByRole: (role: string) => Promise.resolve(users.filter((u) => u.role === role)),
    create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const user: User = {
        ...data,
        id: generateId('user'),
        createdAt: now(),
        updatedAt: now(),
      };
      users.push(user);
      return Promise.resolve(user);
    },
    update: (id: string, data: Partial<User>) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return Promise.reject(new Error('User not found'));
      users[index] = { ...users[index], ...data, updatedAt: now() };
      return Promise.resolve(users[index]);
    },
    delete: (id: string) => {
      users = users.filter((u) => u.id !== id);
      return Promise.resolve();
    },
  },

  // Helper to get all child location IDs
  _getAllChildLocationIds: (locationId: string): string[] => {
    const result = [locationId];
    const children = locations.filter((l) => l.parentId === locationId);
    children.forEach((child) => {
      result.push(...db._getAllChildLocationIds(child.id));
    });
    return result;
  },

  // Farmers
  farmers: {
    findAll: () => Promise.resolve([...farmers]),
    findById: (id: string) => Promise.resolve(farmers.find((f) => f.id === id)),
    findByCode: (code: string) => Promise.resolve(farmers.find((f) => f.code === code)),
    findByLocation: (locationId: string, includeChildren = true) => {
      if (includeChildren) {
        const locationIds = db._getAllChildLocationIds(locationId);
        return Promise.resolve(farmers.filter((f) => locationIds.includes(f.locationId)));
      }
      return Promise.resolve(farmers.filter((f) => f.locationId === locationId));
    },
    search: (query: string, locationId?: string) => {
      const lowerQuery = query.toLowerCase();
      let filtered = farmers.filter(
        (f) =>
          f.firstName.toLowerCase().includes(lowerQuery) ||
          f.lastName.toLowerCase().includes(lowerQuery) ||
          f.code.toLowerCase().includes(lowerQuery)
      );

      // Filter by location if provided
      if (locationId) {
        const locationIds = db._getAllChildLocationIds(locationId);
        filtered = filtered.filter((f) => locationIds.includes(f.locationId));
      }

      return Promise.resolve(filtered);
    },
    create: (data: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>) => {
      const farmer: Farmer = {
        ...data,
        id: generateId('farmer'),
        createdAt: now(),
        updatedAt: now(),
      };
      farmers.push(farmer);
      return Promise.resolve(farmer);
    },
    update: (id: string, data: Partial<Farmer>) => {
      const index = farmers.findIndex((f) => f.id === id);
      if (index === -1) return Promise.reject(new Error('Farmer not found'));
      farmers[index] = { ...farmers[index], ...data, updatedAt: now() };
      return Promise.resolve(farmers[index]);
    },
    delete: (id: string) => {
      farmers = farmers.filter((f) => f.id !== id);
      return Promise.resolve();
    },
  },

  // Crops
  crops: {
    findAll: () => Promise.resolve([...crops]),
    findById: (id: string) => Promise.resolve(crops.find((c) => c.id === id)),
    create: (data: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => {
      const crop: Crop = {
        ...data,
        id: generateId('crop'),
        createdAt: now(),
        updatedAt: now(),
      };
      crops.push(crop);
      return Promise.resolve(crop);
    },
    update: (id: string, data: Partial<Crop>) => {
      const index = crops.findIndex((c) => c.id === id);
      if (index === -1) return Promise.reject(new Error('Crop not found'));
      crops[index] = { ...crops[index], ...data, updatedAt: now() };
      return Promise.resolve(crops[index]);
    },
    delete: (id: string) => {
      crops = crops.filter((c) => c.id !== id);
      return Promise.resolve();
    },
  },

  // Grades
  grades: {
    findAll: () => Promise.resolve([...grades]),
    findById: (id: string) => Promise.resolve(grades.find((g) => g.id === id)),
    create: (data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) => {
      const grade: Grade = {
        ...data,
        id: generateId('grade'),
        createdAt: now(),
        updatedAt: now(),
      };
      grades.push(grade);
      return Promise.resolve(grade);
    },
    update: (id: string, data: Partial<Grade>) => {
      const index = grades.findIndex((g) => g.id === id);
      if (index === -1) return Promise.reject(new Error('Grade not found'));
      grades[index] = { ...grades[index], ...data, updatedAt: now() };
      return Promise.resolve(grades[index]);
    },
    delete: (id: string) => {
      grades = grades.filter((g) => g.id !== id);
      return Promise.resolve();
    },
  },

  // Crop Grade Prices
  cropGradePrices: {
    findAll: () => Promise.resolve([...cropGradePrices]),
    findById: (id: string) => Promise.resolve(cropGradePrices.find((p) => p.id === id)),
    findByCropAndGrade: (cropId: string, gradeId: string) =>
      Promise.resolve(cropGradePrices.find((p) => p.cropId === cropId && p.gradeId === gradeId)),
    search: (query: string) => {
      const lowerQuery = query.toLowerCase();
      const matchedPrices = cropGradePrices.filter((p) => {
        const crop = crops.find((c) => c.id === p.cropId);
        const grade = grades.find((g) => g.id === p.gradeId);
        return (
          crop?.name.toLowerCase().includes(lowerQuery) ||
          grade?.name.toLowerCase().includes(lowerQuery) ||
          p.price.toString().includes(query)
        );
      });
      return Promise.resolve(matchedPrices);
    },
    create: (data: Omit<CropGradePrice, 'id' | 'createdAt' | 'updatedAt'>) => {
      const price: CropGradePrice = {
        ...data,
        id: generateId('cgp'),
        createdAt: now(),
        updatedAt: now(),
      };
      cropGradePrices.push(price);
      return Promise.resolve(price);
    },
    update: (id: string, data: Partial<CropGradePrice>) => {
      const index = cropGradePrices.findIndex((p) => p.id === id);
      if (index === -1) return Promise.reject(new Error('Price not found'));
      cropGradePrices[index] = { ...cropGradePrices[index], ...data, updatedAt: now() };
      return Promise.resolve(cropGradePrices[index]);
    },
    delete: (id: string) => {
      cropGradePrices = cropGradePrices.filter((p) => p.id !== id);
      return Promise.resolve();
    },
  },

  // Bales
  bales: {
    findAll: () => Promise.resolve([...bales]),
    findById: (id: string) => Promise.resolve(bales.find((b) => b.id === id)),
    findByTag: (tag: string) => Promise.resolve(bales.find((b) => b.baleTag === tag)),
    findByPurchase: (purchaseId: string) => Promise.resolve(bales.filter((b) => b.purchaseId === purchaseId)),
    findPending: () => Promise.resolve(bales.filter((b) => b.status === 'pending')),
    create: (data: Omit<Bale, 'id' | 'createdAt' | 'updatedAt'>) => {
      const bale: Bale = {
        ...data,
        id: generateId('bale'),
        createdAt: now(),
        updatedAt: now(),
      };
      bales.push(bale);
      return Promise.resolve(bale);
    },
    update: (id: string, data: Partial<Bale>) => {
      const index = bales.findIndex((b) => b.id === id);
      if (index === -1) return Promise.reject(new Error('Bale not found'));
      bales[index] = { ...bales[index], ...data, updatedAt: now() };
      return Promise.resolve(bales[index]);
    },
    delete: (id: string) => {
      bales = bales.filter((b) => b.id !== id);
      return Promise.resolve();
    },
  },

  // Purchases
  purchases: {
    findAll: () => Promise.resolve([...purchases]),
    findById: (id: string) => Promise.resolve(purchases.find((p) => p.id === id)),
    findWithDetails: async (id: string): Promise<PurchaseWithDetails | undefined> => {
      const purchase = purchases.find((p) => p.id === id);
      if (!purchase) return undefined;

      const farmer = farmers.find((f) => f.id === purchase.farmerId);
      const buyer = users.find((u) => u.id === purchase.buyerId);
      const clerk = purchase.clerkId ? users.find((u) => u.id === purchase.clerkId) : undefined;
      const warehouse = warehouses.find((w) => w.id === purchase.warehouseId);
      const purchaseBales = bales.filter((b) => b.purchaseId === purchase.id);

      const balesWithDetails: BaleWithDetails[] = purchaseBales.map((bale) => ({
        ...bale,
        crop: crops.find((c) => c.id === bale.cropId)!,
        grade: grades.find((g) => g.id === bale.gradeId)!,
        warehouse: warehouse!,
      }));

      return {
        ...purchase,
        farmer: farmer!,
        buyer: buyer!,
        clerk,
        warehouse: warehouse!,
        bales: balesWithDetails,
      };
    },
    create: (data: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>) => {
      const purchase: Purchase = {
        ...data,
        id: generateId('purch'),
        createdAt: now(),
        updatedAt: now(),
      };
      purchases.push(purchase);
      return Promise.resolve(purchase);
    },
    update: (id: string, data: Partial<Purchase>) => {
      const index = purchases.findIndex((p) => p.id === id);
      if (index === -1) return Promise.reject(new Error('Purchase not found'));
      purchases[index] = { ...purchases[index], ...data, updatedAt: now() };
      return Promise.resolve(purchases[index]);
    },
  },

  // Rebales
  rebales: {
    findAll: () => Promise.resolve([...rebales]),
    findById: (id: string) => Promise.resolve(rebales.find((r) => r.id === id)),
    findByTag: (tag: string) => Promise.resolve(rebales.find((r) => r.rebaleTag === tag)),
    findByStatus: (status: string) => Promise.resolve(rebales.filter((r) => r.status === status)),
    create: (data: Omit<Rebale, 'id' | 'createdAt' | 'updatedAt'>) => {
      const rebale: Rebale = {
        ...data,
        id: generateId('rebale'),
        createdAt: now(),
        updatedAt: now(),
      };
      rebales.push(rebale);
      return Promise.resolve(rebale);
    },
    update: (id: string, data: Partial<Rebale>) => {
      const index = rebales.findIndex((r) => r.id === id);
      if (index === -1) return Promise.reject(new Error('Rebale not found'));
      rebales[index] = { ...rebales[index], ...data, updatedAt: now() };
      return Promise.resolve(rebales[index]);
    },
  },

  // Transports
  transports: {
    findAll: () => Promise.resolve([...transports]),
    findById: (id: string) => Promise.resolve(transports.find((t) => t.id === id)),
    create: (data: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>) => {
      const transport: Transport = {
        ...data,
        id: generateId('trans'),
        createdAt: now(),
        updatedAt: now(),
      };
      transports.push(transport);
      return Promise.resolve(transport);
    },
  },

  // Loans
  loans: {
    findAll: () => Promise.resolve([...loans]),
    findById: (id: string) => Promise.resolve(loans.find((l) => l.id === id)),
    create: (data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => {
      const loan: Loan = {
        ...data,
        id: generateId('loan'),
        createdAt: now(),
        updatedAt: now(),
      };
      loans.push(loan);
      return Promise.resolve(loan);
    },
    update: (id: string, data: Partial<Loan>) => {
      const index = loans.findIndex((l) => l.id === id);
      if (index === -1) return Promise.reject(new Error('Loan not found'));
      loans[index] = { ...loans[index], ...data, updatedAt: now() };
      return Promise.resolve(loans[index]);
    },
  },

  // Farmer Loans
  farmerLoans: {
    findAll: () => Promise.resolve([...farmerLoans]),
    findByFarmer: (farmerId: string) => Promise.resolve(farmerLoans.filter((fl) => fl.farmerId === farmerId)),
    create: (data: Omit<FarmerLoan, 'id' | 'createdAt' | 'updatedAt'>) => {
      const farmerLoan: FarmerLoan = {
        ...data,
        id: generateId('fl'),
        createdAt: now(),
        updatedAt: now(),
      };
      farmerLoans.push(farmerLoan);
      return Promise.resolve(farmerLoan);
    },
    update: (id: string, data: Partial<FarmerLoan>) => {
      const index = farmerLoans.findIndex((fl) => fl.id === id);
      if (index === -1) return Promise.reject(new Error('Farmer loan not found'));
      farmerLoans[index] = { ...farmerLoans[index], ...data, updatedAt: now() };
      return Promise.resolve(farmerLoans[index]);
    },
  },

  // Loan Deductions
  loanDeductions: {
    findAll: () => Promise.resolve([...loanDeductions]),
    findByPurchase: (purchaseId: string) => Promise.resolve(loanDeductions.filter((ld) => ld.purchaseId === purchaseId)),
    create: (data: Omit<LoanDeduction, 'id' | 'createdAt' | 'updatedAt'>) => {
      const deduction: LoanDeduction = {
        ...data,
        id: generateId('ld'),
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
    update: (data: Partial<Settings>) => {
      settings = { ...settings, ...data, updatedAt: now() };
      return Promise.resolve(settings);
    },
  },

  // Audit Logs
  auditLogs: {
    findAll: () => Promise.resolve([...auditLogs]),
    create: (data: Omit<AuditLog, 'id' | 'createdAt'>) => {
      const log: AuditLog = {
        ...data,
        id: generateId('log'),
        createdAt: now(),
      };
      auditLogs.push(log);
      return Promise.resolve(log);
    },
  },

  // Notifications
  notifications: {
    findAll: () => Promise.resolve([...notifications]),
    findByUser: (userId: string) => Promise.resolve(notifications.filter((n) => n.userId === userId)),
    findUnread: (userId: string) => Promise.resolve(notifications.filter((n) => n.userId === userId && !n.isRead)),
    create: (data: Omit<Notification, 'id' | 'createdAt'>) => {
      const notification: Notification = {
        ...data,
        id: generateId('notif'),
        createdAt: now(),
      };
      notifications.push(notification);
      return Promise.resolve(notification);
    },
    markAsRead: (id: string) => {
      const index = notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        notifications[index] = { ...notifications[index], isRead: true };
      }
      return Promise.resolve();
    },
  },

  // Roles
  roles: {
    findAll: () => Promise.resolve([...roles]),
    findById: (id: string) => Promise.resolve(roles.find((r) => r.id === id) || null),
    create: (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
      const role: Role = {
        ...data,
        id: generateId('role'),
        createdAt: now(),
        updatedAt: now(),
      };
      roles.push(role);
      return Promise.resolve(role);
    },
    update: (id: string, data: Partial<Omit<Role, 'id' | 'createdAt'>>) => {
      const index = roles.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Role not found');
      roles[index] = { ...roles[index], ...data, updatedAt: now() };
      return Promise.resolve(roles[index]);
    },
    delete: (id: string) => {
      const index = roles.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Role not found');
      roles.splice(index, 1);
      return Promise.resolve();
    },
  },
};
