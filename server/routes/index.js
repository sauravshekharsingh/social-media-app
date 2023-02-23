const express = require("express");
const router = express.Router();
const homeController = require("./../controllers/home");

router.get("/", homeController.home);
router.use("/api", require("./api"));

module.exports = router;
