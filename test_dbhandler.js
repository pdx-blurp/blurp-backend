const db = require('./routes/dbhandler');

console.log(db);

const database = db.db('newMongoDB');
const collection = database.collection('relationshipArrows');
const findResult = collection.find({}).toArray();
console.log('Found documents =>', findResult);
