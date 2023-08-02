const recipesRouter = require("express").Router();
const { getRecipe } = require("../controllers/recipes.controller");
const { getRecipes} = require("../controllers/recipes.controller")
const { postRecipe } = require("../controllers/recipes.controller")

recipesRouter.route("/:recipe_id").get(getRecipe);
recipesRouter.route("/").get(getRecipes).post(postRecipe);

module.exports = recipesRouter;
