const Post = require("./../../models/post");
const Comment = require("./../../models/comment");
const { createError } = require("../../utils/error");
const mongoose = require("mongoose");
const { createNotification } = require("../../utils/notification");

const create = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) return next(createError(400, "Comment content is required."));

    if (!mongoose.Types.ObjectId.isValid(postId))
      return next(createError(400, "Invalid post Id."));

    const comment = new Comment({
      content,
      createdBy: req.user.id,
      post: postId,
    });

    const populateQuery = [
      { path: "createdBy", select: "name username profilePhoto" },
      {
        path: "comments",
        populate: { path: "createdBy", select: "name username profilePhoto" },
        options: { sort: { createdAt: -1 } },
      },
    ];

    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment?._id },
      },
      { new: true }
    );

    if (!post) return next(createError(400, "Post not found."));

    await comment.save();

    if (req.user.id !== post.createdBy.toString()) {
      await createNotification(
        next,
        "comment",
        req.user.id,
        post.createdBy,
        post._id
      );
    }

    post = await Post.findById(postId)
      .populate(populateQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
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

    const { commentId } = req.params;

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
    });

    if (!comment)
      return next(
        createError(
          400,
          "Not authorized to delete comment or comment not found"
        )
      );

    let post = await Post.findByIdAndUpdate(
      comment?.post,
      {
        $pull: { comments: comment?._id },
      },
      { new: true }
    );

    if (!post) return next(createError(400, "Post not found."));

    post = await Post.findById(post._id)
      .populate(populateQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comment removed successfully",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, remove };
