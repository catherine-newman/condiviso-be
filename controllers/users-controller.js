const { addUser} = require("../models/users-model");
const { updateUser} = require("../models/users-model");
const { findUser } = require("../models/users-model");

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



exports.patchUser = (req, res, next) => {
        const { _id } = req.params;
        const updateData = req.body;
        
       
    updateUser(_id, updateData)
      .then((updatedUser) => {
        res.status(200).send({user: updatedUser})
      })
      .catch((err) => {
      console.log(  Object.keys(err), 'here')
        return next(err)
        })
      }
  


exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  findUser(user_id)
    .then((data) => {
   
      if (!data) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }

      res.status(200).send(data);
    })
    .catch((err) => {
      return next(err);
    });
};
