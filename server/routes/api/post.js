const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();
const multer = require("multer");

const postController = require("./../../controllers/api/post");
const { storage } = require("./../../config/multer");

const uploadPostPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", verifyToken, postController.getAllPosts);
router.get("/:userId", verifyToken, postController.getProfilePosts);

router.post(
  "/create",
  verifyToken,
  uploadPostPhoto.single("file"),
  postController.create
);

router.delete("/remove/:postId", verifyToken, postController.remove);

module.exports = router;
