const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const request = require("supertest");
const { closeConnection } = require("../db/connection");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.ATLAS_URI = uri;
});

afterAll(async () => {
  await closeConnection();
  await mongod.stop();
});

describe("GET /api/test", () => {
  test("", () => {
    return request(app)
      .get("/api/test")
      .expect(200)
     
  });
});
