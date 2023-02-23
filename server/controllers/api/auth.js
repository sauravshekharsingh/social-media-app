const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { createError } = require("../../utils/error");
const User = require("./../../models/user");
const { uploadAndGetURL } = require("../../utils/uploads");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return next(createError(404, "User does not exists."));

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return next(createError(400, "Wrong username or password."));

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        username: user.username,
        profilePhoto: user.profilePhoto,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({
      success: true,
      message: "Logged in successfully.",
      token,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(createError(404, "Email already exists."));

    user = await User.findOne({ username });

    if (user) return next(createError(404, "Username already exists."));

    let profilePhotoURL = null;

    if (req.file) {
      profilePhotoURL = await uploadAndGetURL(req.file, "profile-photos", next);
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hash,
      profilePhoto: profilePhotoURL,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        profilePhoto: newUser.profilePhoto,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, signup };
