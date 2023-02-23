const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

const likeController = require("./../../controllers/api/like");

router.put("/create/:postId", verifyToken, likeController.create);
router.delete("/remove/:postId", verifyToken, likeController.remove);

module.exports = router;
