const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

const loadSampleData = async () => {
  try {
    const client = new MongoClient(uri, options);

    await client.connect();
    const db = client.db();

    // Load activities
    const activities = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../sample-data/activities.json"))
    );
    activities.forEach((activity) => {
      activity._id = ObjectId.createFromHexString(activity._id);
      activity.date = new Date(activity.date);
    });
    await db.collection("activities").insertMany(activities);

    // Load bookings
    const bookings = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../sample-data/bookings.json"))
    );
    bookings.forEach((booking) => {
      booking.activity = ObjectId.createFromHexString(booking.activity);
      booking.createdAt = new Date(booking.createdAt);
    });
    await db.collection("bookings").insertMany(bookings);

    console.log("👍 Sample data loaded");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error loading sample data", error);
    process.exit(1);
  }
};

loadSampleData().catch(console.error);
