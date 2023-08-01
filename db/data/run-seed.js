const fs = require("fs/promises");
const { connectToDatabase } = require("../connection");
const seedDatabase = async () => {
  try {
    const jsonUsersData = await fs.readFile(
      `${__dirname}/test-data/users.json`,
      "utf8"
    );
    const usersData = JSON.parse(jsonUsersData);
    const jsonEventsData = await fs.readFile(
      `${__dirname}/test-data/events.json`,
      "utf8"
    );
    const eventsData = JSON.parse(jsonEventsData);
    const client = await connectToDatabase();
    const usersCollection = client.db().collection("users");
    const eventsCollection = client.db().collection("events");
    await usersCollection.deleteMany();
    await eventsCollection.deleteMany();
    await usersCollection.insertMany(usersData);
    await eventsCollection.insertMany(eventsData);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
module.exports = seedDatabase;