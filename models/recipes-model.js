const { connectToDatabase } = require("../db/connection");
const { ObjectId } = require("mongodb");

exports.findRecipe = async (recipe_id) => {
  if (!ObjectId.isValid(recipe_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  client = await connectToDatabase();
  collection = client.db().collection("recipes");
  const result = await collection.findOne({ _id: recipe_id });
  if (!result) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result;
};
