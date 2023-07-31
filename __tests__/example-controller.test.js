const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const request = require("supertest");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongod.stop();
});

describe("test", () => {
  describe("get /test", () => {
    test("successful", async () => {
      const res = await request(app).get("/api/test");
      expect(res.statusCode).toEqual(200);
    });
  });
});
