const usersRouter = require("express").Router();
const { postUser, getUser } = require("../controllers/users-controller");

usersRouter.route("/").post(postUser);

module.exports = usersRouter;
