const eventsRouter = require("express").Router();
const { postEvent, getEvent } = require("../controllers/events-controller");

eventsRouter.route("/").post(postEvent);
eventsRouter.route("/:event_id").get(getEvent);

module.exports = eventsRouter;
