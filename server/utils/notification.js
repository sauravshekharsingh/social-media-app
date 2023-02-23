const Notification = require("./../models/notification");

const createNotification = async function (next, type, from, to, post) {
  try {
    const notification = new Notification({
      type,
      from,
      to,
      post,
    });

    await notification.save();

    return notification;
  } catch (err) {
    next(err);
  }
};

module.exports = { createNotification };
