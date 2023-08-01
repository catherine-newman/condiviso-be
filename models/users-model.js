const { connectToDatabase } = require("../db/connection");
const { ObjectId } = require("mongodb");

exports.addUser = async (
  _id,
  first_name,
  last_name,
  email,
  user_name,
  address,
  postcode,
  about_me,
  recipes) => {
  if (
    !first_name ||
    !last_name ||
    !email ||
    !user_name ||
    !address ||
    !postcode ||
    !about_me ||
    !recipes
  )
    return Promise.reject({ status: 400, msg: "Bad Request" });
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/;
  if (!emailRegex.test(email) || !postcodeRegex.test(postcode)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  try {
    const client = await connectToDatabase();
    const collection = client.db().collection("users");
    lowerUserName = user_name.toLowerCase();
    findResult = await collection.findOne({ user_name: lowerUserName });
    if (findResult) {
      return Promise.reject({ status: 409, msg: "Username already exists" });
    } else {
      let newId;
      if (_id) {
        newId = new ObjectId(_id);
      } else {
        newId = new ObjectId();
      }
      const newUser = {
        _id: newId,
        first_name,
        last_name,
        user_name: lowerUserName,
        address,
        postcode,
        about_me,
        recipes
      };
      return collection.insertOne(newUser);
    }
  } catch (err) {
    console.error("Error accessing the database:", err);
    throw err;
  }
};

exports.findUser = (user_id) => {
  if (!ObjectId.isValid(user_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return connectToDatabase().then((client) => {
    const collection = client.db().collection("users");
    return collection.findOne({_id: user_id });
  });
};