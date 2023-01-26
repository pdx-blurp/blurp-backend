# Back-End-Ecomapper-Capstone-Project
This is the repository for the backend of the Ecomapper capstone project.

## Back-End Purpose: 
The purpose of this back-end section is to manage data received from users on the front-end of Blurp and to (eventually) communicate with the MongoDB server hosting the stored user data. 

## Dependencies & Technologies Used: 
__All dependencies can be installed with `npm i NAME` where name is listed below:__
* ejs
* express
* cookie-parser
* debug
* http-errors
* morgan
* pug
* nodemon
  * note: nodemon only required for devrun

The back end "stack" consists of JS, EJS, and a remote MongoDB connection. 

## Usage Guide: 

For the front-end, an example map is stored in JSON as follows: 
```JSON
[
  {
    "userName": "Test User Zero",
    "userID": 0,
    "mapID": 0,
    "nodes": [
      {
        "nodeID": 0,
        "nodeName": "nodeZero"
      },
      {
        "nodeID": 1,
        "nodeName": "nodeOne"
      },
      {
        "nodeID": 2,
        "nodeName": "nodeTwo"
      }
    ],
    "relationships": [
      {
        "nodePair": [
          {
            "nodeOne": 0,
            "nodeTwo": 1
          }
        ],
        "description": "Relationship description",
        "relationshipType": 1111,
        "relationshipID": 1
      },
      {
        "nodePair": [
          {
            "nodeOne": 1,
            "nodeTwo": 2
          }
        ],
        "description": "Relationship description",
        "relationshipType": 1111,
        "relationshipID": 2
      }
    ]
  },
  {
    "name": "Test"
  }
]

```

To test, once all dependencies are installed, `npm start` and then using a tool such as postman, connect with `localhost:3000` - or talk to all endpoints by doing something like `localhost:3000/map/create`.

## Back-End Authors:
* Ian G (guyian@pdx.edu)
* Jacob L (jml29@pdx.edu)
* Jacob S (strong7@pdx.edu)
* Dalia R (ramos26@pdx.edu)
* Truc N (ngotruc@pdx.edu)
* Jaime M (jgm7@pdx.edu)
