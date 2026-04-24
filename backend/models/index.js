import sequelize from '../db/sequelize.js';
import createLocationModel from './location.js';
import createWarehouseModel from './warehouse.js';
import createRoleModel from './role.js';
import createUserModel from './user.js';
import createCropModel from './crop.js';
import createGradeModel from './grade.js';
import createCropGradePriceModel from './cropgradeprice.js';
import createLoanModel from './loan.js';
import createFarmerModel from './farmer.js';
import createFarmerLoanModel from './farmerloan.js';
import createPurchaseModel from './purchase.js';
import createBaleModel from './bale.js';
import createRebaleModel from './rebale.js';
import createRebaleBaleModel from './rebalebale.js';
import createTransportModel from './transport.js';
import createTransportRebaleModel from './transportrebale.js'; // Add this
import createLoanDeductionModel from './loandeduction.js';
import createSettingModel from './setting.js';
import createAuditLogModel from './auditlog.js';
import createNotificationModel from './notification.js';

// Initialize all models
const Location = createLocationModel(sequelize);
const Warehouse = createWarehouseModel(sequelize);
const Role = createRoleModel(sequelize);
const User = createUserModel(sequelize);
const Crop = createCropModel(sequelize);
const Grade = createGradeModel(sequelize);
const CropGradePrice = createCropGradePriceModel(sequelize);
const Loan = createLoanModel(sequelize);
const Farmer = createFarmerModel(sequelize);
const FarmerLoan = createFarmerLoanModel(sequelize);
const Purchase = createPurchaseModel(sequelize);
const Bale = createBaleModel(sequelize);
const Rebale = createRebaleModel(sequelize);
const RebaleBale = createRebaleBaleModel(sequelize);
const Transport = createTransportModel(sequelize);
const TransportRebale = createTransportRebaleModel(sequelize); // Add this
const LoanDeduction = createLoanDeductionModel(sequelize);
const Setting = createSettingModel(sequelize);
const AuditLog = createAuditLogModel(sequelize);
const Notification = createNotificationModel(sequelize);

// Define Associations

// Location self-referential hierarchy
Location.hasMany(Location, { as: 'children', foreignKey: 'parentId' });
Location.belongsTo(Location, { as: 'parent', foreignKey: 'parentId' });

// Warehouse associations
Warehouse.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(Warehouse, { foreignKey: 'locationId' });

// User associations
User.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(User, { foreignKey: 'locationId' });

User.belongsTo(Location, {as: 'cpp', foreignKey: 'cppId' });
Location.hasMany(User, {as: 'cppUsers', foreignKey: 'cppId' });

User.belongsTo(Location, {as: 'extension', foreignKey: 'extensionId' });
Location.hasMany(User, {as: 'extensionUsers', foreignKey: 'extensionId' });

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

User.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Warehouse.hasMany(User, { foreignKey: 'warehouseId' });

// CropGradePrice associations
CropGradePrice.belongsTo(Crop, { foreignKey: 'cropId' });
Crop.hasMany(CropGradePrice, { foreignKey: 'cropId' });

CropGradePrice.belongsTo(Grade, { foreignKey: 'gradeId' });
Grade.hasMany(CropGradePrice, { foreignKey: 'gradeId' });

// Farmer associations
Farmer.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(Farmer, { foreignKey: 'locationId' });

Farmer.belongsTo(Location, {as: 'cpp', foreignKey: 'cppId' });
Location.hasMany(Farmer, {as: 'cppFarmers', foreignKey: 'cppId' });

Farmer.belongsTo(Location, {as: 'extension', foreignKey: 'extensionId' });
Location.hasMany(Farmer, {as: 'extensionFarmers', foreignKey: 'extensionId' });

// FarmerLoan associations
FarmerLoan.belongsTo(Farmer, { foreignKey: 'farmerId' });
Farmer.hasMany(FarmerLoan, { foreignKey: 'farmerId' });

FarmerLoan.belongsTo(Loan, { foreignKey: 'loanId' });
Loan.hasMany(FarmerLoan, { foreignKey: 'loanId' });

// Bale associations
Bale.belongsTo(Purchase, { foreignKey: 'purchaseId' });
Purchase.hasMany(Bale, { foreignKey: 'purchaseId' });

Bale.belongsTo(Crop, { foreignKey: 'cropId' });
Crop.hasMany(Bale, { foreignKey: 'cropId' });

Bale.belongsTo(Grade, { foreignKey: 'gradeId' });
Grade.hasMany(Bale, { foreignKey: 'gradeId' });

Bale.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Warehouse.hasMany(Bale, { foreignKey: 'warehouseId' });

