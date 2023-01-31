const { MongoClient } = require('mongodb');

// Connection URL
const url = "mongodb+srv://mongoGroup:kLTsZ9EBUm7ErOpY@cluster0.fxl2nvt.mongodb.net/admin";
const client = new MongoClient(url);

// Database Name
const dbName = 'newMongoDB';

async function connect() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected!');
	return client;
}

connect()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());

module.exports = { client };
