const mongoose = require("mongoose");

beforeAll(async () => {
  const MONGODB_TEST_URI =
    process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/fleetlink_test";

  await mongoose.connect(MONGODB_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }

  await mongoose.connection.close();
});
