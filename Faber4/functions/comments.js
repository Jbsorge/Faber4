const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
    console.log("Function started");
    try {
      console.log("Connecting to database");
      await client.connect();
      console.log("Connected to database");
      const database = client.db('faber4db');
      const collection = database.collection('your_collection_name');
      
      console.log("Fetching data from database");
      const result = await collection.find({}).toArray();
      console.log("Data fetched:", result);
  
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    } catch (error) {
      console.error("Error in function:", error);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: error.message, stack: error.stack }) 
      };
    } finally {
      await client.close();
    }
  };