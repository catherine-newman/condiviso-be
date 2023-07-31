const { MongoClient, ServerApiVersion } = require("mongodb");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.ATLAS_URI && !process.env.LOCAL_MONGODB_DATABASE) {
  console.log(`${__dirname}/.env.${ENV}`);
  throw new Error("ATLAS_URI or LOCAL_MONGODB_DATABASE not set");
}

let client;

async function connectToDatabase() {
  try {
    let uri;
    if (ENV === "production") {
      uri = process.env.ATLAS_URI;
    } else {
      const localDatabaseName = process.env.LOCAL_MONGODB_DATABASE;
      uri = `mongodb://localhost:27017/${localDatabaseName}`;
    }

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    console.log(`Connected successfully to the ${ENV} database.`);
    return client.db();
  } catch (error) {
    console.error(`Error connecting to the ${ENV} database:`, error);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (client) {
      await client.close();
      console.log("Connection to the database closed.");
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}

module.exports = {
  connectToDatabase,
  closeConnection,
};
