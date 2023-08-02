const recipesRouter = require("express").Router();
const { getRecipe } = require("../controllers/recipes.controller");

recipesRouter.route("/:recipe_id").get(getRecipe);

module.exports = recipesRouter;
