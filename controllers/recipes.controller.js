const { findRecipe } = require("../models/recipes-model");
const { findRecipes } = require("../models/recipes-model");

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