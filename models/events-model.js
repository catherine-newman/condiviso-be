const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../db/connection");

exports.addEvent = async (
  _id,
  event_name,
  first_name,
  last_name,
  user_name,
  user_id,
  email,
  event_date,
  event_location,
  postcode,
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
    !user_id ||
    !email ||
    !event_date ||
    !event_location ||
    !postcode ||
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
    const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/;
  if (recipes.length === 0 || event_duration <= 0 || max_attendees <= 0 || !postcodeRegex.test(postcode)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const client = await connectToDatabase();
  const eventsCollection = client.db("condiviso").collection("events");
  const usersCollection = client.db("condiviso").collection("users");
  const findResult = await usersCollection.findOne({ _id: user_id });
  if (!findResult) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const newEvent = {
    _id: new ObjectId(_id),
    event_name,
    first_name,
    last_name,
    user_name,
    user_id,
    email,
    event_date: new Date(event_date),
    event_location,
    postcode,
    coordinate: {type: "Point", "coordinates": [Number(longitude), Number(latitude)]},
    coordinate_fuzzy: {type: "Point", "coordinates": [Number(longitude_fuzzy), Number(latitude_fuzzy)]},
    event_city,
    event_description,
    event_duration: Number(event_duration),
    max_attendees: Number(max_attendees),
    spaces_free: Number(max_attendees) - attendees.length,
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
  const eventsCollection = client.db("condiviso").collection("events");
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
  spaces,
  user_id
) => {
  const client = await connectToDatabase();
  const eventsCollection = client.db("condiviso").collection("events");
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
  if (user_id) {
    if (!ObjectId.isValid(user_id)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    query.user_id = query.user_id || {};
    query.user_id = user_id;
  }
  if (lat && lon) {
    const lonRegex =
      /^(\+|-)?(?:180(?:(?:\.0{1,7})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,7})?))$/;
    const latRegex =
      /^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/;
    if (!lonRegex.test(lon) || !latRegex.test(lat)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    let distMult = 1609.34 * Number(dist);
    if (unit === "k") {
      distMult = 1000 * Number(dist);
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
            distanceField: "dist.calculated",
            key: "coordinate_fuzzy",
            maxDistance: distMult,
            spherical: true,
            includeLocs: "dist.location"
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

exports.updateEvent = (_id, patchBody) => {
  const letterRegex = /^[0-9A-Za-z\s\.,!?()-]*$/;
  const dateRegex = /^[0-9A-Za-z\:.-]*$/;
 

  if(!patchBody.event_name.match(letterRegex) || !patchBody.event_date.match(dateRegex) || isNaN(patchBody.event_duration) || !Array.isArray(patchBody.attendees)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!ObjectId.isValid(_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const updateObj = {};
if (patchBody.event_name) updateObj.event_name = patchBody.event_name;
if (patchBody.event_date) updateObj.event_date = new Date(patchBody.event_date);
if (patchBody.event_description) updateObj.event_description = patchBody.event_description;
if (patchBody.event_duration) updateObj.event_duration = Number(patchBody.event_duration);
if (patchBody.attendees) {
  updateObj.attendees = patchBody.attendees;
  updateObj.spaces_free = patchBody.max_attendees - patchBody.attendees.length;
}


  return connectToDatabase().then((client) => {
    const eventsCollection = client.db("condiviso").collection("events");
    return eventsCollection.updateOne({ _id: _id }, {$set: updateObj}).then(() => {
      const updateEvent = eventsCollection.findOne({ _id: _id })
      return updateEvent

    })
  })
};
