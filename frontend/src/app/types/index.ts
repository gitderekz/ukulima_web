// User Roles
export type UserRole = 'admin' | 'IT' | 'manager' | 'officer' | 'clerk' | 'buyer' | 'developer';

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Location Types (hierarchical)
export type LocationType = 'zone' | 'cpp' | 'region' | 'district' | 'ward' | 'street';

export interface Location {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  locationId: string;
  capacity: number;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  code: string;
  profilePicture?: string;
  locationId: string;
  warehouseId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  name: string;
  type: 'fertilizer' | 'seed' | 'tool' | 'other';
  price: number;
  unit: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  phone: string;
  locationId: string;
  profilePicture?: string;
  totalDebt: number;
  createdAt: string;
  updatedAt: string;

  FarmerLoans?: FarmerLoan[];
}

export interface FarmerLoan {
  id: string;
  farmerId: string;
  loanId: string;
  quantity: number;
  totalAmount: number;
  remainingDebt: number;
  issuedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CropGradePrice {
  id: string;
  cropId: string;
  gradeId: string;
  price: number;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  receiptNumber: string;
  farmerId: string;
  buyerId: string;
  clerkId?: string;
  warehouseId: string;
  totalMass: number;
  totalAmount: number;
  loanDeducted: number;
  amountPaid: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bale {
  id: string;
  baleTag: string;
  purchaseId?: string;
  cropId: string;
  gradeId: string;
  mass: number;
  price: number;
  totalAmount: number;
  warehouseId: string;
  status: 'pending' | 'purchased' | 'rebaled' | 'transported';
  createdAt: string;
  updatedAt: string;
}

export interface Rebale {
  id: string;
  rebaleTag: string;
  sourceBaleIds: string[];
  cropId: string;
  gradeId: string;
  totalMass: number;
  price: number;
  totalAmount: number;
  warehouseId: string;
  buyerId: string;
  rebaleDate: string;
  status: 'stored' | 'transported';
  createdAt: string;
  updatedAt: string;
}

export interface Transport {
  id: string;
  receiptNumber: string;
  rebaleIds: string[];
  driverName: string;
  driverPhone: string;
  truckPlate1: string;
  truckPlate2?: string;
  totalMass: number;
  totalAmount: number;
  buyerId: string;
  warehouseId: string;
  transportDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanDeduction {
  id: string;
  purchaseId: string;
  farmerLoanId: string;
  deductedAmount: number;
  deductionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  deductionPercentage: number;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  currency: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Auth types
export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// View models with relations
export interface PurchaseWithDetails extends Purchase {
  farmer: Farmer;
  buyer: User;
  clerk?: User;
  warehouse: Warehouse;
  bales: BaleWithDetails[];
}

export interface BaleWithDetails extends Bale {
  crop: Crop;
  grade: Grade;
  warehouse: Warehouse;
}

export interface RebaleWithDetails extends Rebale {
  crop: Crop;
  grade: Grade;
  warehouse: Warehouse;
  buyer: User;
}

export interface TransportWithDetails extends Transport {
  rebales: RebaleWithDetails[];
  buyer: User;
  warehouse: Warehouse;
}
