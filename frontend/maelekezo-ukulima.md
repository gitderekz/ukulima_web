By using reactjs and nodejs make the web-system for a company 'Ukulima' that its main objectives are:
1. Givin out loans to farmers
2. Buying crops from farmers 
3. Rearrange/Repack the crops to bales with respect to their grade then stock them in the warehouses
4. Transport crops to the factory

THE WEB APP WILL DO THE FOLLOWING..
1. Register locations [street,ward,district,region,cpp,zone] and the locations are the parents of each 
other hierachically Street → Ward → District → Region → cpp → Zone . so the table 'locations' might have 
columns like |id|location|parentId| where parentId will reference the id from locations table
2. Register warehouses and they will be assigned their locations
3. Register users with roles [buyers,clercks,officers,managers,IT,] and these users should be assigned 
to their specific locations[street and ward and district and region and cpp and zone] and warehouses
4. Register loans that will be fertilizers,seeds,tools,e.t.c and their prices too 
5. Register farmers where also they will be assigned locations on registering
6. Register crops 
7. Register grades for crops
6. Register prices for each crop grades example |id|cropId|gradeId|price|timestamps|

SYS4TEM ACTIVITIES
LOANS
1. Farmers will be assigned with the loans if they want, we can use farmerLoans table for this
2. These loans will be counted as debts later while selling their crops
BUYING
1. At the harvest season these farmers will sell their crops/harvest to the company's warehouses and therefore 
if they had loans it will be deducted.
2. They will bring their crops in bales(big&small) with different crop qualities
3. These purchases will be recorded in purchases table with crops details and farmerId,buyerId,receiptId,e.t.c

-->THE BUYING FORM
1. The buying form should automatically fill [buyer's zone name,buyer's zone code, buyer's cpp name,buyer's cpp code, buyers name, buyer code, clerk name, clerk code,]
2. The buying form should have input fields that will also have search functionality for [farmer name, farmer code, crop-grade, crop-grade price] in these fields.. lets say farmer details section, if you serch either farmer name/code and select one from list it should fill both name and code. Also on crop details if you search either grade name/price and select one from the list it should fill both grade and price
3. The buying form should have the manual input fields[bale-tag,mass] 
4. This form should be accumulating for a single farmer's items which means, a farmer might have multiple bales with him/her with different grades so the buyer will capture details of one bale to another before printing the receipt. 
-So after filling details of one bale the buyer clicks on 'next bale' button then details of current bale on form is stored in bales table and clear the fields [bale-tag,mass, grade, grade-price] and ready to capture the next bale
-The bales table should have reference to purchase table purchaseId because one purchase will have many bales, and we will create purchase after capturing all bales of a single farmer and after clicking 'print receipt' so as to get all details to store. After creating purchase entry then we update bales with purchaseId
-The bales table should store all info in the form
-The 'bale-tag' field should be unique not to be repeated
-Below this buying form there should be the table with list of bales being captured and the actions buttons to edit and delete rows
-While capturing the farmer's bales there should be summary of accumulation of total amount(mass*grade-price) between the next-bale button and the last line of input fields, This is just for feedback
5. In case buyer closed the form before printing the receipt and come back later and select that same farmer all the information captured before should appear so the buyer can continue to capture bales or print receipt
6. For accumulated details there should be a way to edit and delete them
7. After capturing all of single farmer's bales then buyer can proceed to print the receipt

-->THE RECEIPT
1. Every purchase from farmer will have receipts with its unique number so every farmer will be given a receipt 
showing details of [time-Date,farmer,buyer,crops sold, total amount before loan deduction,total current loan, deducted loan amount,remaining loan after deduction,amount paid to farmer after deduction, ]
2. These loans deductions will be recorder in loandeductions table with all important info and relations like [purchaseId,loanId,e.t.c]
-If the total amount of sold crops exceed the loan taken then deduct the whole loan and farmer walk away with remaining amount
-If the total amount of sold crops is less or equal to the total loan taken then deduct loan partially by 
taking some percentage of amount the crops was sold so that a farmer will walk away with some money
-The admin will set the deduction percentage that ranging [0-100]% in the settings table


