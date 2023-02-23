const { MongoClient } = require("mongodb");
const fs = require("fs");

// Connection URL
const url = fs.readFileSync(__dirname + "/../mongo.db", "utf-8");
const client = new MongoClient(url);

// Database Name
const dbName = "newMongoDB";

async function connect() {
	// Use connect method to connect to the server
	await client.connect();
	console.log("Connected!");
	return client;
}

connect()
	.then(console.log)
	.catch(console.error)
	.finally(() => client.close());

module.exports = { client };
