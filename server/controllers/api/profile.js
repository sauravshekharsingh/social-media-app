const User = require("../../models/user");
const { createError } = require("../../utils/error");
const { uploadAndGetURL } = require("../../utils/uploads");

const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId }).select(
      "name username profilePhoto createdAt"
    );

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.name = req.body.name;

    let profilePhotoURL = null;
    if (req.file) {
      profilePhotoURL = await uploadAndGetURL(req.file, "profile-photos", next);
      user.profilePhoto = profilePhotoURL;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
