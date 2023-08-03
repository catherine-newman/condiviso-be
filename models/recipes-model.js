const { connectToDatabase } = require("../db/connection");
const { ObjectId } = require("mongodb");

exports.findRecipe = async (recipe_id) => {
  if (!ObjectId.isValid(recipe_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const client = await connectToDatabase();
  const collection = client.db().collection("recipes");
  const result = await collection.findOne({ _id: recipe_id });
  if (!result) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result;
};

exports.findRecipes = async (userid) => {
  const client = await connectToDatabase();
  const collection = client.db().collection("recipes");
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
  const client = await connectToDatabase();
  const recipesCollection = client.db().collection("recipes");
  const usersCollection = client.db().collection("users");
  const findResult = await usersCollection.findOne({ _id : userid});
  if (!findResult) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const newRecipe = {_id : new ObjectId(_id), userid, recipe_name, recipe_ingredients, recipe_content, recipe_image};
  result = await recipesCollection.insertOne(newRecipe);
  return result;
}

exports.updateRecipe = async ( recipe_name,recipe_ingredients,recipe_content, recipe_image, recipe_id) =>{
  if (!ObjectId.isValid(recipe_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const client = await connectToDatabase();
  const recipesCollection = client.db().collection("recipes");
  const findRecipe = await recipesCollection.findOne({ _id: recipe_id })
  if(!findRecipe || findRecipe === null){
    return Promise.reject({ status: 404 , msg: "Not Found"})
  }
  const amendments ={}
  if(recipe_name) amendments.recipe_name = recipe_name;
  if(recipe_ingredients) amendments.recipe_ingredients = recipe_ingredients;
  if(recipe_content) amendments.recipe_content = recipe_content;
  if(recipe_image) amendments.recipe_image = recipe_image;
  await recipesCollection.updateOne(findRecipe, {$set: amendments})
  const amendedRecipe = await recipesCollection.findOne({ _id: recipe_id });
  return amendedRecipe;
}