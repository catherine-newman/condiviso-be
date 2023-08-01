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

exports.findEvents = async (
  from_date,
  to_date,
  lon,
  lat,
  dist = 10,
  unit,
  spaces
) => {
  const client = await connectToDatabase();
  const eventsCollection = client.db().collection("events");
  const dateRegex = /^[0-9]{4}(\/|-)(1[0-2]|0?[1-9])(\/|-)(3[01]|[12][0-9]|0?[1-9])$/;
  const query = {};
  if (from_date) {
    if (!dateRegex.test(from_date)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    query.event_date = query.event_date || {};
    query.event_date.$gte = new Date(from_date).toISOString();
  }
  if (to_date) {
    if (!dateRegex.test(to_date)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    query.event_date = query.event_date || {};
    query.event_date.$lte = new Date(to_date).toISOString();
  }
  if (spaces) {
    if (spaces !== "true") {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    query.spaces_free = query.spaces_left || {};
    query.spaces_free.$gt = 0;
  }
  if (lat && lon) {
    const lonRegex =
      /^(\+|-)?(?:180(?:(?:\.0{1,7})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,7})?))$/;
    const latRegex =
      /^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/;
    if (!lonRegex.test(lon) || !latRegex.test(lat)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    let distMult = 3959;
    if (unit === "k") {
      distMult = 6371;
    }
    await eventsCollection.createIndex({ coordinate_fuzzy: "2dsphere" });
    const result = await eventsCollection
      .aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(lon), Number(lat)],
            },
            distanceField: "distance",
            maxDistance: Number(dist),
            spherical: true,
            distanceMultiplier: distMult,
          },
        },
        { $match: query },
      ])
      .sort({ event_date: 1 })
      .toArray();
    return result;
  }
  const result = await eventsCollection
    .find(query)
    .sort({ event_date: 1 })
    .toArray();
    if (result.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  return result;
};
