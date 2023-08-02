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

describe("GET /api/recipes/:recipe_id", () => {
  test("returns the recipe for the specified id", () => {
    return request(app)
      .get("/api/recipes/64ca4d3dfc13ae0ef3089f7b")
      .expect(200)
      .then(({ body }) => {
        expect(body.recipe).toHaveProperty("_id", "64ca4d3dfc13ae0ef3089f7b");
        expect(body.recipe).toHaveProperty(
          "userid",
          "64ca4d3dfc13ae0ef3089f7c"
        );
        expect(body.recipe).toHaveProperty(
          "recipe_name",
          "Numi - Assorted Teas"
        );
        expect(body.recipe).toHaveProperty(
          "recipe_ingredients",
          "Soup - Campbells, Cream Of"
        );
        expect(body.recipe).toHaveProperty(
          "recipe_content",
          "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus."
        );
        expect(body.recipe).toHaveProperty(
          "recipe_image",
          "http://dummyimage.com/187x100.png/5fa2dd/ffffff"
        );
      });
  });
  test("status:404 responds with an error message when there are no matches", () => {
    return request(app)
      .get("/api/recipes/64ca3cc7fc13ae64a6af1852")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("status:400 responds with an error message when id is not valid", () => {
    return request(app)
      .get("/api/recipes/testing")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
