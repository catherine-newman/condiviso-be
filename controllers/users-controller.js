const { addUser} = require("../models/users-model");
const { updateUser} = require("../models/users-model");

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
  

