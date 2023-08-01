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
});
