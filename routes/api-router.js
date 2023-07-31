const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/general-controller");
const exampleRouter = require("./example-router");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/test", exampleRouter);

module.exports = apiRouter;
