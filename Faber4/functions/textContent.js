// functions/textContent.js and functions/comments.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  await client.connect();
  const db = client.db('faber4db'); // Replace with your actual database name
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const db = await connectToDatabase();
    const collection = db.collection('your_collection_name'); // Replace with your actual collection name

    if (event.httpMethod === 'GET') {
      const result = await collection.find({}).toArray();
      return { statusCode: 200, body: JSON.stringify(result) };
    } else if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      await collection.insertOne(data);
      return { statusCode: 200, body: JSON.stringify({ message: 'Data saved successfully' }) };
    }

    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Database error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Database operation failed' }) };
  }
};