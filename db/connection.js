const { MongoClient, ServerApiVersion } = require("mongodb");
const ENV = process.env.NODE_ENV;

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

// if (!process.env.ATLAS_URI && !process.env.LOCAL_MONGODB_URI) {
//   console.log(`${__dirname}/.env.${ENV}`);
//   throw new Error("ATLAS_URI or LOCAL_MONGODB_URI not set");
// }

let client = null;

async function connectToDatabase() {
  if (client && client.topology.isConnected()) {
    return client;
  }
  let uri;
  if (ENV === "production") {
    uri = process.env.ATLAS_URI;
  } else {
    uri = process.env.LOCAL_MONGODB_URI;
  }
  try {
    client = await MongoClient.connect(uri, {
      minPoolSize: 5,
    });
    return client;
  } catch (error) {
    console.error(`Error connecting to the ${ENV} database:`, error);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (client) {
      await client.close();
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}

module.exports = {
  connectToDatabase,
  closeConnection,
};
