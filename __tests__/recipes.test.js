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
          "user_id",
          "64c7abf68c2d17441844e6fd"
        );
        expect(body.recipe).toHaveProperty(
          "recipe_name",
          "Classic Spaghetti Carbonara"
        );
        expect(body.recipe).toHaveProperty(
          "recipe_ingredients",
          "200g spaghetti, 100g pancetta diced, 2 large eggs, 50g grated Pecorino Romano cheese, 2 cloves garlic minced, Salt and black pepper to taste"
        );
        expect(body.recipe).toHaveProperty(
          "recipe_content",
          "Boil spaghetti until al dente. In a pan, cook pancetta and garlic until crispy. In a bowl, whisk eggs and cheese. Drain spaghetti and add to the pancetta pan. Turn off the heat and quickly mix in the egg mixture. The heat will cook the eggs. Season with salt and pepper. Serve immediately."
        );
        expect(body.recipe).toHaveProperty(
          "recipe_image",
          "Spaghetti_Carbonara.jpeg"
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
      expect(recipe).toHaveProperty('user_id', expect.any(String));
      expect(recipe).toHaveProperty('recipe_name', expect.any(String));
      expect(recipe).toHaveProperty('recipe_ingredients', expect.any(String));
      expect(recipe).toHaveProperty('recipe_content', expect.any(String));
      expect(recipe).toHaveProperty('recipe_image', expect.any(String));

    })
  })
  test('can filter recipes by user id',async ()=>{
    const res = await request(app)
    .get("/api/recipes?user_id=64c7abf68c2d17441844e6fd")
    .expect(200)
    res.body.recipes.forEach(recipe =>{
      expect(recipe).toHaveProperty('user_id', '64c7abf68c2d17441844e6fd')
    })
  })

  test('expect 404 when no recipe exists', async ()=>{
    const res = await request(app)
    .get("/api/recipes?user_id=64ca62fffc13ae0edc08b303")
    .expect(404)
    expect(res.body.msg).toBe("Not Found")
  })

  test('expect 400 when user_id is not valid', async ()=>{
  const res = await request(app)
  .get("/api/recipes?user_id=notvalid")
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
        user_id: "64c7abf68c2d17441844e6fd",
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
        user_id: "64c7abf68c2d17441844e6fd",
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
  test("status:400, responds with an error message when the request is missing data", () => {
    return request(app)
      .post("/api/recipes")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("adds a recipe when _id is not provided", () => {
    return request(app)
      .post("/api/recipes")
      .send({
        user_id: "64c7abf68c2d17441844e6fd",
        recipe_name: "tomato soup",
        recipe_ingredients: "catfish",
        recipe_content: "mix it up",
        recipe_image: "http://dummyimage.com/186x100.png/cc0000/ffffff"
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toHaveProperty("acknowledged", true);
        expect(body.result).toHaveProperty("insertedId", expect.any(String));
      });
  });
  test("status:400 returns an error if user_id is not in the database", () => {
    return request(app)
      .post("/api/recipes")
      .send({
        user_id: "64ca8547fc13ae0edc08b319",
        recipe_name: "tomato soup",
        recipe_ingredients: "catfish",
        recipe_content: "mix it up",
        recipe_image: "http://dummyimage.com/186x100.png/cc0000/ffffff"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});


describe("PATCH /api/recipes/recipe_id", ()=>{
  test("Updates and returns a recipe when passed a single value",()=>{
    return request(app)
    .patch("/api/recipes/64ca4d3dfc13ae0ef3089f7b")
    .send({
      recipe_name: "Pizza"
    })
    .expect(200)
    .then(({ body })=> {
      const updatedRecipe = body.result
      expect(updatedRecipe.recipe_name).toBe("Pizza")
      expect(updatedRecipe.recipe_ingredients).toBe("200g spaghetti, 100g pancetta diced, 2 large eggs, 50g grated Pecorino Romano cheese, 2 cloves garlic minced, Salt and black pepper to taste")
      expect(updatedRecipe.recipe_content).toBe("Boil spaghetti until al dente. In a pan, cook pancetta and garlic until crispy. In a bowl, whisk eggs and cheese. Drain spaghetti and add to the pancetta pan. Turn off the heat and quickly mix in the egg mixture. The heat will cook the eggs. Season with salt and pepper. Serve immediately.")
      expect(updatedRecipe.recipe_image).toBe("Spaghetti_Carbonara.jpeg")
    });
  });
  test("Updates and returns a recipe when passed multiple values",()=>{
    return request(app)
    .patch("/api/recipes/64ca4d3dfc13ae0ef3089f7d")
    .send({
      recipe_name: "Madras",
      recipe_content: "chop it - make it"

    })
    .expect(200)
    .then(({ body })=> {
      const updatedRecipe = body.result
      expect(updatedRecipe.recipe_name).toBe("Madras")
      expect(updatedRecipe.recipe_ingredients).toBe("4 boneless, skinless chicken breasts 2 lemons, juiced and zested 2 tbsp olive oil 2 cloves garlic minced, 1 tsp dried thyme, 1 tsp dried rosemary Salt and pepper to taste")
      expect(updatedRecipe.recipe_content).toBe("chop it - make it")
      expect(updatedRecipe.recipe_image).toBe("Lemon_herb_chicken.jpeg")
    });
  });

  test("Should return 400 Bad Request when provided an invalid recipe_id",()=>{
    return request(app)
    .patch("/api/recipes/64ca4d3dfc13ae0ef3089f")  
    .send({
      recipe_name: "Madras",
      recipe_content: "chop it - make it"

    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
  });

  test("Should return 404 Not Found when provided recipe_id is valid but does not reference any data ",()=>{
    return request(app)
    .patch("/api/recipes/64ca4d3dfc13ae0ef3089f7a")   //64ca4d3dfc13ae0ef3089f80    64ca4d3dfc13ae0ef3089f7a
    .send({
      recipe_name: "Madras",
      recipe_content: "chop it - make it"
    })
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Not Found")
    })
  })
});


describe('DELETE /api/recipes/:_id', () => {
  test('204: no content', async () => {
    await request(app)
    .delete("/api/recipes/64ca4d3dfc13ae0ef3089f7b")
    .expect(204)
    .then((data) => {
      expect(data.body).toEqual({});
    })
    const client = await connectToDatabase();
   
      const recipeCollection = client.db().collection("recipes");
      const recipeFindResult = await recipeCollection.findOne({ _id: "64ca4d3dfc13ae0ef3089f7b" });
      expect(recipeFindResult).toBeNull();

      const eventsCollection = client.db().collection("events");
      const eventsFindResult = await eventsCollection.findOne({ _id: "64c7b688411bcf756d6f0811" });
      expect(eventsFindResult.recipes).toEqual([]);
  });
  test('404: recipe id does not exist', async () => {
    await request(app)
    .delete("/api/recipes/64ca4d3dfc13ae0ef3089f99")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Recipe Not Found");
    })
  })
  test("400: invalid recipe id", async () => {
    await request(app)
    .delete("/api/recipes/64ca4d3dfc13ae0ef3089f??")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request");
    })
  })
});
