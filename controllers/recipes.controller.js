const { findRecipe } = require("../models/recipes-model");
const { findRecipes } = require("../models/recipes-model");
const { addRecipe } = require("../models/recipes-model");
const { updateRecipe} = require("../models/recipes-model")

exports.getRecipe = async (req, res, next) => {
  const { recipe_id } = req.params;
  try {
    const data = await findRecipe(recipe_id);
    res.status(200).send({ recipe: data });
  } catch (err) {
    return next(err);
  }
};

exports.getRecipes = async (req, res, next) => {
  const { userid } = req.query;
  try {
    const data = await findRecipes(userid);
    res.status(200).send({ recipes: data });
  } catch (err) {
    return next(err);
  }
};

exports.postRecipe = async (req, res, next) => {
  const { _id, userid, recipe_name, recipe_ingredients, recipe_content, recipe_image } = req.body;
  try {
    const data = await addRecipe(_id, userid, recipe_name, recipe_ingredients, recipe_content, recipe_image);
    res.status(201).send({ result: data });
  } catch (err) {
    return next(err);
  }
};

exports.patchRecipe = async(req, res, next) =>{
  const { recipe_name, recipe_ingredients, recipe_content, recipe_image } = req.body;
  const { recipe_id} = req.params;
  try{
    const data = await updateRecipe(recipe_name,recipe_ingredients,recipe_content, recipe_image, recipe_id);
    res.status(200).send({ result: data});
  }catch(err){
    return next(err);
  }
}