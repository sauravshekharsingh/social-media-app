const { createError } = require("../../utils/error");
const { createNotification } = require("../../utils/notification");
const Post = require("./../../models/post");

const create = async (req, res, next) => {
  try {
    const populateQuery = [
      { path: "createdBy", select: "name username profilePhoto" },
      {
        path: "comments",
        populate: { path: "createdBy", select: "name username profilePhoto" },
        options: { sort: { createdAt: -1 } },
      },
    ];

    const { postId } = req.params;

    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: req.user.id },
      },
      { new: true }
    );

    if (!post) return next(createError(400, "Post not found"));

    if (req.user.id !== post.createdBy.toString()) {
      await createNotification(
        next,
        "like",
        req.user.id,
        post.createdBy,
        post._id
      );
    }

    post = await Post.findById(post._id)
      .populate(populateQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Like created successfully",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const populateQuery = [
      { path: "createdBy", select: "name username profilePhoto" },
      {
        path: "comments",
        populate: { path: "createdBy", select: "name username profilePhoto" },
        options: { sort: { createdAt: -1 } },
      },
    ];

    const { postId } = req.params;

    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    );

    if (!post) return next(createError(400, "Post not found"));

    post = await Post.findById(post._id)
      .populate(populateQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Like removed successfully",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, remove };