// Purchase associations
Purchase.belongsTo(Farmer, { foreignKey: 'farmerId' });
Farmer.hasMany(Purchase, { foreignKey: 'farmerId' });

Purchase.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
User.hasMany(Purchase, { as: 'purchasesAsBuyer', foreignKey: 'buyerId' });

Purchase.belongsTo(User, { as: 'clerk', foreignKey: 'clerkId' });
User.hasMany(Purchase, { as: 'purchasesAsClerk', foreignKey: 'clerkId' });

Purchase.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Warehouse.hasMany(Purchase, { foreignKey: 'warehouseId' });

// Rebale associations
Rebale.belongsTo(Crop, { foreignKey: 'cropId' });
Crop.hasMany(Rebale, { foreignKey: 'cropId' });

Rebale.belongsTo(Grade, { foreignKey: 'gradeId' });
Grade.hasMany(Rebale, { foreignKey: 'gradeId' });

Rebale.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Warehouse.hasMany(Rebale, { foreignKey: 'warehouseId' });

Rebale.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
User.hasMany(Rebale, { as: 'rebalesAsBuyer', foreignKey: 'buyerId' });

// Rebale-Bale many-to-many association
Rebale.belongsToMany(Bale, { through: RebaleBale, foreignKey: 'rebaleId', otherKey: 'baleId' });
Bale.belongsToMany(Rebale, { through: RebaleBale, foreignKey: 'baleId', otherKey: 'rebaleId' });

// RebaleBale associations (junction table)
RebaleBale.belongsTo(Rebale, { foreignKey: 'rebaleId' });
Rebale.hasMany(RebaleBale, { foreignKey: 'rebaleId' });

RebaleBale.belongsTo(Bale, { foreignKey: 'baleId' });
Bale.hasMany(RebaleBale, { foreignKey: 'baleId' });

// Transport associations
// Transport.belongsTo(Rebale, { foreignKey: 'rebaleId' });
// Rebale.hasMany(Transport, { foreignKey: 'rebaleId' });

Transport.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
User.hasMany(Transport, { as: 'transportsAsBuyer', foreignKey: 'buyerId' });

Transport.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Warehouse.hasMany(Transport, { foreignKey: 'warehouseId' });

Transport.belongsTo(Location, {as: 'originLocation', foreignKey: 'originLocationId' });
Location.hasMany(Transport, {as: 'originTransports', foreignKey: 'originLocationId' });

Transport.belongsTo(Location, { as: 'destinationLocation', foreignKey: 'destinationLocationId' });
Location.hasMany(Transport, { as: 'destinationTransports', foreignKey: 'destinationLocationId' });


// Transport-Rebale many-to-many association
Transport.belongsToMany(Rebale, { through: TransportRebale, foreignKey: 'transportId', otherKey: 'rebaleId' });
Rebale.belongsToMany(Transport, { through: TransportRebale, foreignKey: 'rebaleId', otherKey: 'transportId' });

// TransportRebale associations (junction table)
TransportRebale.belongsTo(Transport, { foreignKey: 'transportId' });
Transport.hasMany(TransportRebale, { foreignKey: 'transportId' });

TransportRebale.belongsTo(Rebale, { foreignKey: 'rebaleId' });
Rebale.hasMany(TransportRebale, { foreignKey: 'rebaleId' });

// LoanDeduction associations
LoanDeduction.belongsTo(Purchase, { foreignKey: 'purchaseId' });
Purchase.hasMany(LoanDeduction, { foreignKey: 'purchaseId' });

LoanDeduction.belongsTo(FarmerLoan, { foreignKey: 'farmerLoanId' });
FarmerLoan.hasMany(LoanDeduction, { foreignKey: 'farmerLoanId' });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(AuditLog, { foreignKey: 'userId' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

export const db = {
  Location,
  Warehouse,
  Role,
  User,
  Crop,
  Grade,
  CropGradePrice,
  Loan,
  Farmer,
  FarmerLoan,
  Bale,
  Purchase,
  Rebale,
  RebaleBale,
  Transport,
  TransportRebale, // Add this
  LoanDeduction,
  Setting,
  AuditLog,
  Notification,
  sequelize,
};

// Optional: Export individual models for convenience
export {
  Location,
  Warehouse,
  Role,
  User,
  Crop,
  Grade,
  CropGradePrice,
  Loan,
  Farmer,
  FarmerLoan,
  Bale,
  Purchase,
  Rebale,
  RebaleBale,
  Transport,
  TransportRebale, // Add this
  LoanDeduction,
  Setting,
  AuditLog,
  Notification,
};