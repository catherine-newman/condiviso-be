const { connectToDatabase } = require("../db/connection");

exports.findExample = () => {
  return connectToDatabase("sample_restaurants").then((db) => {
    const collection = db.collection("neighborhoods");
    return collection.find({}).toArray();
  });
};
