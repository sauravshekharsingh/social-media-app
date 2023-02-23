const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorMiddleware } = require("./middlewares/error");

// CORS
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Form parser
app.use(express.json());

// Routes setup
app.use("/", require("./routes"));

// Error middleware
app.use(errorMiddleware);

// Server listens on specified PORT
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(
    `Server is up and listening on PORT: ${PORT}.`
  );
});
