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

describe("GET /api/recipes", ()=>{
  test("should return all recipes", async ()=>{
    const res = await request(app)
    .get("/api/recipes")
    .expect(200)
    expect(res.body.recipes.length).toBe(10);
    res.body.recipes.forEach(recipe =>{
      expect(recipe).toHaveProperty('_id', expect.any(String));
      expect(recipe).toHaveProperty('userid', expect.any(String));
      expect(recipe).toHaveProperty('recipe_name', expect.any(String));
      expect(recipe).toHaveProperty('recipe_ingredients', expect.any(String));
      expect(recipe).toHaveProperty('recipe_content', expect.any(String));
      expect(recipe).toHaveProperty('recipe_image', expect.any(String));

    })
  })
  test('can filter recipes by user id',async ()=>{
    const res = await request(app)
    .get("/api/recipes?userid=64ca4d3dfc13ae0ef3089f7c")
    .expect(200)
    res.body.recipes.forEach(recipe =>{
      expect(recipe).toHaveProperty('userid', '64ca4d3dfc13ae0ef3089f7c')
    })
  })

  test('expect 404 when no recipe exists', async ()=>{
    const res = await request(app)
    .get("/api/recipes?userid=64ca62fffc13ae0edc08b303")
    .expect(404)
    expect(res.body.msg).toBe("Not Found")
  })

  test('expect 400 when userid is not valid', async ()=>{
  const res = await request(app)
  .get("/api/recipes?userid=notvalid")
  .expect(400)
  expect(res.body.msg).toBe("Bad Request")
})
})


