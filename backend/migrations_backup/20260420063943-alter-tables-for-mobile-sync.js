'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. purchases
    await queryInterface.sequelize.query(`
      CREATE TABLE purchases_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        receiptNumber VARCHAR(255) UNIQUE NOT NULL,
        farmerId INT NOT NULL,
        buyerId INT NOT NULL,
        clerkId INT NOT NULL,
        warehouseId INT NOT NULL,
        totalMass DECIMAL(10,2) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        loanDeducted DECIMAL(10,2) DEFAULT 0,
        amountPaid DECIMAL(10,2) NOT NULL,
        purchaseDate DATE NOT NULL,
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (farmerId) REFERENCES farmers(id),
        FOREIGN KEY (buyerId) REFERENCES users(id),
        FOREIGN KEY (clerkId) REFERENCES users(id),
        FOREIGN KEY (warehouseId) REFERENCES warehouses(id)
      );

      INSERT INTO purchases_new (
        id, receiptNumber, farmerId, buyerId, clerkId, warehouseId,
        totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
        syncSource, createdAt, updatedAt
      )
      SELECT 
        CAST(id AS CHAR),
        receiptNumber,
        farmerId, buyerId, clerkId, warehouseId,
        totalMass, totalAmount, loanDeducted, amountPaid, purchaseDate,
        'web',
        createdAt, updatedAt
      FROM purchases;

      DROP TABLE purchases;
      RENAME TABLE purchases_new TO purchases;
    `);

    // 2. bales
    await queryInterface.sequelize.query(`
      CREATE TABLE bales_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        baleTag VARCHAR(255) UNIQUE NOT NULL,
        purchaseId VARCHAR(50) NOT NULL,
        cropId INT NOT NULL,
        gradeId INT NOT NULL,
        mass DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        warehouseId INT NOT NULL,
        status ENUM('purchased','rebaled','transported') DEFAULT 'purchased',
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
        FOREIGN KEY (cropId) REFERENCES crops(id),
        FOREIGN KEY (gradeId) REFERENCES grades(id),
        FOREIGN KEY (warehouseId) REFERENCES warehouses(id)
      );

      INSERT INTO bales_new (...)
      SELECT 
        CAST(id AS CHAR),
        baleTag,
        CAST(purchaseId AS CHAR),
        cropId, gradeId, mass, price, totalAmount, warehouseId, status,
        'web',
        createdAt, updatedAt
      FROM bales;

      DROP TABLE bales;
      RENAME TABLE bales_new TO bales;
    `);

    // 3. rebales
    await queryInterface.sequelize.query(`
      CREATE TABLE rebales_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        rebaleTag VARCHAR(255) UNIQUE NOT NULL,
        receiptNumber VARCHAR(255) UNIQUE NOT NULL,
        cropId INT NOT NULL,
        gradeId INT NOT NULL,
        totalMass DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        warehouseId INT NOT NULL,
        buyerId INT NOT NULL,
        sourceBaleIds TEXT,
        rebaleDate DATE NOT NULL,
        status ENUM('stored','transported','completed','pending') DEFAULT 'stored',
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (cropId) REFERENCES crops(id),
        FOREIGN KEY (gradeId) REFERENCES grades(id),
        FOREIGN KEY (warehouseId) REFERENCES warehouses(id),
        FOREIGN KEY (buyerId) REFERENCES users(id)
      );

      INSERT INTO rebales_new
      SELECT 
        CAST(id AS CHAR), NULL, NULL,
        rebaleTag, receiptNumber, cropId, gradeId, totalMass, price, totalAmount,
        warehouseId, buyerId, sourceBaleIds, rebaleDate, status,
        'web', NULL, createdAt, updatedAt
      FROM rebales;

      DROP TABLE rebales;
      RENAME TABLE rebales_new TO rebales;
    `);

    // 4. rebale_bales
    await queryInterface.sequelize.query(`
      CREATE TABLE rebale_bales_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        rebaleId VARCHAR(50) NOT NULL,
        baleId VARCHAR(50) NOT NULL,
        sourceBaleIds TEXT,
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (rebaleId) REFERENCES rebales(id) ON DELETE CASCADE,
        FOREIGN KEY (baleId) REFERENCES bales(id) ON DELETE CASCADE
      );

      INSERT INTO rebale_bales_new
      SELECT 
        CAST(id AS CHAR),
        CAST(rebaleId AS CHAR),
        CAST(baleId AS CHAR),
        sourceBaleIds,
        'web', createdAt, updatedAt
      FROM rebale_bales;

      DROP TABLE rebale_bales;
      RENAME TABLE rebale_bales_new TO rebale_bales;
    `);

    // 5. transports
    await queryInterface.sequelize.query(`
      CREATE TABLE transports_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        receiptNumber VARCHAR(255) UNIQUE NOT NULL,
        driverName VARCHAR(255) NOT NULL,
        driverPhone VARCHAR(50) NOT NULL,
        truckPlate1 VARCHAR(50) NOT NULL,
        truckPlate2 VARCHAR(50),
        totalMass DECIMAL(10,2) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        buyerId INT NOT NULL,
        warehouseId INT NOT NULL,
        originLocationId INT NOT NULL,
        destinationLocationId INT NOT NULL,
        status ENUM('in_transit','delivered','cancelled') DEFAULT 'in_transit',
        transportDate DATE NOT NULL,
        arrivalDate DATE,
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (buyerId) REFERENCES users(id),
        FOREIGN KEY (warehouseId) REFERENCES warehouses(id),
        FOREIGN KEY (originLocationId) REFERENCES locations(id),
        FOREIGN KEY (destinationLocationId) REFERENCES locations(id)
      );

      INSERT INTO transports_new
      SELECT 
        CAST(id AS CHAR), NULL, NULL,
        receiptNumber, driverName, driverPhone, truckPlate1, truckPlate2,
        totalMass, totalAmount, buyerId, warehouseId, originLocationId, destinationLocationId,
        status, transportDate, arrivalDate,
        'web', NULL, createdAt, updatedAt
      FROM transports;

      DROP TABLE transports;
      RENAME TABLE transports_new TO transports;
    `);

    // 6. transport_rebales
    await queryInterface.sequelize.query(`
      CREATE TABLE transport_rebales_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        transportId VARCHAR(50) NOT NULL,
        rebaleId VARCHAR(50) NOT NULL,
        loadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (transportId) REFERENCES transports(id) ON DELETE CASCADE,
        FOREIGN KEY (rebaleId) REFERENCES rebales(id) ON DELETE CASCADE
      );

      INSERT INTO transport_rebales_new
      SELECT 
        CAST(id AS CHAR),
        CAST(transportId AS CHAR),
        CAST(rebaleId AS CHAR),
        loadedAt,
        'web', createdAt, updatedAt
      FROM transport_rebales;

      DROP TABLE transport_rebales;
      RENAME TABLE transport_rebales_new TO transport_rebales;
    `);

    // 7. farmer_loans
    await queryInterface.sequelize.query(`
      CREATE TABLE farmer_loans_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        farmerId INT NOT NULL,
        loanId INT NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        remainingDebt DECIMAL(10,2) NOT NULL,
        issuedDate DATE NOT NULL,
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (farmerId) REFERENCES farmers(id) ON DELETE CASCADE,
        FOREIGN KEY (loanId) REFERENCES loans(id)
      );

      INSERT INTO farmer_loans_new
      SELECT 
        CAST(id AS CHAR), NULL, NULL,
        farmerId, loanId, quantity, totalAmount, remainingDebt, issuedDate,
        'web', NULL, createdAt, updatedAt
      FROM farmer_loans;

      DROP TABLE farmer_loans;
      RENAME TABLE farmer_loans_new TO farmer_loans;
    `);

    // 8. loan_deductions
    await queryInterface.sequelize.query(`
      CREATE TABLE loan_deductions_new (
        id VARCHAR(50) PRIMARY KEY,
        originalDeviceId VARCHAR(20),
        originalLocalId INT,
        purchaseId VARCHAR(50) NOT NULL,
        farmerLoanId VARCHAR(50) NOT NULL,
        deductedAmount DECIMAL(10,2) NOT NULL,
        deductionDate DATE NOT NULL,
        syncSource ENUM('web','mobile') DEFAULT 'web',
        syncedAt DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,

        FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
        FOREIGN KEY (farmerLoanId) REFERENCES farmer_loans(id) ON DELETE CASCADE
      );

      INSERT INTO loan_deductions_new
      SELECT 
        CAST(id AS CHAR), NULL, NULL,
        CAST(purchaseId AS CHAR),
        CAST(farmerLoanId AS CHAR),
        deductedAmount, deductionDate,
        'web', NULL, createdAt, updatedAt
      FROM loan_deductions;

      DROP TABLE loan_deductions;
      RENAME TABLE loan_deductions_new TO loan_deductions;
    `);

    // 9. farmers extra columns
    await queryInterface.addColumn('farmers', 'mobileId', {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('farmers', 'originalDeviceId', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    await queryInterface.addColumn('farmers', 'syncSource', {
      type: Sequelize.ENUM('web','mobile'),
      defaultValue: 'web'
    });

    await queryInterface.addColumn('farmers', 'syncedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // 10. indexes
    await queryInterface.addIndex('purchases', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('bales', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('rebales', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('transports', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('purchases', ['syncSource']);
    await queryInterface.addIndex('purchases', ['syncedAt']);
  },

  async down() {
    console.log('Manual rollback required');
  }
};