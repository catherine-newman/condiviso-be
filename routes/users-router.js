const usersRouter = require("express").Router();
const { postUser } = require("../controllers/users-controller");
const { patchUser } = require("../controllers/users-controller");
const { getUser } = require("../controllers/users-controller");

usersRouter.route("/").post(postUser)
usersRouter.route("/:_id").patch(patchUser)

usersRouter.route("/:user_id").get(getUser)


module.exports = usersRouter;