describe("POST /api/recipes", () => {
  test("acknowledges the post request and returns an id", () => {
    return request(app)
      .post("/api/recipes")
      .send({
        _id: "64ca62fffc13ae0edc08b303",
        userid: "64ca4d3dfc13ae0ef3089f8a",
        recipe_name: "tomato soup",
        recipe_ingredients: "catfish",
        recipe_content: "mix it up",
        recipe_image: "http://dummyimage.com/186x100.png/cc0000/ffffff"
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toHaveProperty("acknowledged", true);
        expect(body.result).toHaveProperty(
          "insertedId",
          "64ca62fffc13ae0edc08b303"
        );
      });
  });
  test("adds a new event", () => {
    return request(app)
      .post("/api/recipes")
      .send({
        _id: "64ca62fffc13ae0edc08b303",
        userid: "64ca4d3dfc13ae0ef3089f8a",
        recipe_name: "tomato soup",
        recipe_ingredients: "catfish",
        recipe_content: "mix it up",
        recipe_image: "http://dummyimage.com/186x100.png/cc0000/ffffff"
      })
      .expect(201)
      .then(() => {
        return connectToDatabase();
      })
      .then((client) => {
        const collection = client.db().collection("recipes");
        return collection.findOne({
          _id: new ObjectId("64ca62fffc13ae0edc08b303"),
        });
      })
      .then((findResult) => {
        expect(findResult).not.toBe(null);
      });
  });
  // test("status:400, responds with an error message when the request is missing data", () => {
  //   return request(app)
  //     .post("/api/users")
  //     .send({})
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request");
  //     });
  // });
  // test("adds an event when _id is not provided", () => {
  //   return request(app)
  //     .post("/api/events")
  //     .send({
  //       event_name: "Honorable",
  //       first_name: "Sigismond",
  //       last_name: "Sainz",
  //       user_name: "murling0",
  //       email: "ssainz0@weebly.com",
  //       event_date: "3/2/2022",
  //       event_location: "65231 Brentwood Avenue",
  //       latitude: -7.7016409,
  //       longitude: 112.9827091,
  //       latitude_fuzzy: 11.3451287,
  //       longitude_fuzzy: -72.3628361,
  //       event_city: "Grati Satu",
  //       event_description: "Quisque porta volutpat erat. Quisque erat eros.",
  //       event_duration: 2,
  //       max_attendees: 6,
  //       attendees: [
  //         { user_name: "abenettolo0" },
  //         { user_name: "kkellog1" },
  //         { user_name: "bplum2" },
  //         { user_name: "mdavidavidovics3" },
  //       ],
  //       recipes: [
  //         {
  //           recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
  //           recipe_name: "orci",
  //           recipe_content:
  //             "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
  //         },
  //       ],
  //     })
  //     .expect(201)
  //     .then(({ body }) => {
  //       expect(body.result).toHaveProperty("acknowledged", true);
  //       expect(body.result).toHaveProperty("insertedId", expect.any(String));
  //     });
  // });
  // test("status:400 returns an error if event has no recipes", () => {
  //   return request(app)
  //     .post("/api/events")
  //     .send({
  //       _id: "64c7b688411bcf756d6f0867",
  //       event_name: "Honorable",
  //       first_name: "Sigismond",
  //       last_name: "Sainz",
  //       user_name: "murling0",
  //       email: "ssainz0@weebly.com",
  //       event_date: "3/2/2022",
  //       event_location: "65231 Brentwood Avenue",
  //       latitude: -7.7016409,
  //       longitude: 112.9827091,
  //       latitude_fuzzy: 11.3451287,
  //       longitude_fuzzy: -72.3628361,
  //       event_city: "Grati Satu",
  //       event_description: "Quisque porta volutpat erat. Quisque erat eros.",
  //       event_duration: 2,
  //       max_attendees: 6,
  //       attendees: [
  //         { user_name: "abenettolo0" },
  //         { user_name: "kkellog1" },
  //         { user_name: "bplum2" },
  //         { user_name: "mdavidavidovics3" },
  //       ],
  //       recipes: [],
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request");
  //     });
  // });
  // test("status:400 returns an error if values of recipes are blank", () => {
  //   return request(app)
  //     .post("/api/events")
  //     .send({
  //       _id: "64c7b688411bcf756d6f0867",
  //       event_name: "Honorable",
  //       first_name: "Sigismond",
  //       last_name: "Sainz",
  //       user_name: "murling0",
  //       email: "ssainz0@weebly.com",
  //       event_date: "3/2/2022",
  //       event_location: "65231 Brentwood Avenue",
  //       latitude: -7.7016409,
  //       longitude: 112.9827091,
  //       latitude_fuzzy: 11.3451287,
  //       longitude_fuzzy: -72.3628361,
  //       event_city: "Grati Satu",
  //       event_description: "Quisque porta volutpat erat. Quisque erat eros.",
  //       event_duration: 2,
  //       max_attendees: 6,
  //       attendees: [
  //         { user_name: "abenettolo0" },
  //         { user_name: "kkellog1" },
  //         { user_name: "bplum2" },
  //         { user_name: "mdavidavidovics3" },
  //       ],
  //       recipes: [
  //         {
  //           recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
  //           recipe_name: "orci",
  //           recipe_content:
  //             "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
  //         },
  //         {
  //           recipe_image: "",
  //           recipe_name: "",
  //           recipe_content: "",
  //         },
  //       ],
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request");
  //     });
  // });
  // test("status:400 returns an error if event_duration is 0 or lower", () => {
  //   return request(app)
  //     .post("/api/events")
  //     .send({
  //       _id: "64c7b688411bcf756d6f0867",
  //       event_name: "Honorable",
  //       first_name: "Sigismond",
  //       last_name: "Sainz",
  //       user_name: "murling0",
  //       email: "ssainz0@weebly.com",
  //       event_date: "3/2/2022",
  //       event_location: "65231 Brentwood Avenue",
  //       latitude: -7.7016409,
  //       longitude: 112.9827091,
  //       latitude_fuzzy: 11.3451287,
  //       longitude_fuzzy: -72.3628361,
  //       event_city: "Grati Satu",
  //       event_description: "Quisque porta volutpat erat. Quisque erat eros.",
  //       event_duration: -1,
  //       max_attendees: 6,
  //       attendees: [
  //         { user_name: "abenettolo0" },
  //         { user_name: "kkellog1" },
  //         { user_name: "bplum2" },
  //         { user_name: "mdavidavidovics3" },
  //       ],
  //       recipes: [
  //         {
  //           recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
  //           recipe_name: "orci",
  //           recipe_content:
  //             "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
  //         },
  //       ],
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request");
  //     });
  // });
  // test("status:400 returns an error if max_attendees is 0 or lower", () => {
  //   return request(app)
  //     .post("/api/events")
  //     .send({
  //       _id: "64c7b688411bcf756d6f0867",
  //       event_name: "Honorable",
  //       first_name: "Sigismond",
  //       last_name: "Sainz",
  //       user_name: "murling0",
  //       email: "ssainz0@weebly.com",
  //       event_date: "3/2/2022",
  //       event_location: "65231 Brentwood Avenue",
  //       latitude: -7.7016409,
  //       longitude: 112.9827091,
  //       latitude_fuzzy: 11.3451287,
  //       longitude_fuzzy: -72.3628361,
  //       event_city: "Grati Satu",
  //       event_description: "Quisque porta volutpat erat. Quisque erat eros.",
  //       event_duration: 1,
  //       max_attendees: -1,
  //       attendees: [
  //         { user_name: "abenettolo0" },
  //         { user_name: "kkellog1" },
  //         { user_name: "bplum2" },
  //         { user_name: "mdavidavidovics3" },
  //       ],
  //       recipes: [
  //         {
  //           recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
  //           recipe_name: "orci",
  //           recipe_content:
  //             "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
  //         },
  //       ],
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request");
  //     });
  // });
  // test("status:400 returns an error if user_name is not in the database", () => {
  //   return request(app)
  //     .post("/api/events")
  //     .send({
  //       _id: "64c7b688411bcf756d6f0867",
  //       event_name: "Honorable",
  //       first_name: "Sigismond",
  //       last_name: "Sainz",
  //       user_name: "nonexistentusername",
  //       email: "ssainz0@weebly.com",
  //       event_date: "3/2/2022",
  //       event_location: "65231 Brentwood Avenue",
  //       latitude: -7.7016409,
  //       longitude: 112.9827091,
  //       latitude_fuzzy: 11.3451287,
  //       longitude_fuzzy: -72.3628361,
  //       event_city: "Grati Satu",
  //       event_description: "Quisque porta volutpat erat. Quisque erat eros.",
  //       event_duration: 1,
  //       max_attendees: 7,
  //       attendees: [
  //         { user_name: "abenettolo0" },
  //         { user_name: "kkellog1" },
  //         { user_name: "bplum2" },
  //         { user_name: "mdavidavidovics3" },
  //       ],
  //       recipes: [
  //         {
  //           recipe_image: "http://dummyimage.com/202x100.png/5fa2dd/ffffff",
  //           recipe_name: "orci",
  //           recipe_content:
  //             "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
  //         },
  //       ],
  //     })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request");
  //     });
  // });
});