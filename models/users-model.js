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



exports.updateUser = async (_id, updateData) => {

  try{
    
    const client = await connectToDatabase();
    const usersCollection = client.db().collection("users");
    const user = await usersCollection.findOne({ _id: _id });
        if (!user) {
      return  Promise.reject({ status: 404, msg: "User not found" });
        }      
        const username = updateData.user_name    
        
        const usernameTaken = await usersCollection.findOne({ user_name: username });
        if (usernameTaken) {
          return Promise.reject({ status: 409, msg: "Username already exists" });
        }
      


    const validKeys = ['first_name', 'last_name', 'email', 'user_name', 'address', 'postcode', 'about_me', 'recipes']
    
    const invalidKeys = Object.keys(updateData).filter(key => !validKeys.includes(key));
    
    if (invalidKeys.length > 0) {
      return  Promise.reject({ status: 400, msg: "Bad Request" });
    }
    const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/;
    
        if (updateData.email && !emailRegex.test(updateData.email)) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        }       

        if (updateData.postcode && !postcodeRegex.test(updateData.postcode)) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        }
      
    
  const updateKey = {};
  if (updateData.first_name) updateKey.first_name = updateData.first_name;
  if (updateData.last_name) updateKey.last_name = updateData.last_name;
  if (updateData.email) updateKey.email = updateData.email;
  if (updateData.user_name) updateKey.user_name = updateData.user_name;
  if (updateData.address) updateKey.address = updateData.address;
  if (updateData.postcode) updateKey.postcode = updateData.postcode;
  if (updateData.about_me) updateKey.about_me = updateData.about_me;
  if (updateData.recipes) updateKey.recipes = updateData.recipes;
  
 

    await usersCollection.updateOne({ _id: _id }, { $set: updateKey });

    const updatedUser = await usersCollection.findOne({ _id: _id });
       return updatedUser;
  }catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

exports.findUser = (user_id) => {
  if (!ObjectId.isValid(user_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  let result;
  return connectToDatabase().then((client) => {
    const collection = client.db().collection("users");
    return collection.findOne({_id: user_id });
  });
};