RE-BALE / REPACKING
-After farmer sell their crops/bales they might be in small quantity so they need to be repacked in 
large quantity and with similar grade to be stored in warehouses
-These large bales created must be recorded in rebale table before stored in warehouse
-The rebale form should have similarity like the buying form except there will not be Farmers info(name,code) because we are done with farmer at receipt creation and this is internal company issue now
-This means rebale will not touch purchases & loandeductions table, there is no deduction(NOTE:No loan deductions) 
-Rebale will only be for storing data and print receipt of rebale big bales

 
TRANSPORT/DISPATCH
-In here it is all about transporting the large bales from warehouse to factory, 
-While loading the bales to the truck the record should be kept and stored in transports table
-The transport form should be similar to rebale form except since we are dispatching the already store bales we only required to search for 'Bale tag' and all the other info will be filled automatically in the form
-The only manual fields will be [Driver name, Driver phone number,Truck licence plate1,Truck licence plate2(optional)]
-These fields will not auto clear untill the the truck is full loaded and receipt is printed 
-We can add functionality to search bale tage by scanning qr/barcode then it will obtain the barcode from rebale table and fill all the info in the transport form, then click 'next bale' button to capture next bale wile the summary displays and list of captured bales continue to acccumulate below
-While finished loading these bales to the truck the buyer will print a receipt to prevent loss of loads on the way to factory


REPORTS(PDF,CSV,EXCELL)
All reports should have filters of time,grades,farmers,bales,e.t.c
By default these reports should show details of the current day only
-buying report(general)
-buying report(individual farmers)
-buying report(individual grade )
-rebail report(general)
-rebail report(individual grade )
-transport report(general)
-transport report(individual driver )
-transport report(individual grade )
-loan deduction report(general)
-loan deduction report(individual farmer )
-original farmers loan before deduction report
-current farmers loan after deduction report


ADDITIONAL TECHNICAL REQUIREMENTS
-the system should be responsive and adaptive across all screen sizes
-The system should have light and dark mode
-The system should have notifications
-The system should have settings for[color,deduction parcentage(default:0%),e.t.c]
-The system should have multilanguage[eng,french,spanish,chinese,russia,arab,swahili,portugese,persia,india,thai,malay,indo]
-The system should keep logs
-The system forms should check validation example phone numbers&mass should be numbers only keyboard e.t.c
-The navigation menus should be role based, IT and Admin should see all of them 
-Use mySql database(for now use mockdatabase inside the project with mock datas)
-While making use as little AI credits as possible for economic reason
-Use sequelize library for database manipulations
-Implement security like cors,JWT,e.t.c
-Media uploads like profile-pictures,data-sheets to import data from like excell/csv,e.t.c
-Do everyhing professional and clean

https://www.figma.com/make/c8TbAxyDkpbbWNjLY1IkIF/Ukulima-Web-System?p=f&t=wYBBpbEa4IYjfNzF-0&preview-route=%2Fdashboard
-The original bales that farmers brought didn't have Tags so we dont

