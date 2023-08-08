const { addEvent } = require("../models/events-model");
const { findEvent } = require("../models/events-model");
const { findEvents } = require("../models/events-model");
const { updateEvent } = require("../models/events-model")

exports.postEvent = (req, res, next) => {
  const {
    _id,
    event_name,
    first_name,
    last_name,
    user_name,
    user_id,
    email,
    event_date,
    event_location,
    postcode,
    latitude,
    longitude,
    latitude_fuzzy,
    longitude_fuzzy,
    event_city,
    event_description,
    event_duration,
    max_attendees,
    attendees,
    recipes,
  } = req.body;
  addEvent(
    _id,
    event_name,
    first_name,
    last_name,
    user_name,
    user_id,
    email,
    event_date,
    event_location,
    postcode,
    latitude,
    longitude,
    latitude_fuzzy,
    longitude_fuzzy,
    event_city,
    event_description,
    event_duration,
    max_attendees,
    attendees,
    recipes
  )
    .then((data) => {
      res.status(201).send({ result: data });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getEvent = (req, res, next) => {
  const { event_id } = req.params;
  findEvent(event_id)
    .then((data) => {
      res.status(200).send({ event: data });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getEvents = (req, res, next) => {
  const { from_date, to_date, lon, lat, dist, unit, spaces, user_id, attending } = req.query;
  findEvents(from_date, to_date, lon, lat, dist, unit, spaces, user_id, attending) 
    .then((data) => {
      res.status(200).send({ events: data });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.patchEvent = (req, res, next) => {
  const {_id} = req.params;
  const patchBody = req.body;
  updateEvent(_id, patchBody)
  .then((updatedEvent) => {
    if(!updatedEvent) {
      return Promise.reject({ status: 404, msg: "Event not found" });
    }
    res.status(200).send({updatedEvent})
  })
  .catch((err) => {
    return next(err);
  });
}