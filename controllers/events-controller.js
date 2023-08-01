const { addEvent, findEvent } = require("../models/events-model");

exports.postEvent = (req, res, next) => {
  const {
    _id,
    event_name,
    first_name,
    last_name,
    user_name,
    email,
    event_date,
    event_location,
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
    email,
    event_date,
    event_location,
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
