const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  try {
    await client.connect();
    const database = client.db('faber4db');
    const collection = database.collection('comments');

    const { httpMethod, body } = event;

    switch (httpMethod) {
      case 'GET':
        const comments = await collection.find({}).toArray();
        return { statusCode: 200, body: JSON.stringify(comments) };

      case 'POST':
        const newComment = JSON.parse(body);
        await collection.insertOne(newComment);
        return { statusCode: 201, body: JSON.stringify({ message: 'Comment created' }) };

      case 'PUT':
        const updatedComment = JSON.parse(body);
        await collection.updateOne({ _id: updatedComment._id }, { $set: updatedComment });
        return { statusCode: 200, body: JSON.stringify({ message: 'Comment updated' }) };

      case 'DELETE':
        const { id } = JSON.parse(body);
        await collection.deleteOne({ _id: id });
        return { statusCode: 200, body: JSON.stringify({ message: 'Comment deleted' }) };

      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to perform operation' }) };
  } finally {
    await client.close();
  }
};