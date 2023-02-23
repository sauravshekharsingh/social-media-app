const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/post", require("./post"));
router.use("/like", require("./like"));
router.use("/comment", require("./comment"));
router.use("/profile", require("./profile"));
router.use("/notification", require("./notification"));

module.exports = router;
