// Mock Data for Ukulima ERP System

// Locations (6-level hierarchy)
export const locations = [
  // Countries
  { id: 'loc-1', name: 'Tanzania', code: 'TZ', type: 'country', parentId: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Regions (under countries)
  { id: 'loc-2', name: 'Northern Region', code: 'NR', type: 'region', parentId: 'loc-1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-3', name: 'Central Region', code: 'CR', type: 'region', parentId: 'loc-1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-4', name: 'Southern Region', code: 'SR', type: 'region', parentId: 'loc-1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Zones (under regions)
  { id: 'loc-5', name: 'Kilimanjaro Zone', code: 'KZ', type: 'zone', parentId: 'loc-2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-6', name: 'Arusha Zone', code: 'AZ', type: 'zone', parentId: 'loc-2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-7', name: 'Dodoma Zone', code: 'DZ', type: 'zone', parentId: 'loc-3', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-8', name: 'Mbeya Zone', code: 'MZ', type: 'zone', parentId: 'loc-4', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Districts (under zones)
  { id: 'loc-9', name: 'Arusha District', code: 'AD', type: 'district', parentId: 'loc-6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-10', name: 'Meru District', code: 'MD', type: 'district', parentId: 'loc-6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-11', name: 'Moshi District', code: 'MSD', type: 'district', parentId: 'loc-5', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Wards (under districts)
  { id: 'loc-12', name: 'Kaloleni Ward', code: 'WD-001', type: 'ward', parentId: 'loc-9', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-13', name: 'Themi Ward', code: 'WD-002', type: 'ward', parentId: 'loc-9', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-14', name: 'Majengo Ward', code: 'WD-003', type: 'ward', parentId: 'loc-11', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Streets (under wards)
  { id: 'loc-15', name: 'Sokoine Street', code: 'ST-001', type: 'street', parentId: 'loc-12', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-16', name: 'Makongoro Street', code: 'ST-002', type: 'street', parentId: 'loc-12', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-17', name: 'Kilimanjaro Street', code: 'ST-003', type: 'street', parentId: 'loc-14', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Warehouses
export const warehouses = [
  { id: 'wh-1', name: 'Arusha Central Warehouse', code: 'WH-001', locationId: 'loc-9', capacity: 50000, currentStock: 12500, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'wh-2', name: 'Moshi Main Warehouse', code: 'WH-002', locationId: 'loc-11', capacity: 40000, currentStock: 8200, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'wh-3', name: 'Meru Storage', code: 'WH-003', locationId: 'loc-10', capacity: 30000, currentStock: 5600, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
];

// Users (passwords are hashed with bcryptjs - password: plain / hash: bcrypt)
export const users = [
  {
    id: 'user-1',
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@ukulima.com',
    phone: '+255712345001',
    password: '$2a$12$BbbEDnuKUrbwBMP7S/vDOeI8ibdtaa8WpOKp8isIi/HqnurY9C51C', // admin123
    role: 'admin',
    code: 'ADM-001',
    locationId: 'loc-1',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-2',
    firstName: 'John',
    lastName: 'Mwangi',
    email: 'john.mwangi@ukulima.com',
    phone: '+255712345002',
    password: '$2a$10$T2IqDchDCRK5glMIqVus/O/KjzceU8mlHN1wTfBT/ekXldoeOGcGa', // buyer123
    role: 'buyer',
    code: 'BUY-001',
    locationId: 'loc-9',
    warehouseId: 'wh-1',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-3',
    firstName: 'Mary',
    lastName: 'Kimani',
    email: 'mary.kimani@ukulima.com',
    phone: '+255712345003',
    password: '$2a$10$T2IqDchDCRK5glMIqVus/O/KjzceU8mlHN1wTfBT/ekXldoeOGcGa', // buyer123
    role: 'buyer',
    code: 'BUY-002',
    locationId: 'loc-11',
    warehouseId: 'wh-2',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-4',
    firstName: 'James',
    lastName: 'Omondi',
    email: 'james.omondi@ukulima.com',
    phone: '+255712345004',
    password: '$2a$10$XNzZkmY08spA7VODvJfrPOgPph7IHGTz.F3LwlVye8uM.mgM5UYz2', // clerk123
    role: 'clerk',
    code: 'CLK-001',
    locationId: 'loc-9',
    warehouseId: 'wh-1',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-5',
    firstName: 'Grace',
    lastName: 'Njeri',
    email: 'grace.njeri@ukulima.com',
    phone: '+255712345005',
    password: '$2a$12$/6AlVTimcgJjIfjLTYJ2ge7RHIflFXioso7wzl8iS2kay9.PCg6FO', // manager123
    role: 'manager',
    code: 'MGR-001',
    locationId: 'loc-3',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-6',
    firstName: 'Daniel',
    lastName: 'Kimani',
    email: 'daniel.kimani@ukulima.com',
    phone: '+255712345006',
    password: '$2a$10$c2hlUcy.4rt/Y8vVH4LEn.nBp0qnrHgT1AVKw7JoNc9oq4zXouQqa', // it123
    role: 'IT',
    code: 'IT-001',
    locationId: 'loc-1',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-7',
    firstName: 'Sarah',
    lastName: 'Wanjiku',
    email: 'sarah.wanjiku@ukulima.com',
    phone: '+255712345007',
    password: '$2a$10$LXTstMwHpLYz8m/mrvPMK.JzTHUWO0NixOKrEprpXfxl6YAKA8Q72', // officer123
    role: 'officer',
    code: 'OFF-001',
    locationId: 'loc-9',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'user-8',
    firstName: 'Peter',
    lastName: 'Kamau',
    email: 'peter.kamau@ukulima.com',
    phone: '+255712345008',
    password: '$2a$10$LXTstMwHpLYz8m/mrvPMK.JzTHUWO0NixOKrEprpXfxl6YAKA8Q72', // officer123
    role: 'officer',
    code: 'OFF-002',
    locationId: 'loc-11',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Crops
export const crops = [
  { id: 'crop-1', name: 'Tobacco', code: 'TOB', description: 'Virginia tobacco leaf', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'crop-2', name: 'Cotton', code: 'COT', description: 'Premium cotton', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'crop-3', name: 'Coffee', code: 'COF', description: 'Arabica coffee beans', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Grades
export const grades = [
  { id: 'grade-1', name: 'Grade A', code: 'A', description: 'Premium quality - highest grade', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'grade-2', name: 'Grade B', code: 'B', description: 'Good quality', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'grade-3', name: 'Grade C', code: 'C', description: 'Standard quality', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Crop Grade Prices
export const cropGradePrices = [
  { id: 'price-1', cropId: 'crop-1', gradeId: 'grade-1', price: 15.50, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'price-2', cropId: 'crop-1', gradeId: 'grade-2', price: 12.00, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'price-3', cropId: 'crop-1', gradeId: 'grade-3', price: 9.50, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'price-4', cropId: 'crop-2', gradeId: 'grade-1', price: 18.00, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'price-5', cropId: 'crop-2', gradeId: 'grade-2', price: 14.50, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'price-6', cropId: 'crop-3', gradeId: 'grade-1', price: 22.00, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Loans
export const loans = [
  { id: 'loan-1', name: 'Fertilizer Pack', type: 'fertilizer', price: 50.00, unit: 'bag', description: 'NPK 20-10-10 fertilizer', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-2', name: 'Seeds Package', type: 'seeds', price: 30.00, unit: 'kg', description: 'High-yield tobacco seeds', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-3', name: 'Pesticide Spray', type: 'pesticide', price: 45.00, unit: 'liter', description: 'Organic pesticide', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-4', name: 'Tools Kit', type: 'equipment', price: 120.00, unit: 'set', description: 'Farming tools bundle', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Farmers
export const farmers = [
  { id: 'farmer-1', firstName: 'Joseph', lastName: 'Mwenda', code: 'FRM-001', phone: '+255711111001', locationId: 'loc-12', totalDebt: 0, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'farmer-2', firstName: 'Grace', lastName: 'Njau', code: 'FRM-002', phone: '+255711111002', locationId: 'loc-12', totalDebt: 250.00, createdAt: '2024-01-01', updatedAt: '2026-04-10' },
  { id: 'farmer-3', firstName: 'Daniel', lastName: 'Kisanga', code: 'FRM-003', phone: '+255711111003', locationId: 'loc-13', totalDebt: 180.00, createdAt: '2024-01-01', updatedAt: '2026-04-08' },
  { id: 'farmer-4', firstName: 'Elizabeth', lastName: 'Mollel', code: 'FRM-004', phone: '+255711111004', locationId: 'loc-14', totalDebt: 90.00, createdAt: '2024-01-01', updatedAt: '2026-04-05' },
  { id: 'farmer-5', firstName: 'Peter', lastName: 'Kamau', code: 'FRM-005', phone: '+255711111005', locationId: 'loc-15', totalDebt: 450.00, createdAt: '2024-01-05', updatedAt: '2026-04-12' },
];

// Farmer Loans
export const farmerLoans = [
  { id: 'fl-1', farmerId: 'farmer-2', loanId: 'loan-1', quantity: 5, totalAmount: 250.00, remainingDebt: 250.00, issuedDate: '2026-01-15', createdAt: '2026-01-15', updatedAt: '2026-01-15' },
  { id: 'fl-2', farmerId: 'farmer-3', loanId: 'loan-2', quantity: 6, totalAmount: 180.00, remainingDebt: 180.00, issuedDate: '2026-02-01', createdAt: '2026-02-01', updatedAt: '2026-02-01' },
  { id: 'fl-3', farmerId: 'farmer-4', loanId: 'loan-3', quantity: 2, totalAmount: 90.00, remainingDebt: 90.00, issuedDate: '2026-02-10', createdAt: '2026-02-10', updatedAt: '2026-02-10' },
  { id: 'fl-4', farmerId: 'farmer-5', loanId: 'loan-1', quantity: 9, totalAmount: 450.00, remainingDebt: 450.00, issuedDate: '2026-03-01', createdAt: '2026-03-01', updatedAt: '2026-03-01' },
];

// Purchases
export const purchases = [];

// Bales
export const bales = [];

// Rebales
export const rebales = [];

// Transports
export const transports = [];

// Loan Deductions
export const loanDeductions = [];

// Settings
export const settings = {
  id: 'settings-1',
  deductionPercentage: 30,
  primaryColor: '#22c55e',
  secondaryColor: '#3b82f6',
  language: 'en',
  currency: 'TZS',
  updatedAt: '2024-01-01',
};

// Roles
export const roles = [
  {
    id: 'role-1',
    name: 'Administrator',
    code: 'ADMIN',
    description: 'Full system access with all permissions',
    permissions: ['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'loans.assign', 'loans.view', 'farmers.create', 'farmers.view', 'farmers.edit', 'reports.view', 'reports.export', 'receipts.view', 'receipts.print', 'master-data.view', 'master-data.edit', 'settings.view', 'settings.edit'],
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'role-2',
    name: 'Buyer',
    code: 'BUYER',
    description: 'Authorized to purchase crops from farmers',
    permissions: ['dashboard.view', 'buying.create', 'buying.view', 'rebale.create', 'rebale.view', 'transport.create', 'transport.view', 'receipts.view', 'receipts.print'],
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'role-3',
    name: 'Extension Officer',
    code: 'OFFICER',
    description: 'Field officers who assign loans to farmers',
    permissions: ['dashboard.view', 'loans.assign', 'loans.view', 'farmers.view', 'reports.view', 'receipts.view', 'receipts.print'],
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

// Audit Logs
export const auditLogs = [];

// Notifications
export const notifications = [];
