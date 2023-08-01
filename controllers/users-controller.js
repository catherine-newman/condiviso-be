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

exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  findUser(user_id)
    .then((data) => {
      if(data === null) {
        return Promise.reject({ status: 404, msg: "User not found"})
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      return next(err);
    });
};
