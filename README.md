# Back-End-Ecomapper-Capstone-Project
This is the repository for the backend of the (formerly Ecomapper) Blurp capstone project.

## Back-End Purpose: 
The purpose of this back-end section is to manage data received from users on the front-end of Blurp and to communicate with the MongoDB server hosting the stored user data. It is essentially the bridge between the website and the database and end users should never have to touch this. 

## Dependencies & Technologies Used: 
All dependencies can be installed with `npm i` and are needed before running the program!
* cookie-parser: ~1.4.4
* cors: ^2.8.5
* debug: 2.6.9
* ejs: ^3.1.8
* express: ^4.18.2
* express-session: ^1.17.3
* http-errors: ~1.6.3
* mongodb: ^4.13.0
* morgan: ~1.9.1
* nodemon: ^2.0.20
* passport: ^0.6.0
* passport-google-oauth20: ^2.0.0
* pug: ^2.0.4
* session-file-store: ^1.5.0

The back end "stack" consists of JS, EJS, and a remote MongoDB connection. 

## Usage Guide: 

For the front-end, an example map is currently stored in MongoDB as seen in the exampleMap.json file.
NOTE: Integer values in the example are all supplied by the user in some manner. For example, dragging a node around visually will change the "pos" x and y values. Other values have been obfuscated / converted to a plain description for privacy.

For linux users, to test, once all dependencies are installed using `npm i`, run `npm start` - and then move to the frontend code, following it's provided instructions. A localhost option is still possible, but will require some manual coding. 
A list of endpoints (all the same) for Map, Node, and Relationship (for x) are as follows:
x/
x/create
x/delete
x/update
x/get


## Back-End Authors:
* Ian G (guyian@pdx.edu)
* Jacob L (jml29@pdx.edu)
* Jacob S (strong7@pdx.edu)
* Dalia R (ramos26@pdx.edu)
* Truc N (ngotruc@pdx.edu)
* Jaime M (jgm7@pdx.edu)
* Thomas G (trg5@pdx.edu)

## Starting the Backend App
### Install packages
	npm install
### Set MongoDB connection
	export MONGO_URI=<your_mongo_connection_url>
### Start app
	npm run start
