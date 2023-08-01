const { addUser } = require("../models/users-model");

exports.postUser = (req, res, next) => {
  const {
    _id,
    first_name,
    last_name,
    email,
    user_name,
    address,
    postcode,
    about_me,
    recipes
  } = req.body;
  addUser(
    _id,
    first_name,
    last_name,
    email,
    user_name,
    address,
    postcode,
    about_me,
    recipes
  )
    .then((data) => {
      res.status(201).send({ result: data });
    })
    .catch((err) => {
      return next(err);
    });
};
