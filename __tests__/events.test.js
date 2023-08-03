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
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
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
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
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
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
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
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
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
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
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
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
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
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
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
  test("status:400 returns an error if event_duration is 0 or lower", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
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
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
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
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
        latitude: -7.7016409,
        longitude: 112.9827091,
        latitude_fuzzy: 11.3451287,
        longitude_fuzzy: -72.3628361,
        event_city: "Grati Satu",
        event_description: "Quisque porta volutpat erat. Quisque erat eros.",
        event_duration: 2,
        max_attendees: -1,
        attendees: [
          { user_name: "abenettolo0" },
          { user_name: "kkellog1" },
          { user_name: "bplum2" },
          { user_name: "mdavidavidovics3" },
        ],
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400 returns an error if user_id is not in the database", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        user_id: "64cab922fc13ae54a3089f7b",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "TR14 8GH",
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
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:400 returns an error if postcode is not valid", () => {
    return request(app)
      .post("/api/events")
      .send({
        _id: "64c7b688411bcf756d6f0867",
        event_name: "Honorable",
        first_name: "Sigismond",
        last_name: "Sainz",
        user_name: "murling0",
        user_id: "64c7abf68c2d17441844e6fd",
        email: "ssainz0@weebly.com",
        event_date: "3/2/2022",
        event_location: "65231 Brentwood Avenue",
        postcode: "booooo",
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
        recipes: ["64ca4d3dfc13ae0ef3089f7b"],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/events/:event_id", () => {
  test("returns the event for the specified id", () => {
    return request(app)
      .get("/api/events/64c7b688411bcf756d6f0811")
      .expect(200)
      .then(({ body }) => {
        expect(body.event).toHaveProperty("_id", "64c7b688411bcf756d6f0811");
        expect(body.event).toHaveProperty("first_name", "Marchelle");
        expect(body.event).toHaveProperty("last_name", "Urling");
        expect(body.event).toHaveProperty("user_name", "murling0");
        expect(body.event).toHaveProperty("user_id", "64c7abf68c2d17441844e6fd");
        expect(body.event).toHaveProperty("email", "murling0@businessinsider.com");
        expect(body.event).toHaveProperty(
          "event_date",
          "2023-08-01T00:00:00.000Z"
        );
        expect(body.event).toHaveProperty(
          "event_location",
          "Riga Street, Manchester, United Kingdom"
        );
        expect(body.event).toHaveProperty("postcode", "M4 4GL");
        expect(body.event).toHaveProperty("coordinate", expect.any(Object));
        expect(body.event).toHaveProperty(
          "coordinate_fuzzy",
          expect.any(Object)
        );
        expect(body.event).toHaveProperty("event_city", "Manchester");
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

describe("GET /api/events/", () => {
  test("serves all events", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(10);
        events.forEach((event) => {
          expect(event).toHaveProperty("_id", expect.any(String));
          expect(event).toHaveProperty("first_name", expect.any(String));
          expect(event).toHaveProperty("last_name", expect.any(String));
          expect(event).toHaveProperty("user_name", expect.any(String));
          expect(event).toHaveProperty("email", expect.any(String));
          expect(event).toHaveProperty("event_date", expect.any(String));
          expect(event).toHaveProperty("event_location", expect.any(String));
          expect(event).toHaveProperty("coordinate", expect.any(Object));
          expect(event).toHaveProperty("coordinate_fuzzy", expect.any(Object));
          expect(event).toHaveProperty("event_city", expect.any(String));
          expect(event).toHaveProperty("event_description", expect.any(String));
          expect(event).toHaveProperty("event_duration", expect.any(Number));
          expect(event).toHaveProperty("max_attendees", expect.any(Number));
          expect(event).toHaveProperty("attendees", expect.any(Array));
          expect(event).toHaveProperty("recipes", expect.any(Array));
        });
      });
  });
  test("events are sorted by date in descending order as default", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        expect(body.events).toBeSortedBy("event_date");
      });
  });
  test("events can be filtered by date starting from a day", () => {
    return request(app)
      .get("/api/events?from_date=2023-08-03")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(8);
      });
  });
  test("status:400 responds with an error message when from_date is not valid", () => {
    return request(app)
      .get("/api/events?from_date=boo")
      .expect(400)
      .then(({ body }) => {
        const events = body.events;
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("events can be filtered by date until a day", () => {
    return request(app)
      .get("/api/events?to_date=2023-08-07")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(7);
      });
  });
  test("status:400 responds with an error message when to_date is not valid", () => {
    return request(app)
      .get("/api/events?to_date=boo")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("response can be filtered by distance in miles as default with default distance of 10", () => {
    return request(app)
      .get("/api/events?lon=-2.236776&lat=53.486784")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(10);
      });
  });
  test("response can be filtered by specified distance", () => {
    return request(app)
      .get("/api/events?lon=-2.236776&lat=53.486784&dist=0.1864114")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(2);
      });
  });
  test("response can be filtered by distance in km", () => {
    return request(app)
      .get("/api/events?lon=-2.236776&lat=53.486784&dist=0.3&unit=k")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(2);
      });
  });
  test("response can be filtered to events with spaces left", () => {
    return request(app)
      .get("/api/events?spaces=true")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(9);
      });
  });
  test("status:400 responds with an error message if spaces does not equal true when queried", () => {
    return request(app)
      .get("/api/events?spaces=tgdfg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:404 responds with an error message if no events were found", () => {
    return request(app)
      .get("/api/events?from_date=2024-08-23")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("events can be filtered by user_id", () => {
    return request(app)
      .get("/api/events?user_id=64c7abf68c2d17441844e6fd")
      .expect(200)
      .then(({ body }) => {
        const events = body.events;
        expect(events.length).toBe(1);
        expect(events[0]).toHaveProperty("_id", "64c7b688411bcf756d6f0811");
      });
  });
  test("status:404 responds with an error message if user_id does not exist", () => {
    return request(app)
      .get("/api/events?user_id=64ca4d3dfc13ae0ef3089f7e")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("status:400 responds with an error message if user_id is not valid", () => {
    return request(app)
      .get("/api/events?user_id=booooo")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe('PATCH /api/events/:_id', () => { 
  test('Modifies some event details', () => { 
    const patchBody = {
      event_name: "happy meal",
      event_date: "2023-08-01T00:00:00.000Z",
      event_description: "come get food",
      event_duration: 3,
      attendees: [
        { "user_name": "anakin" },
        { "user_name": "obi" },
        { "user_name": "quigon" }
     ],
     max_attendees: 10
    }
    return request(app)
    .patch('/api/events/64c7b688411bcf756d6f0811')
    .send(patchBody)
    .expect(200)
    .then(({body}) => {
      const {updatedEvent} = body
      expect(updatedEvent.event_name).toBe('happy meal')
      expect(updatedEvent.event_date).toBe("2023-08-01T00:00:00.000Z")
      expect(updatedEvent.event_description).toBe( "come get food")
      expect(updatedEvent.event_duration).toBe(3)
      expect(updatedEvent.attendees).toEqual([
         { "user_name": "anakin"},
         { "user_name": "obi" },
         { "user_name": "quigon" }
      ])
      expect(updatedEvent.spaces_free).toBe(7)
    })
  }); 
  test('404: Should return an error when the id is non-existent', () => { 
    const patchBody = {
      event_name: "happy meal",
      event_date: "2023-08-01T00:00:00.000Z",
      event_description: "come get food",
      event_duration: 3,
      attendees: [
        { "user_name": "anakin" },
        { "user_name": "obi" },
        { "user_name": "quigon" }
     ]
    }
    return request(app)
    .patch('/api/events/64c7b688411bcf756d6f0899')
    .send(patchBody)
    .expect(404)
    .then(({body}) => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("Event not found");
    })
  });
  test('400: Should return an error when the id is invalid', () => { 
    const patchBody = {
      event_name: "happy meal",
      event_date: "2023-08-01T00:00:00.000Z",
      event_description: "come get food",
      event_duration: 3,
      attendees: [
        { "user_name": "anakin" },
        { "user_name": "obi" },
        { "user_name": "quigon" }
     ]
    }
    return request(app)
    .patch('/api/events/64c7b688411bcf756d6f08?')
    .send(patchBody)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("Bad Request");
    })
  });
  test('400: Should return an error when request body has malformed value for name field', () => { 
   const patchBody = {
    event_name: '%',
    event_date: "2023-08-01T00:00:00.000Z",
    event_description: "come get food",
    event_duration: 3,
    attendees: [
      { "user_name": "anakin" },
      { "user_name": "obi" },
      { "user_name": "quigon" }
   ]
   }
   return request(app)
   .patch('/api/events/64c7b688411bcf756d6f0811')
   .send(patchBody)
   .expect(400)
   .then(({body}) => {
     expect(body).toHaveProperty("msg");
     expect(body.msg).toBe("Bad Request");
   })
  });
  test('400: Should return an error when request body has malformed value for date field', () => { 
    const patchBody = {
     event_name: 'h',
     event_date: "2023-08-01T00:00:00.000Z%",
     event_description: "come get food",
     event_duration: 3,
     attendees: [
      { "user_name": "anakin" },
      { "user_name": "obi" },
      { "user_name": "quigon" }
   ]
    }
    return request(app)
    .patch('/api/events/64c7b688411bcf756d6f0811')
    .send(patchBody)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("Bad Request");
    })
   });
   test('400: Should return an error when request body has malformed value for duration field', () => { 
    const patchBody = {
     event_name: 'h',
     event_date: "2023-08-01T00:00:00.000Z",
     event_description: "come get food",
     event_duration: 'j',
     attendees: [
      { "user_name": "anakin" },
      { "user_name": "obi" },
      { "user_name": "quigon" }
   ]
    }
    return request(app)
    .patch('/api/events/64c7b688411bcf756d6f0811')
    .send(patchBody)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("Bad Request");
    })
   });
   test('400: Should return an error when request body has malformed value for attendees field', () => { 
    const patchBody = {
     event_name: 'h',
     event_date: "2023-08-01T00:00:00.000Z",
     event_description: "come get food",
     event_duration: 2,
     attendees: { 
      "user_name": "anakin" ,
       "user_name": "obi" ,
      "user_name": "quigon"
    }
  }
    return request(app)
    .patch('/api/events/64c7b688411bcf756d6f0811')
    .send(patchBody)
    .expect(400)
    .then(({body}) => {
      expect(body).toHaveProperty("msg");
      expect(body.msg).toBe("Bad Request");
    })
   });
  });




