const { MongoClient, ServerApiVersion } = require("mongodb");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.ATLAS_URI && !process.env.LOCAL_MONGODB_DATABASE) {
  console.log(`${__dirname}/.env.${ENV}`);
  throw new Error("ATLAS_URI or LOCAL_MONGODB_DATABASE not set");
}

async function connectToDatabase(databaseName) {
  try {
    let uri;
    if (ENV === "production") {
      uri = process.env.ATLAS_URI;
    } else {
      const localDatabaseName = process.env.LOCAL_MONGODB_DATABASE;
      uri = `mongodb://localhost:27017/${localDatabaseName}`;
    }

    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

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
