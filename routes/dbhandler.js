const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
//const url = 'mongodb://localhost:27017';
const url = "mongodb+srv://mongoGroup:kLTsZ9EBUm7ErOpY@cluster0.fxl2nvt.mongodb.net/admin";
const client = new MongoClient(url);

// Database Name
const dbName = 'newMongoDB';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('relationshipArrows');

	const findResult = await collection.find({}).toArray();
	console.log('Found documents =>', findResult);
  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
