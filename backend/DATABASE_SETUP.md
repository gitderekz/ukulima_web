# Database Migrations & Seeders - Quick Start

## What Was Created

✅ **Automated Database Setup System**

The backend now includes comprehensive migrations and seeders that run automatically on server startup:

### Migrations (`src/migrations/`)
- Automatically creates all 14 database tables in correct dependency order
- Runs on every server start (safe - only creates tables if they don't exist)
- **File**: `migrationRunner.js`

### Seeders (`src/seeders/`)
- Populates database with initial reference data
- Only runs if database is empty (checks for existing roles/users)
- **File**: `seedRunner.js`

## What Gets Created

### 14 Tables (in creation order):
1. **roles** - 6 system roles (Admin, Manager, Buyer, Warehouse Officer, Extension Officer, Logistics Officer)
2. **locations** - 8 geographic locations (country, regions, zones, districts, wards)
3. **warehouses** - 2 warehouse facilities
4. **users** - 5 default users (1 per role with password: "password")
5. **crops** - 5 crop types (Rice, Maize, Beans, Cashew, Sunflower)
6. **grades** - 5 quality grades (A1, A, B, C, D)
7. **prices** - 25 price combinations (5 crops × 5 grades)
8. **farmers** - 4 sample farmers
9. **farmer_loans** - 3 active farmer loans
10. **bales** - (empty, created on transactions)
11. **purchases** - (empty, created on transactions)
12. **loan_deductions** - (empty, created on repayments)
13. **rebales** - (empty, created on rebaling)
14. **transports** - (empty, created on shipments)

## Test Users

Login with these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ukulima.local | password |
| Manager | manager.morogoro@ukulima.local | password |
| Buyer | buyer.john@ukulima.local | password |
| Warehouse Officer | warehouse@ukulima.local | password |
| Extension Officer | extension@ukulima.local | password |

## How It Works

### On Server Startup:
```
1. Server loads
2. Connects to database
3. Runs migrations → Creates all tables
4. Runs seeders → Populates with initial data (only if empty)
5. Server ready to accept requests
```

## Usage

### Start Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
🔄 Starting migrations...
  ✅ Role table ready
  ✅ Location table ready
  ...all 14 tables...
✅ All migrations completed successfully

🌱 Starting database seeding...
  ✅ Seeded 6 roles
  ✅ Seeded 8 locations
  ✅ Seeded 2 warehouses
  ✅ Seeded 5 users
  ✅ Seeded 5 crops
  ✅ Seeded 5 grades
  ✅ Seeded 25 prices
  ✅ Seeded 4 farmers
  ✅ Seeded 3 farmer loans
✅ Database seeding completed successfully
```

Second run will show:
```
✅ Database connected successfully
🔄 Starting migrations...
  ✅ All tables ready (no changes needed)
✅ All migrations completed successfully

⏭️  Database already seeded, skipping...
```

## Reset Database

If you need to start fresh:

### Option 1: MySQL Command Line
```bash
mysql -u root -p
mysql> DROP DATABASE ukulima_erp;
mysql> CREATE DATABASE ukulima_erp;
```

Then restart server - migrations and seeders will run automatically.

### Option 2: Add Reset Endpoint (Optional)
```javascript
// routes/adminRoutes.js (protected - admin only)
router.post('/admin/reset-db', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  
  try {
    await db.sequelize.drop();
    await runMigrations();
    await runSeeders();
    res.json({ success: true, message: 'Database reset and seeded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Common Issues

### ❌ "Database initialization failed" on first run
**Solution**: Check MySQL is running and credentials are correct in `.env`

### ❌ "Table already exists" error
**Solution**: Database wasn't fully initialized. Run reset above.

### ❌ Seeding didn't run
**Solution**: Migrations failed. Check logs above for table creation errors.

### ❌ Seeders skipped (says "already seeded" when database is empty)
**Solution**: Check `isEmptyDatabase()` logic in `seedRunner.js`

## Adding New Data

### Option 1: Add to Initial Seeders
Edit `src/seeders/seedRunner.js`:

```javascript
async function seedCustomData() {
  const data = [
    { id: uuid(), ... },
  ];
  await db.CustomModel.bulkCreate(data);
  console.log(`  ✅ Seeded ${data.length} custom items`);
}
```

Then call it: `await seedCustomData();`

### Option 2: Add via API
Once server is running, use any API client to POST to endpoints:

```bash
curl -X POST http://localhost:5000/api/farmers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe",...}'
```

### Option 3: Direct SQL (Development Only)
```bash
mysql -u root -p ukulima_erp < data.sql
```

## Production Considerations

### ⚠️ DO NOT use seeders in production!

Create an environment variable to disable seeders:

```javascript
// In seedRunner.js
export async function runSeeders() {
  if (process.env.NODE_ENV === 'production') {
    console.log('⏭️  Seeders disabled in production');
    return;
  }
  // ... rest of seeders
}
```

Or conditionally in server.js:

```javascript
// Seed only in development
if (process.env.NODE_ENV !== 'production') {
  await runSeeders();
}
```

## Architecture

```
Backend Initialization Flow:
┌─────────────────────────────────────┐
│   server.js starts                  │
│   initializeDatabase()              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   db.sequelize.authenticate()       │
│   ✅ Database connected             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   runMigrations()                   │
│   - Loop through models array       │
│   - Call model.sync({alter: true})  │
│   - All 14 tables created           │
│   ✅ Ready                          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   isEmptyDatabase()                 │
│   - Check if roles/users exist      │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
 Empty?           Not Empty?
    │                 │
    ▼                 ▼
runSeeders()      Skip & Continue
    │                 │
    └────────┬────────┘
             │
             ▼
      ✅ Server Ready
```

## File Structure

```
backend/
├── src/
│   ├── models/              # Database models
│   ├── migrations/
│   │   ├── migrationRunner.js
│   │   └── README.md
│   ├── seeders/
│   │   ├── seedRunner.js
│   │   └── USAGE.md (this file)
│   ├── server.js            # Updated with migrations/seeders
│   └── ...
└── package.json
```

## Support

For issues or questions about migrations/seeders:
1. Check logs during server startup
2. Review `migrations/README.md` for details
3. Check model files in `src/models/` for field validations
4. Verify foreign key relationships are correct

---

**Summary**: Your database is now fully autonomous! Tables create themselves on startup, and initial data populates automatically. No manual schema setup needed. ✅
