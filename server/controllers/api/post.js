const Post = require("./../../models/post");
const { createError } = require("../../utils/error");
const mongoose = require("mongoose");
const { uploadAndGetURL } = require("../../utils/uploads");

const getAllPosts = async (req, res, next) => {
  try {
    const populateQuery = [
      { path: "createdBy", select: "name username profilePhoto" },
      {
        path: "comments",
        populate: { path: "createdBy", select: "name username profilePhoto" },
        options: { sort: { createdAt: -1 } },
      },
    ];

    const posts = await Post.find()
      .populate(populateQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

const getProfilePosts = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const populateQuery = [
      { path: "createdBy", select: "name username profilePhoto" },
      {
        path: "comments",
        populate: { path: "createdBy", select: "name username profilePhoto" },
        options: { sort: { createdAt: -1 } },
      },
    ];

    const posts = await Post.find({ createdBy: userId })
      .populate(populateQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) return next(createError(400, "Post content is required."));

    let postPhotoURL = null;
    if (req.file) {
      postPhotoURL = await uploadAndGetURL(req.file, "post-photos", next);
    }

    const newPost = new Post({
      content,
      createdBy: req.user.id,
      photo: postPhotoURL,
    });

    await newPost.save();

    return res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId))
      return next(createError(400, "Invalid post Id."));

    const post = await Post.findOneAndDelete({
      _id: postId,
      createdBy: req.user.id,
    });

    if (!post)
      return res
        .status(400)
        .json("Not authorized to delete post or post not found.");

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  remove,
  getAllPosts,
  getProfilePosts,
};
