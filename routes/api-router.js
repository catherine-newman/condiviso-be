const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/general-controller");
const exampleRouter = require("./example-router");
const usersRouter = require("./users-router");
const eventsRouter = require("./events-router");
const recipesRouter = require("./recipes-router");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/test", exampleRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/recipes", recipesRouter);

module.exports = apiRouter;
