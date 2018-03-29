# Know-Your-Professor

We have developed a website called “Know Your Professor” which will provide an interface for students of Stevens Institute of Technology to provide feedback about their professors and view the ratings given by other students. 
 
We have used JavaScript, HTML, CSS, Bootstrap on front end, Node.js on backend, used MongoDB for our Database, checked the accessibility of the entire Website. 
 
Note: Before running the application, make sure to restore the MongoDB Dump.

FEATURES OF OUR WEBSITE 
 
• Connect to server by running node app.js in your terminal. 

• Once the server starts running, go to your web browser and type localhost:3000, this takes you to our website’s home page. 

• In the homepage of our website, you have two options; you can either select Search Professor or Rate Professor. 

• If you select the “Search Professor” option, it will take you to the search box, where you can enter the professor’s name and view the ratings. 

• If you select the “Rate Professor” option, you have two choices, if you are a firsttime user, you must register and then search for the professor and give rating, if you are a returning user (i.e., have already registered) then you can login using your username and password and give the rating to the professor of your choice. 
 
 
NOTE We have tested all the functionality and style effects on Google chrome browser. 


COMMANDS:
Install dependencies: 
$ npm install 

Start the server: 
$ node app.js 

Connect to the server: 
Localhost:3000 

Connect to Database: 

1. Open two terminals 

2. $ ./mongod 

3. $ ./mongo 

4. Select loginapp 

5. View individual connections     
 
Dumping MongoDB database: 
mongodump -d loginapp -o c:\test.json   

Restoring/Importing MongoDb database: 
mongorestore -d <database_name> <directory_backup>  

(For e.g.:mongorestore -d loginapp DB_DUMP/loginapp/) - Where loginapp is the name of the database in which all the collections resides.



