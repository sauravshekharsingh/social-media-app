const Notification = require("../../models/notification");
const Post = require("./../../models/post");

const getNotifications = async (req, res, next) => {
  try {
    const populateQuery = [
      { path: "from", select: "name username profilePhoto" },
      { path: "to", select: "name username profilePhoto" },
      { path: "post" },
    ];

    const notifications = await Notification.find({ to: req.user.id })
      .populate(populateQuery)
      .sort("-createdAt");

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

const readNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.updateMany(
      { to: req.user.id },
      { $set: { read: true } },
      { multi: true }
    );

    return res.status(200).json({
      success: true,
      message: "Notifications read successfully",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  readNotifications,
};
