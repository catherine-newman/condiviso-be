const { MongoClient, ServerApiVersion } = require("mongodb");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.ATLAS_URI) {
  console.log(`${__dirname}/.env.${ENV}`);
  throw new Error("ATLAS_URI not set");
}

const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase(databaseName) {
  try {
    await client.connect();
    console.log(`Connected successfully to the ${databaseName} database.`);
    return client.db(databaseName);
  } catch (error) {
    console.error(`Error connecting to the ${databaseName} database:`, error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
};
