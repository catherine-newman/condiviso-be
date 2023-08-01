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
    !attendees ||
    !recipes
  )
    return Promise.reject({ status: 400, msg: "Bad Request" });
  try {
    const client = await connectToDatabase();
    const collection = client.db().collection("events");
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
      attendees,
      recipes,
    };
    return collection.insertOne(newEvent);
  } catch (err) {
    console.error("Error accessing the database:", err);
    throw err;
  }
};
