const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/general-controller");
const exampleRouter = require("./example-router");
const usersRouter = require("./users-router");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/test", exampleRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
