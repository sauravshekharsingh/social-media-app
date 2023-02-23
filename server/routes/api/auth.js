const express = require("express");
const router = express.Router();
const multer = require("multer");

const authController = require("./../../controllers/api/auth");
const { storage } = require("./../../config/multer");

const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

router.post("/login", authController.login);

router.post(
  "/signup",
  uploadProfilePhoto.single("file"),
  authController.signup
);

module.exports = router;
