const exampleRouter = require("express").Router();
const { getExample } = require("../controllers/example-controller");

exampleRouter.route("/").get(getExample);

module.exports = exampleRouter;
