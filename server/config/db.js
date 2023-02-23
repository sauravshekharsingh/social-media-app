const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log(`Connected to MongoDB database.`))
  .catch((error) => console.log(`${error} did not connect`));

const db = mongoose.connection;

module.exports = db;
