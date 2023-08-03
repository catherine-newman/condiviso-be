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

describe("POST /api/users", () => {
  test("acknowledges the post request and returns an id", () => {
    return request(app)
      .post("/api/users")
      .send({
        _id: "64c7abf68c2d17441844e659",
        first_name: "test",
        last_name: "person",
        email: "email@email.com",
        user_name: "testperson",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: [
          {
            recipe_name: "aenean lectus",
            recipe_image: "http://cbslocal.com/ut.aspx?arcu=quis&sed=turpisdio",
            recipe_content:
              "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          },
        ],
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.result).toHaveProperty("acknowledged", true);
        expect(body.result).toHaveProperty(
          "insertedId",
          "64c7abf68c2d17441844e659"
        );
      });
  });
  test("adds the user even when _id is not provided", () => {
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
        recipes: [
          {
            recipe_name: "aenean lectus",
            recipe_image: "http://cbslocal.com/ut.aspx?arcu=quis&sed=turpisdio",
            recipe_content:
              "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          },
        ],
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
        _id: "64c7abf68c2d17441844e659",
        first_name: "test",
        last_name: "person",
        email: "email@email.com",
        user_name: "testperson2",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: [
          {
            recipe_name: "aenean lectus",
            recipe_image: "http://cbslocal.com/ut.aspx?arcu=quis&sed=turpisdio",
            recipe_content:
              "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          },
        ],
      })
      .expect(201)
      .then(() => {
        return connectToDatabase();
      })
      .then((client) => {
        const collection = client.db().collection("users");
        return collection.findOne({ _id: new ObjectId("64c7abf68c2d17441844e659") });
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
        recipes: [
          {
            recipe_name: "aenean lectus",
            recipe_image: "http://cbslocal.com/ut.aspx?arcu=quis&sed=turpisdio",
            recipe_content:
              "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          },
        ],
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
        recipes: [
          {
            recipe_name: "aenean lectus",
            recipe_image: "http://cbslocal.com/ut.aspx?arcu=quis&sed=turpisdio",
            recipe_content:
              "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          },
        ],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
test("status:409, responds with an error message when username already exists", () => {
    return request(app)
      .post("/api/users")
      .send({
        first_name: "test",
        last_name: "person",
        user_name: "murling0",
        email: "email@email.com",
        address: "123 street",
        postcode: "M1 7ED",
        about_me: "I'm just a test",
        recipes: [
          {
            recipe_name: "aenean lectus",
            recipe_image: "http://cbslocal.com/ut.aspx?arcu=quis&sed=turpisdio",
            recipe_content:
              "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          },
        ],
      })
      .expect(409)
       .then(({ body }) => {
         expect(body.msg).toBe("Username already exists");
       });
   });
 });



describe("PATCH /api/users/_id", () => {
  test("status 200 , responds with an updated user", () => {
  const updateData =
   {
    first_name: "Mac",
  email: "marchelleu@businessinsider.com",
  user_name: "murling888"
  };
   return request(app)
  .patch("/api/users/64c7abf68c2d17441844e6fd")
  .send(updateData)
  .expect(200)
  .then(({body}) => {
    const { user } = body;
    expect(user.first_name).toBe("Mac")
     expect(user.email).toBe("marchelleu@businessinsider.com");
     expect(user.user_name).toBe("murling888");
  });
  });
   test("status 400: Responds with message -'Bad request' when updateData has a missing key/malformed request ", () => {
    const updateData = {
 
      not_email: "marchelleu@businessinsider.com",
      not_user_name: "murling888"
      };
        return request(app)
      .patch("/api/users/64c7abf68c2d17441844e6fd")
      .send(updateData)
      .expect(400)
      .then(({body}) => {
        
        expect(body.msg).toBe("Bad Request");
      });
  });
    test("status 404 : Responds with message -'User not found' when user id is valid but does not exist", () => {
      const updateData = {
         not_email: "marchelleu@businessinsider.com",
        not_user_name: "murling888"
        };
          return request(app)
        .patch("/api/users/64c7abf68c2d17451844e6fd")
        .send(updateData)
        .expect(404)
            .then(({body}) => {
            expect(body.msg).toBe("User not found");
      });
  });
  test("status:400, responds with an error message 'Bad request' when the email is invalid", () => {
    const updateData = {
      email: "awykey5google.nl",
    address: "7 Lukken Crossing"
     };
       return request(app)
     .patch("/api/users/64c7abf68c2d17441844e702")
     .send(updateData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400, responds with an error message 'Bad request' when the postcode is invalid", () => {
    const updateData = {
      email: "fbalderston8@bing.co.uk",
    postcode: "1"
     };
       return request(app)
     .patch("/api/users/64c7abf68c2d17441844e705")
     .send(updateData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:409, responds with an error message when username already exists", () => {
    const updateData = {
          user_name: "kfenck2"
     };
       return request(app)
     .patch("/api/users/64c7abf68c2d17441844e701")
     .send(updateData)
          .expect(409)
    .then(({ body }) => {
        expect(body.msg).toBe("Username already exists");
      });
  });
});

describe("GET /api/users/:_id", () => {
  test("return 200 status, should return a single user", () => {
    return request(app)
      .get("/api/users/64c7abf68c2d17441844e6fd")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty("first_name");
        expect(body).toHaveProperty("last_name")
        expect(body).toHaveProperty("email")
        expect(body).toHaveProperty("user_name")
        expect(body).toHaveProperty("address")
        expect(body).toHaveProperty("postcode")
        expect(body).toHaveProperty("about_me")
        expect(body._id).toBe("64c7abf68c2d17441844e6fd")
      })
  });
});

describe('Error Handling 404', () => {
  test('should return 404 status, should return an error when the user is not found', () => {
    return request(app)
    .get("/api/users/64c7abf68c2d17441844e711")
    .expect(404)
    .then(({body})  => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("User not found");
    });
  });
});

describe('Error Handling 400', () => { 
  test('Should return 400 status, should return an error when the id is invalid', () => { 
    return request(app)
    .get("/api/users/64c7abf68c2d17441844e71?")
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("Bad Request");
    })
  }); 
});
