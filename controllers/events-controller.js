const { addEvent } = require("../models/events-model");

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
