const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

const commentController = require("./../../controllers/api/comment");

router.put("/create/:postId", verifyToken, commentController.create);
router.delete("/remove/:commentId", verifyToken, commentController.remove);

module.exports = router;
