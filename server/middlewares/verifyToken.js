const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  if (!token) return next(createError(401, "Not authenticated."));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Invalid token."));

    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
