// =====================================================
// MODIFIED SERVER MODELS FOR OFFLINE SYNC SUPPORT
// =====================================================

// --->backend/models/farmer.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Farmer = sequelize.define('Farmer', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    totalDebt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'farmers',
    timestamps: true,
  });

  return Farmer;
}

// --->backend/models/farmerloan.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const FarmerLoan = sequelize.define('FarmerLoan', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id',
      },
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'loans',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remainingDebt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'defaulted'),
      allowNull: false,
      defaultValue: 'active',
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'farmer_loans',
    timestamps: true,
  });

  return FarmerLoan;
}

// --->backend/models/purchase.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Purchase = sequelize.define('Purchase', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    farmerId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id',
      },
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    clerkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    totalMass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    loanDeducted: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'purchases',
    timestamps: true,
  });

  return Purchase;
}

// --->backend/models/bale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Bale = sequelize.define('Bale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    baleTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    purchaseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'purchases',
        key: 'id',
      },
    },
    cropId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crops',
        key: 'id',
      },
    },
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id',
      },
    },
    mass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('purchased', 'rebaled', 'transported'),
      allowNull: false,
      defaultValue: 'purchased',
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'bales',
    timestamps: true,
  });

  return Bale;
}

// --->backend/models/rebale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Rebale = sequelize.define('Rebale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    rebaleTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cropId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crops',
        key: 'id',
      },
    },
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id',
      },
    },
    totalMass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    sourceBaleIds: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sourceBaleIds');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('sourceBaleIds', value ? JSON.stringify(value) : null);
      },
    },
    rebaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('stored', 'transported', 'completed', 'pending'),
      allowNull: false,
      defaultValue: 'stored',
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'rebales',
    timestamps: true,
  });

  return Rebale;
}

// --->backend/models/rebalebale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const RebaleBale = sequelize.define('RebaleBale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    rebaleId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    baleId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'bales',
        key: 'id',
      },
    },
    sourceBaleIds: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sourceBaleIds');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('sourceBaleIds', value ? JSON.stringify(value) : null);
      },
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'rebale_bales',
    timestamps: true,
  });

  return RebaleBale;
}

// --->backend/models/transport.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Transport = sequelize.define('Transport', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rebaleId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driverPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    truckPlate1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    truckPlate2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalMass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    originLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    destinationLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('in_transit', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'in_transit',
    },
    transportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    arrivalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'transports',
    timestamps: true,
  });

  return Transport;
}

// --->backend/models/transportrebale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const TransportRebale = sequelize.define('TransportRebale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    transportId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'transports',
        key: 'id',
      },
    },
    rebaleId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    loadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'transport_rebales',
    timestamps: true,
  });

  return TransportRebale;
}

// --->backend/models/loandeduction.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const LoanDeduction = sequelize.define('LoanDeduction', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'purchases',
        key: 'id',
      },
    },
    farmerLoanId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'farmer_loans',
        key: 'id',
      },
    },
    deductedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deductionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'loan_deductions',
    timestamps: true,
  });

  return LoanDeduction;
}