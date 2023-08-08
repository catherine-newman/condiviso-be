const usersRouter = require("express").Router();
const { postUser } = require("../controllers/users-controller");
const { patchUser } = require("../controllers/users-controller");
const { getUser } = require("../controllers/users-controller");
const { getUsername } = require("../controllers/users-controller")

usersRouter.route("/").post(postUser)
usersRouter.route("/:_id").patch(patchUser)

usersRouter.route("/:user_param").get(getUser)

// usersRouter.route("/:user_name").get(getUsername)


module.exports = usersRouter;
