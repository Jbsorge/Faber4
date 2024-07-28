const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  try {
    await client.connect();
    const database = client.db('faber4db');
    const collection = database.collection('textContent');

    const { httpMethod, body } = event;

    switch (httpMethod) {
      case 'GET':
        const content = await collection.find({}).toArray();
        return { statusCode: 200, body: JSON.stringify(content) };

      case 'POST':
        const newContent = JSON.parse(body);
        await collection.insertOne(newContent);
        return { statusCode: 201, body: JSON.stringify({ message: 'Content created' }) };

      case 'PUT':
        const updatedContent = JSON.parse(body);
        await collection.updateOne({ _id: updatedContent._id }, { $set: updatedContent });
        return { statusCode: 200, body: JSON.stringify({ message: 'Content updated' }) };

      case 'DELETE':
        const { id } = JSON.parse(body);
        await collection.deleteOne({ _id: id });
        return { statusCode: 200, body: JSON.stringify({ message: 'Content deleted' }) };

      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to perform operation' }) };
  } finally {
    await client.close();
  }
};