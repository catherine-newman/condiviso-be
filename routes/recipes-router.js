const recipesRouter = require("express").Router();
const { getRecipe } = require("../controllers/recipes.controller");
const { getRecipes} = require("../controllers/recipes.controller")
const { postRecipe } = require("../controllers/recipes.controller")
const { patchRecipe} = require("../controllers/recipes.controller")
const { deleteRecipe } = require('../controllers/recipes.controller')

recipesRouter.route("/:recipe_id").get(getRecipe).patch(patchRecipe);
recipesRouter.route("/").get(getRecipes).post(postRecipe);
recipesRouter.route("/:_id").delete(deleteRecipe);
module.exports = recipesRouter;
