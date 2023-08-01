const { addUser, findUser } = require("../models/users-model");

exports.postUser = (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    user_name,
    address,
    postcode,
    about_me,
    recipes,
    recipe_image,
  } = req.body;
  addUser(
    first_name,
    last_name,
    email,
    user_name,
    address,
    postcode,
    about_me,
    recipes,
    recipe_image
  )
    .then((data) => {
      res.status(201).send({ result: data });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  findUser(user_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      return next(err);
    });
};
