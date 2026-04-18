# Run migrations (creates all 14 tables)
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Check migration status
npx sequelize-cli db:migrate:status

# Run seeders (seeds all 14 tables with 58 records)
npx sequelize-cli db:seed:all
DEBUG=sequelize:* npx sequelize-cli db:seed:all

# Undo all seeds
npx sequelize-cli db:seed:undo:all


====================================================
code --disable-extension github.copilot
code --enable-extension github.copilot
------------------------
rm ~/.config/Code/User/globalStorage/github.copilot/hosts.json
------------------------
rm -rf ~/.config/Code/User/globalStorage/github.copilot*
mozilla,opera,CHROME
====================================================
I've change the backend structure a little, there is no src anymore
DO THE FOLLOWING,
Open the webapp 'localhost:5173/' and do the following to ensure the system is working fine and solve all the errors..
1. Perform the whole buying process under 'http://localhost:5173/buying' 
2. Perform the whole rebale process under 'http://localhost:5173/rebale' 
3. Perform the whole transport process under 'http://localhost:5173/transport' 
4. Perform the whole loan-assignment process under 'http://localhost:5173/loan-assignment'
5. Open receipts and print some under 'http://localhost:5173/receipts'
6. Open reports and print some under 'http://localhost:5173/reports'

Make sure everything workis fine, no error, no logical error, and the backend should perform with accuracy

Solve errors in files/pages[
frontend/src/app/pages/Dashboard.tsx,
frontend/src/app/pages/Settings.tsx,
]

frontend/src/app/pages/Buying.tsx,
