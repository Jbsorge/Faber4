const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  try {
    await client.connect();
    const database = client.db('your_database_name');
    const collection = database.collection('content');

    if (event.httpMethod === 'GET') {
      const content = await collection.findOne({});
      return {
        statusCode: 200,
        body: JSON.stringify(content)
      };
    } else if (event.httpMethod === 'POST') {
      const content = JSON.parse(event.body);
      await collection.updateOne({}, { $set: content }, { upsert: true });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to perform operation' })
    };
  } finally {
    await client.close();
  }
};