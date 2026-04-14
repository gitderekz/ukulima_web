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
  Role,
} from '../types';

// Locations (hierarchical: Street → Ward → District → Region → CPP → Zone)
export const locations: Location[] = [
  // Zones (top level)
  { id: 'loc-1', name: 'Northern Zone', code: 'NZ-001', type: 'zone', parentId: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-2', name: 'Southern Zone', code: 'SZ-001', type: 'zone', parentId: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // CPPs (under zones)
  { id: 'loc-3', name: 'Arusha CPP', code: 'CPP-001', type: 'cpp', parentId: 'loc-1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-4', name: 'Kilimanjaro CPP', code: 'CPP-002', type: 'cpp', parentId: 'loc-1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-5', name: 'Mbeya CPP', code: 'CPP-003', type: 'cpp', parentId: 'loc-2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Regions (under CPPs)
  { id: 'loc-6', name: 'Arusha Region', code: 'RG-001', type: 'region', parentId: 'loc-3', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-7', name: 'Moshi Region', code: 'RG-002', type: 'region', parentId: 'loc-4', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-8', name: 'Mbeya Region', code: 'RG-003', type: 'region', parentId: 'loc-5', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

  // Districts (under regions)
  { id: 'loc-9', name: 'Arusha Urban', code: 'DT-001', type: 'district', parentId: 'loc-6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-10', name: 'Meru', code: 'DT-002', type: 'district', parentId: 'loc-6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loc-11', name: 'Moshi Urban', code: 'DT-003', type: 'district', parentId: 'loc-7', createdAt: '2024-01-01', updatedAt: '2024-01-01' },

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
export const warehouses: Warehouse[] = [
  { id: 'wh-1', name: 'Arusha Central Warehouse', code: 'WH-001', locationId: 'loc-9', capacity: 50000, currentStock: 12500, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'wh-2', name: 'Moshi Main Warehouse', code: 'WH-002', locationId: 'loc-11', capacity: 40000, currentStock: 8200, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'wh-3', name: 'Meru Storage', code: 'WH-003', locationId: 'loc-10', capacity: 30000, currentStock: 5600, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
];

// Users
export const users: User[] = [
  {
    id: 'user-1',
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@ukulima.com',
    phone: '+255712345001',
    password: 'admin123',
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
    password: 'buyer123',
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
    password: 'buyer123',
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
    password: 'clerk123',
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
    password: 'manager123',
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
    password: 'it123',
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
    password: 'officer123',
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
    password: 'officer123',
    role: 'officer',
    code: 'OFF-002',
    locationId: 'loc-11',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Loans
export const loans: Loan[] = [
  { id: 'loan-1', name: 'NPK Fertilizer (50kg)', type: 'fertilizer', price: 45000, unit: 'bag', description: 'NPK 20-10-10', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-2', name: 'Urea Fertilizer (50kg)', type: 'fertilizer', price: 38000, unit: 'bag', description: 'Urea 46%', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-3', name: 'Maize Seeds (10kg)', type: 'seed', price: 25000, unit: 'pack', description: 'Hybrid variety', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-4', name: 'Coffee Seedlings', type: 'seed', price: 15000, unit: 'bundle', description: '100 seedlings', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-5', name: 'Hand Hoe', type: 'tool', price: 12000, unit: 'piece', description: 'Heavy duty', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'loan-6', name: 'Sprayer (16L)', type: 'tool', price: 35000, unit: 'piece', description: 'Knapsack sprayer', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Farmers
export const farmers: Farmer[] = [
  { id: 'farmer-1', firstName: 'Joseph', lastName: 'Kariuki', code: 'FRM-001', phone: '+255712345101', locationId: 'loc-15', totalDebt: 95000, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'farmer-2', firstName: 'Sarah', lastName: 'Wanjiru', code: 'FRM-002', phone: '+255712345102', locationId: 'loc-15', totalDebt: 0, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'farmer-3', firstName: 'Daniel', lastName: 'Kipchoge', code: 'FRM-003', phone: '+255712345103', locationId: 'loc-16', totalDebt: 45000, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'farmer-4', firstName: 'Rebecca', lastName: 'Muthoni', code: 'FRM-004', phone: '+255712345104', locationId: 'loc-17', totalDebt: 120000, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
  { id: 'farmer-5', firstName: 'Peter', lastName: 'Kamau', code: 'FRM-005', phone: '+255712345105', locationId: 'loc-16', totalDebt: 0, createdAt: '2024-01-01', updatedAt: '2026-04-13' },
];

// Farmer Loans
export const farmerLoans: FarmerLoan[] = [
  { id: 'fl-1', farmerId: 'farmer-1', loanId: 'loan-1', quantity: 2, totalAmount: 90000, remainingDebt: 90000, issuedDate: '2024-03-15', createdAt: '2024-03-15', updatedAt: '2024-03-15' },
  { id: 'fl-2', farmerId: 'farmer-1', loanId: 'loan-5', quantity: 1, totalAmount: 12000, remainingDebt: 5000, issuedDate: '2024-02-10', createdAt: '2024-02-10', updatedAt: '2026-04-10' },
  { id: 'fl-3', farmerId: 'farmer-3', loanId: 'loan-2', quantity: 1, totalAmount: 38000, remainingDebt: 38000, issuedDate: '2024-03-20', createdAt: '2024-03-20', updatedAt: '2024-03-20' },
  { id: 'fl-4', farmerId: 'farmer-3', loanId: 'loan-3', quantity: 1, totalAmount: 25000, remainingDebt: 7000, issuedDate: '2024-02-05', createdAt: '2024-02-05', updatedAt: '2026-04-12' },
  { id: 'fl-5', farmerId: 'farmer-4', loanId: 'loan-1', quantity: 3, totalAmount: 135000, remainingDebt: 120000, issuedDate: '2024-03-01', createdAt: '2024-03-01', updatedAt: '2026-04-11' },
];

// Crops
export const crops: Crop[] = [
  { id: 'crop-1', name: 'Coffee', code: 'CRP-001', description: 'Arabica Coffee', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'crop-2', name: 'Maize', code: 'CRP-002', description: 'Yellow Maize', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'crop-3', name: 'Rice', code: 'CRP-003', description: 'Paddy Rice', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'crop-4', name: 'Cotton', code: 'CRP-004', description: 'Raw Cotton', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Grades
export const grades: Grade[] = [
  { id: 'grade-1', name: 'Grade A', code: 'GRD-A', description: 'Premium quality', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'grade-2', name: 'Grade B', code: 'GRD-B', description: 'Standard quality', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'grade-3', name: 'Grade C', code: 'GRD-C', description: 'Fair quality', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'grade-4', name: 'Grade D', code: 'GRD-D', description: 'Basic quality', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Crop Grade Prices
export const cropGradePrices: CropGradePrice[] = [
  { id: 'cgp-1', cropId: 'crop-1', gradeId: 'grade-1', price: 8500, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-2', cropId: 'crop-1', gradeId: 'grade-2', price: 7200, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-3', cropId: 'crop-1', gradeId: 'grade-3', price: 6000, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-4', cropId: 'crop-1', gradeId: 'grade-4', price: 4800, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-5', cropId: 'crop-2', gradeId: 'grade-1', price: 1200, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-6', cropId: 'crop-2', gradeId: 'grade-2', price: 980, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-7', cropId: 'crop-2', gradeId: 'grade-3', price: 750, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-8', cropId: 'crop-3', gradeId: 'grade-1', price: 2500, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-9', cropId: 'crop-3', gradeId: 'grade-2', price: 2100, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'cgp-10', cropId: 'crop-4', gradeId: 'grade-1', price: 3200, effectiveDate: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

// Purchases
export const purchases: Purchase[] = [
  {
    id: 'purch-1',
    receiptNumber: 'RCP-2026-0001',
    farmerId: 'farmer-2',
    buyerId: 'user-2',
    clerkId: 'user-4',
    warehouseId: 'wh-1',
    totalMass: 250,
    totalAmount: 2125000,
    loanDeducted: 0,
    amountPaid: 2125000,
    purchaseDate: '2026-04-10',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
  },
  {
    id: 'purch-2',
    receiptNumber: 'RCP-2026-0002',
    farmerId: 'farmer-1',
    buyerId: 'user-2',
    clerkId: 'user-4',
    warehouseId: 'wh-1',
    totalMass: 180,
    totalAmount: 1296000,
    loanDeducted: 95000,
    amountPaid: 1201000,
    purchaseDate: '2026-04-12',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-12',
  },
];

// Bales
export const bales: Bale[] = [
  { id: 'bale-1', baleTag: 'BL-2026-0001', purchaseId: 'purch-1', cropId: 'crop-1', gradeId: 'grade-1', mass: 50, price: 8500, totalAmount: 425000, warehouseId: 'wh-1', status: 'purchased', createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { id: 'bale-2', baleTag: 'BL-2026-0002', purchaseId: 'purch-1', cropId: 'crop-1', gradeId: 'grade-1', mass: 50, price: 8500, totalAmount: 425000, warehouseId: 'wh-1', status: 'purchased', createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { id: 'bale-3', baleTag: 'BL-2026-0003', purchaseId: 'purch-1', cropId: 'crop-1', gradeId: 'grade-2', mass: 75, price: 7200, totalAmount: 540000, warehouseId: 'wh-1', status: 'purchased', createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { id: 'bale-4', baleTag: 'BL-2026-0004', purchaseId: 'purch-1', cropId: 'crop-1', gradeId: 'grade-2', mass: 75, price: 7200, totalAmount: 540000, warehouseId: 'wh-1', status: 'rebaled', createdAt: '2026-04-10', updatedAt: '2026-04-11' },
  { id: 'bale-5', baleTag: 'BL-2026-0005', purchaseId: 'purch-2', cropId: 'crop-1', gradeId: 'grade-2', mass: 90, price: 7200, totalAmount: 648000, warehouseId: 'wh-1', status: 'purchased', createdAt: '2026-04-12', updatedAt: '2026-04-12' },
  { id: 'bale-6', baleTag: 'BL-2026-0006', purchaseId: 'purch-2', cropId: 'crop-1', gradeId: 'grade-2', mass: 90, price: 7200, totalAmount: 648000, warehouseId: 'wh-1', status: 'purchased', createdAt: '2026-04-12', updatedAt: '2026-04-12' },
];

// Rebales
export const rebales: Rebale[] = [
  {
    id: 'rebale-1',
    rebaleTag: 'RB-2026-0001',
    sourceBaleIds: ['bale-1', 'bale-2'],
    cropId: 'crop-1',
    gradeId: 'grade-1',
    totalMass: 100,
    price: 8500,
    totalAmount: 850000,
    warehouseId: 'wh-1',
    buyerId: 'user-2',
    rebaleDate: '2026-04-11',
    status: 'stored',
    createdAt: '2026-04-11',
    updatedAt: '2026-04-11',
  },
  {
    id: 'rebale-2',
    rebaleTag: 'RB-2026-0002',
    sourceBaleIds: ['bale-3', 'bale-4'],
    cropId: 'crop-1',
    gradeId: 'grade-2',
    totalMass: 150,
    price: 7200,
    totalAmount: 1080000,
    warehouseId: 'wh-1',
    buyerId: 'user-2',
    rebaleDate: '2026-04-11',
    status: 'transported',
    createdAt: '2026-04-11',
    updatedAt: '2026-04-12',
  },
];

// Transports
export const transports: Transport[] = [
  {
    id: 'trans-1',
    receiptNumber: 'TRP-2026-0001',
    rebaleIds: ['rebale-2'],
    driverName: 'Michael Otieno',
    driverPhone: '+255712345201',
    truckPlate1: 'T123ABC',
    truckPlate2: 'T124XYZ',
    totalMass: 150,
    totalAmount: 1080000,
    buyerId: 'user-2',
    warehouseId: 'wh-1',
    transportDate: '2026-04-12',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-12',
  },
];

// Loan Deductions
export const loanDeductions: LoanDeduction[] = [
  {
    id: 'ld-1',
    purchaseId: 'purch-2',
    farmerLoanId: 'fl-1',
    deductedAmount: 90000,
    deductionDate: '2026-04-12',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-12',
  },
  {
    id: 'ld-2',
    purchaseId: 'purch-2',
    farmerLoanId: 'fl-2',
    deductedAmount: 5000,
    deductionDate: '2026-04-12',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-12',
  },
];

// Settings
export const settings: Settings = {
  id: 'settings-1',
  deductionPercentage: 70,
  primaryColor: '#16a34a',
  secondaryColor: '#0284c7',
  language: 'en',
  currency: 'TZS',
  updatedAt: '2024-01-01',
};

// Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-2',
    action: 'CREATE_PURCHASE',
    entityType: 'purchase',
    entityId: 'purch-1',
    details: 'Created purchase RCP-2026-0001 for farmer FRM-002',
    ipAddress: '192.168.1.100',
    createdAt: '2026-04-10T10:30:00',
  },
  {
    id: 'log-2',
    userId: 'user-2',
    action: 'CREATE_REBALE',
    entityType: 'rebale',
    entityId: 'rebale-1',
    details: 'Created rebale RB-2026-0001',
    ipAddress: '192.168.1.100',
    createdAt: '2026-04-11T14:15:00',
  },
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-2',
    title: 'New Farmer Registered',
    message: 'Farmer Peter Kamau (FRM-005) has been registered in your zone.',
    type: 'info',
    isRead: false,
    createdAt: '2026-04-13T08:00:00',
  },
  {
    id: 'notif-2',
    userId: 'user-5',
    title: 'Warehouse Capacity Alert',
    message: 'Arusha Central Warehouse is at 25% capacity.',
    type: 'warning',
    isRead: false,
    createdAt: '2026-04-13T09:30:00',
  },
];

// Roles
export const roles: Role[] = [
  {
    id: 'role-1',
    name: 'Administrator',
    code: 'ADMIN',
    description: 'Full system access with all permissions',
    permissions: [
      'dashboard.view',
      'buying.create',
      'buying.view',
      'rebale.create',
      'rebale.view',
      'transport.create',
      'transport.view',
      'loans.assign',
      'loans.view',
      'farmers.create',
      'farmers.view',
      'farmers.edit',
      'reports.view',
      'reports.export',
      'receipts.view',
      'receipts.print',
      'master-data.view',
      'master-data.edit',
      'settings.view',
      'settings.edit',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'role-2',
    name: 'IT Support',
    code: 'IT',
    description: 'IT department with technical access',
    permissions: [
      'dashboard.view',
      'buying.create',
      'buying.view',
      'rebale.create',
      'rebale.view',
      'transport.create',
      'transport.view',
      'loans.assign',
      'loans.view',
      'farmers.create',
      'farmers.view',
      'farmers.edit',
      'reports.view',
      'reports.export',
      'receipts.view',
      'receipts.print',
      'master-data.view',
      'master-data.edit',
      'settings.view',
      'settings.edit',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'role-3',
    name: 'Buyer',
    code: 'BUYER',
    description: 'Authorized to purchase crops from farmers',
    permissions: [
      'dashboard.view',
      'buying.create',
      'buying.view',
      'rebale.create',
      'rebale.view',
      'transport.create',
      'transport.view',
      'receipts.view',
      'receipts.print',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'role-4',
    name: 'Extension Officer',
    code: 'OFFICER',
    description: 'Field officers who assign loans to farmers',
    permissions: [
      'dashboard.view',
      'loans.assign',
      'loans.view',
      'farmers.view',
      'reports.view',
      'receipts.view',
      'receipts.print',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'role-5',
    name: 'Data Clerk',
    code: 'CLERK',
    description: 'Data entry and record keeping',
    permissions: [
      'dashboard.view',
      'buying.create',
      'buying.view',
      'rebale.create',
      'rebale.view',
      'transport.create',
      'transport.view',
      'receipts.view',
      'receipts.print',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'role-6',
    name: 'Manager',
    code: 'MANAGER',
    description: 'Management with reporting and oversight access',
    permissions: [
      'dashboard.view',
      'reports.view',
      'reports.export',
      'receipts.view',
      'master-data.view',
      'settings.view',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
  {
    id: 'role-7',
    name: 'Developer',
    code: 'DEV',
    description: 'Mobile app developer with database access',
    permissions: [
      'dashboard.view',
      'buying.view',
      'rebale.view',
      'transport.view',
      'loans.view',
      'farmers.view',
      'reports.view',
      'receipts.view',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
  },
];
