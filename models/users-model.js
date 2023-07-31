const { connectToDatabase } = require("../db/connection");

exports.addUser = async (
  first_name,
  last_name,
  email,
  user_name,
  address,
  postcode,
  about_me,
  recipes,
  recipe_image
) => {
  if (
    !first_name ||
    !last_name ||
    !email ||
    !user_name ||
    !address ||
    !postcode ||
    !about_me ||
    !recipes ||
    !recipe_image
  )
    return Promise.reject({ status: 400, msg: "Bad Request" });
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  try {
    const client = await connectToDatabase();
    const collection = client.db().collection("users");
    findResult = await collection.findOne({ user_name: user_name });
    if (findResult) {
      return Promise.reject({ status: 409, msg: "Username already exists" });
    } else {
      const newUser = {
        first_name,
        last_name,
        user_name,
        address,
        postcode,
        about_me,
        recipes,
        recipe_image,
      };
      return collection.insertOne(newUser);
    }
  } catch (err) {
    console.error("Error accessing the database:", err);
    throw err;
  }
};