Very good, so far 99% of system works fine
1. Lets make adjustment in rebale workflow as follows:-
-In some case they dont prefer to keep track of what bales combined to form a big rebale so they will just capture the details for the big bales(rebales) and at the end of capturing all they will print the receipt
-So it should be optional either to go with the flow that keeps track or the one that doesn't depending on the daily preference(Today one might want to keep track but tommorow might not)
-If buyer chose not to keep track of bales to rebale, they should fill mannually the form just like the buying form but this is rebale [So no farmer's details required], only Buyer Information and crop info/rebale info
-Either way that the buyer will use the system should remain steady and keep working, but (Search purchased bales should be optional) 

-The new bales created in rebale should continue to stack up below the form until the buyer finish to register all of them then he/she will choose to print the receipt (The buyer don't have to print receipt after every rebale creation)
-The print receipt stage should be after capturing a bunch of rebale(just like in buying) since they are all going inside the warehouse no need for separate receipts for each rebale

2. Reports page
- In this page user should choose what they want pdf,csv,excel
- Make sure all functionalities in this page are working

3. Loan assignment page
- Add this page to facilitate loan assignment to the farmers by the Extension officers
- EXtension officer will search for farmer name/code then select the farmer and continue to assign loans 
- The loan assignment form should contain list of all loans so the officer will fill in the quantities for the loan item taken (might be all loans of few)
- A farmer can have more than one loan items
- After filling the loan assignment form data should be saved and receipt can be generated
- A farmer can come back next day and add more loan
- Extension officer should be able to update details in case they made mistakes in assignment
- By default this page should display list of all loans assigned that day and a dashboard with  statistics


4. Recceipts page
- Add this page to help regeneration of receipts (original receipt, and Second hand receipt) for all items [Buying,rebale,transport,loan-assignment]
- By default this page should display list of all receipts generated that day


NOTE IMPORTANT! Buyers,clercks and Extension officers should see farmmers registered to their own locations only
They should not be able to buy or assign loans to farmers outside their registered area

-->In small screen tablets and mobile phone, after selecting a menu from side bar the navigation bar should hide automatically

Add menu called 'roles' where admin can perform CRUD for roles
Add roles and users for [IT,Extension Officers]

Very good, now we are done with the web application 
Lets develop a simple mobile app by using flutter, make sure it has well designed components/widgets throughout and has responsiveness and adaptability on all screen sizes(very small and very large)
MOBILE APP DEVELOPMENT
1. WHO WILL USE THE APP
- The mobile app users are going to be [Buyers,clercks and Extension Officers and IT]
- These users are going to interact with farmers directly during buying and loan assignments
2. USAGE
- This mobile application is going to be used in very remote areas so there will be no internet which akes it impractical to use web app.
- This mobile app is going to only have [dashboard,Loan assignment,buying,rebale,transport,farmers,reports,receipts]
3. OPERATION
- Once user login on the internet, the app should later on support offline login when they have moved into the remote places untill they come back to the internet. The offline login should be updated on every online login to keep track of changed password or other things. Use the proper way to implement this offline login
 
- Every day these users before going to their remote workplaces are going to load all important informations like [farmers,loans,crops,grades,prices,warehouses,loandeductions], But information like [loandeduction,farmers and loans] should be of their work-area only. (Avoid loading information outside their premises since it will make the app heavy)
- After loading the information we are going to store it locally in the app storage(sqlite), We shall use sqlite for local storage of the ownloaded data from main system and other tables that will be created
- There are Tables that we don't download on purpose but they are needed like [bales,purchases,rebale,transports,receipts,loanAssignment,et.c], We are going to create them too in our local database.We don't download them because they will be contaning informations across all other locations which we don't want, We only need our location data which we are going to create in these tables 
- So the local database(sqlite) will support our activities like [loanAssignment,buying,rebail,transport]
- Be careful with tables [loandeductions,loanAssignment] because these will help us to know weather to deduct amount from farmers crop sale or not. These tables keeps track of loan balance for farmers and determine how much the farmer will walk away with without confict(You know money can easily cause chaos.. hahahah😂)

- After working all day these users will go back to towns where there is internet so they will synchronize/Upload their local data to the server. This is important step to make sure the system users will see what is going on in the warehouses and keep track of all the finances
- Data snchronization should be done in a way that all local data that has not been uploaded will be uploaded successfuly. 
- In case user failed to upload data today and upload them tomorrow, the data capture date should be of yester day and uploaded/creation date-time should be today, that way the calculations will not be misleading
- Make sure data that have already being uploaded are not going to be upoaded again we can use maybe a flag column to mark our already uploaded data or any other good method
- After everything local database should continue to keep records year after year without compromise

4. MOBILE TO SYSTEM BACKEND COMMUNICATION
- Make sure all api calls from mobile to system are well structured, authorized and protected
- Display all errors clearly incase there is any so it will be easy to debug
- Keep logs too for errors(you can add 'error logs menu') 
- For user with role developer should be able to see the menu 'database' where he/she can manipulate the local database on a nice minimalism GUI that support all operations that can be done in database and tables 

---------------
IN  THE MAIN SYSTEM
1. Add menu called 'roles' where admin can perform CRUD for roles
2. Add roles and users for [IT,Extension Officers]


------------------------------------------------
You have done a great job, well done!!

Now lets do the following
IMPORTANT TASKS
1. Implement full functioning /backend, but for now use the same mock mysql database with improved-datas and put it together in /backend folder to give the reality feel
2. Finish all implementation of flutter-mobile app codes, complete all pending&undone tasks/requirements for full mobile functionality

AFTER COMPLETING THE ABOVE IMPORTANT TASKS DO THE FOLLOWING
1. Implement pages [signup page, forgot password, e.t.c] and full working logic 
2. Add the roles menu&page for role management like CRUD for system roles
3. Add cool and slick animations and transitions in page openings, items/cards/components rendering, component hovering, item/component selections, page loading, e.t.c





















====================================
FLUTTER COPYING
In  my project 'ukulima' i have the file /ukulima/FLUTTER_MOBILE_APP_GUIDE.md
This file contains all information and guide to develop this flutter mobile app
Implement everything from this file to complete this full project, implement all project structure and paste the code contents intended inside

============
===MAJINA===
r=t