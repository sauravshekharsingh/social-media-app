const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();
const multer = require("multer");

const profileController = require("./../../controllers/api/profile");
const { storage } = require("./../../config/multer");

const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

router.get("/:userId", verifyToken, profileController.getProfile);
router.patch(
  "/update",
  verifyToken,
  uploadProfilePhoto.single("file"),
  profileController.updateProfile
);

module.exports = router;
