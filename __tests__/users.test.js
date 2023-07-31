const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const request = require("supertest");
const { connectToDatabase, closeConnection } = require("../db/connection");
const seedDatabase = require("../db/data/run-seed");

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

describe("POST /api/users", () => {
  test("acknowledges the post request and returns an id", () => {
    return request(app)
      .post("/api/users")
      .send({
        first_name: "test",
        last_name: "person",
        email: "email@email.com",
        user_name: "testperson",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: "a recipe string",
        recipe_image: "a recipe image",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toHaveProperty("acknowledged", true);
        expect(body.result).toHaveProperty("insertedId", expect.any(String));
      });
  });
  test("adds a new user", () => {
    return request(app)
      .post("/api/users")
      .send({
        first_name: "test",
        last_name: "person",
        email: "email@email.com",
        user_name: "testperson2",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: "a recipe string",
        recipe_image: "a recipe image",
      })
      .expect(201)
      .then(() => {
        return connectToDatabase()
      })
      .then((client) => {
        const collection = client.db().collection("users");
        return collection.findOne({ user_name: "testperson2"})
      })
      .then((findResult) => {
        expect(findResult).not.toBe(null);
      })
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
  test("status:400, responds with an error message when the email is invalid", () => {
    return request(app)
      .post("/api/users")
      .send({
        first_name: "test",
        last_name: "person",
        email: "emaidfsdfm",
        user_name: "testperson3",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: "a recipe string",
        recipe_image: "a recipe image",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when the postcode is invalid", () => {
    return request(app)
      .post("/api/users")
      .send({
        first_name: "test",
        last_name: "person",
        email: "email@email.com",
        user_name: "testperson4",
        address: "123 street",
        postcode: "sk13sdfff",
        about_me: "I'm just a test",
        recipes: "a recipe string",
        recipe_image: "a recipe image",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message when username already exists", () => {
    return request(app)
      .post("/api/users")
      .send({
        first_name: "test",
        last_name: "person",
        user_name: "dwycliffe9",
        email: "email@email.com",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: "a recipe string",
        recipe_image: "a recipe image",
      })
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe("Username already exists");
      });
  });
});
