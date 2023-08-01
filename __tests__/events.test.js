const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const request = require("supertest");
const { connectToDatabase, closeConnection } = require("../db/connection");
const seedDatabase = require("../db/data/run-seed");
const { ObjectId } = require("mongodb");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.LOCAL_MONGODB_URI = uri;
});

beforeEach(() => {
  return seedDatabase();
});

afterAll(async () => {
  await closeConnection();
  await mongod.stop();
});

describe("POST /api/events", () => {
  test("acknowledges the post request and returns an id", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 2,
        max_attendees: 6,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
        ],
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toHaveProperty("acknowledged", true);
        expect(body.result).toHaveProperty(
          "insertedId",
          "64c7b688411bcf756d6f0867"
        );
      });
  });
  test("adds a new event", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Totally unique event name",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 2,
        max_attendees: 6,
        attendees: [],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
        ],
      })
      .expect(201)
      .then(() => {
        return connectToDatabase();
      })
      .then((client) => {
        const collection = client.db().collection("events");
        return collection.findOne({
          _id: new ObjectId("64c7b688411bcf756d6f0867"),
        });
      })
      .then((findResult) => {
        expect(findResult).not.toBe(null);
      });
  });
  test("status:400, responds with an error message when the request is missing data", () => {
    return request(app)
      .post("/api/users")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("adds an event when _id is not provided", () => {
    return request(app)
      .post("/api/events")
      .send({
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 2,
        max_attendees: 6,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
        ],
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toHaveProperty("acknowledged", true);
        expect(body.result).toHaveProperty("insertedId", expect.any(String));
      });
  });
  test("status:400 returns an error if event has no recipes", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 2,
        max_attendees: 6,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400 returns an error if values of recipes are blank", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 2,
        max_attendees: 6,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
          {
            recipe_image: "",
            recipe_name: "",
            recipe_content: "",
          },
        ],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400 returns an error if event_duration is 0 or lower", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: -1,
        max_attendees: 6,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
        ],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400 returns an error if max_attendees is 0 or lower", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 1,
        max_attendees: -1,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
        ],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400 returns an error if user_name is not in the database", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "nonexistentusername",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 1,
        max_attendees: 7,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: [
          {
            recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
            recipe_name: "orci",
            recipe_content:
              "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
          },
        ],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/events/", () => {
  test("returns the event for the specified id", () => {
    return request(app)
      .get("/api/events/64c7b688411bcf756d6f0811")
      .expect(200)
      .then(({ body }) => {
        expect(body.event).toHaveProperty("_id", "64c7b688411bcf756d6f0811");
        expect(body.event).toHaveProperty("first_name", "Sigismond");
        expect(body.event).toHaveProperty("last_name", "Sainz");
        expect(body.event).toHaveProperty("user_name", "murling0");
        expect(body.event).toHaveProperty("email", "ssainz0@weebly.com");
        expect(body.event).toHaveProperty("event_date", "3/2/2022");
        expect(body.event).toHaveProperty(
          "event_location",
          "65231 Brentwood Avenue"
        );
        expect(body.event).toHaveProperty("latitude", -7.7016409);
        expect(body.event).toHaveProperty("longitude", 112.9827091);
        expect(body.event).toHaveProperty("latitude_fuzzy", 11.3451287);
        expect(body.event).toHaveProperty("longitude_fuzzy", -72.3628361);
        expect(body.event).toHaveProperty("event_city", "Grati Satu");
        expect(body.event).toHaveProperty(
          "event_description",
          "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius."
        );
        expect(body.event).toHaveProperty("event_duration", 2);
        expect(body.event).toHaveProperty("max_attendees", 10);
        expect(body.event).toHaveProperty("attendees", expect.any(Array));
        expect(body.event).toHaveProperty("recipes", expect.any(Array));
      });
  });
  test("status:404 responds with an error message when there are no matches", () => {
    return request(app)
      .get("/api/events/64c89688411bcf745d6f0811")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("status:400 responds with an error message when id is not valid", () => {
    return request(app)
      .get("/api/events/testing")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
