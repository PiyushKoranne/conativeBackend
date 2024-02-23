/**
 * Created : 29-11-2023
 * 
 * Updated : 29-11-2023
 * 
 * Author : Conative IT Solutions
 * 
 * CONNECTION TO DATABASE: 
 * This code connects to the database and gives global access 
 * of the database instance to all routes
 */

const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DATABASE_NAME || 'conative';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(dbName);
	console.log("✅ - DATABASE CONNECTION ESTABLISHED SUCCESSFULLY");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call connectToDatabase when the application starts
connectToDatabase();

module.exports = {
  getDb: () => db,
};