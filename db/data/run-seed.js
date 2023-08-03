

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

    const jsonRecipesData = await fs.readFile(
      `${__dirname}/test-data/recipes.json`,
      "utf8"
    );
    const recipesData = JSON.parse(jsonRecipesData);

    const client = await connectToDatabase();

    const usersCollection = client.db("condiviso").collection("users");
    const eventsCollection = client.db("condiviso").collection("events");
    const recipesCollection = client.db("condiviso").collection("recipes");

    await usersCollection.deleteMany();
    await eventsCollection.deleteMany();
    await recipesCollection.deleteMany();

    await usersCollection.insertMany(usersData);
    await eventsCollection.insertMany(eventsData);
    await recipesCollection.insertMany(recipesData);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
