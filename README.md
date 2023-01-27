# Back-End-Ecomapper-Capstone-Project
This is the repository for the backend of the (formerly Ecomapper) Blurp capstone project.

## Back-End Purpose: 
The purpose of this back-end section is to manage data received from users on the front-end of Blurp and to (eventually) communicate with the MongoDB server hosting the stored user data. It is essentially the bridge between the website and the database and end users should never have to touch this. 

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

The back end "stack" consists of JS, EJS, and (eventually) a remote MongoDB connection. 

## Usage Guide: 

For the front-end, an example map is currently stored in JSON as follows: 
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

The above JSON blurb shows a map with three people and two relationships. Person zero knows person one, and person one knows person two. Because their relationship type is the same, they can be classified the same. Also stored is a name for the map, a unique ID for each person (nodeID) and relationship (relationshipID). A description / name is also available for further elaboration. 

For linux users, to test, once all dependencies are installed, `npm start` and then using a tool such as postman, connect with `localhost:3000` - or talk to all endpoints by doing something like `localhost:3000/map/create`. This will allow you to interact directly with the (currently locally stored) database for manual operations or for testing. 
A list of all endpoints / commands will be provided below, as well as a couple of example commands:
[todo]

## Back-End Authors:
* Ian G (guyian@pdx.edu)
* Jacob L (jml29@pdx.edu)
* Jacob S (strong7@pdx.edu)
* Dalia R (ramos26@pdx.edu)
* Truc N (ngotruc@pdx.edu)
* Jaime M (jgm7@pdx.edu)
