const { findRecipe } = require("../models/recipes-model");

exports.getRecipe = async (req, res, next) => {
  const { recipe_id } = req.params;
  try {
    const data = await findRecipe(recipe_id);
    res.status(200).send({ recipe: data });
  } catch (err) {
    return next(err);
  }
};
