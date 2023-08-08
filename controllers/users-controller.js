const { addUser } = require("../models/users-model");
const { updateUser } = require("../models/users-model");
const { findUser } = require("../models/users-model");
const { findUsername } = require("../models/users-model")
const { ObjectId } = require("mongodb");
const {findUserById} = require("../models/users-model")
const {findUserByUsername} = require("../models/users-model")

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
    recipes,
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

exports.patchUser = (req, res, next) => {
  const { _id } = req.params;
  const updateData = req.body;

  updateUser(_id, updateData)
    .then((updatedUser) => {
      res.status(200).send({ user: updatedUser });
    })
    .catch((err) => {
      return next(err);
    });
};

// exports.getUser = (req, res, next) => {
//   const { user_id } = req.params;
//   findUser(user_id)
//     .then((data) => {
//       if (!data) {
//         return Promise.reject({ status: 404, msg: "User not found" });
//       }

//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       return next(err);
//     });
// };

// exports.getUsername = async (req, res, next) => {
//   console.log("in controller <<<<<<")
//   const { user_name } = req.params;
//   try {
//     const data = await findUsername(user_name);
//     res.status(200).send({ user : data });
//   } catch (err) {
//     return next(err);
//   }
// }
exports.getUser = async (req, res, next) => {
  const { user_param } = req.params;
  try {
    if (ObjectId.isValid(user_param)) {
      const data = await findUserById(user_param);
      if (data === null){
        res.status(404).send({ msg: "User not found"})
      }else{
        res.status(200).send({ user: data });
      }
    }                 // IF THIS CHECKS OUT REMOVE THE REQUIRES FROM THE TOP
     else {
      const data = await findUserByUsername(user_param);
      if(data === null){
        res.status(400).send({ msg: "Bad Request"});
      }else{
      res.status(200).send({ user: data });
    }
  } 
}
catch (err) {
  return next(err);
}
};
