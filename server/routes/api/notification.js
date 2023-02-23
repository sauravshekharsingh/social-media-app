const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

const notificationController = require("./../../controllers/api/notification");

router.get("/", verifyToken, notificationController.getNotifications);
router.put("/read", verifyToken, notificationController.readNotifications);

module.exports = router;
