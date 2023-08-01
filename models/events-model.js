const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../db/connection");

exports.addEvent = async (
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
  max_attendees,
  attendees,
  recipes
) => {
  if (
    !event_name ||
    !first_name ||
    !last_name ||
    !user_name ||
    !email ||
    !event_date ||
    !event_location ||
    !latitude ||
    !longitude ||
    !latitude_fuzzy ||
    !longitude_fuzzy ||
    !event_city ||
    !event_description ||
    !event_duration ||
    !max_attendees ||
    !attendees ||
    !recipes
  )
    return Promise.reject({ status: 400, msg: "Bad Request" });
  if (recipes.length === 0 || event_duration <= 0 || max_attendees <= 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  for (const recipe of recipes) {
    if (!recipe.recipe_name || !recipe.recipe_image || !recipe.recipe_content) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  }
  const client = await connectToDatabase();
  const eventsCollection = client.db().collection("events");
  const usersCollection = client.db().collection("users");
  findResult = await usersCollection.findOne({ user_name: user_name });
  if (!findResult) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  let newId;
  if (_id) {
    newId = new ObjectId(_id);
  } else {
    newId = new ObjectId();
  }
  const newEvent = {
    _id: newId,
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
    max_attendees,
    attendees,
    recipes,
  };
  return eventsCollection.insertOne(newEvent);
};

exports.findEvent = async (event_id) => {
  if (!ObjectId.isValid(event_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const client = await connectToDatabase();
  const eventsCollection = client.db().collection("events");
  const result = await eventsCollection.findOne({ _id: event_id });
  if (!result) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result;
};
