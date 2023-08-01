const eventsRouter = require("express").Router();
const { postEvent } = require("../controllers/events-controller");

eventsRouter.route("/").post(postEvent);

module.exports = eventsRouter;
