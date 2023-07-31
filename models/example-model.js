const { connectToDatabase } = require("../db/connection");

exports.findExample = () => {
  return connectToDatabase().then((db) => {
    const collection = db.collection("users");
    return collection.find({}).toArray();
  });
};
