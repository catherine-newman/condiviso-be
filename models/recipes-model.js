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

exports.findRecipes = async (userid) => {
  client = await connectToDatabase();
  collection = client.db().collection("recipes");
  let result;
  if(userid) {
   if(!ObjectId.isValid(userid)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  result = await collection.find({ userid: userid }).toArray()
}
  else  result = await collection.find().toArray();
  if (!result.length) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result;
};

exports.addRecipe = async (_id, userid, recipe_name, recipe_ingredients, recipe_content, recipe_image) => {
  if (!userid ||
    !recipe_name ||
    !recipe_ingredients ||
    !recipe_content ||
    !recipe_image
    ) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  client = await connectToDatabase();
  recipesCollection = client.db().collection("recipes");
  usersCollection = client.db().collection("users");
  const findResult = await usersCollection.findOne({ _id : userid});
  if (!findResult) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const newRecipe = {_id : new ObjectId(_id), userid, recipe_name, recipe_ingredients, recipe_content, recipe_image};
  result = await recipesCollection.insertOne(newRecipe);
  return result;
}