const eventsRouter = require("express").Router();
const { postEvent } = require("../controllers/events-controller");
const { getEvent } = require("../controllers/events-controller");
const { getEvents } = require("../controllers/events-controller");

eventsRouter.route("/").post(postEvent).get(getEvents);
eventsRouter.route("/:event_id").get(getEvent);

module.exports = eventsRouter;
