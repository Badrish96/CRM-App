const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");

const userModel = require("../model/user.model");
const constants = require("../utils/constants");
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(404).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, payload) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.userId = payload.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await userModel.findOne({ userId: req.userId });

  if (user && user.userType == constants.userType.admin) {
    next();
  } else {
    return res.status(403).send({
      message: `Only ${constants.userType.admin} are allowed`,
    });
  }
};

isAdminOrOwner = async (req, res, next) => {
  const callingUser = await userModel.findOne({ userId: req.userId });
  if (
    callingUser.userType == constants.userType.admin ||
    callingUser.userId == req.params.id
  ) {
    if (
      req.body.userStatus &&
      callingUser.userType != constants.userType.admin
    ) {
      return res.status(403).send({
        message: `Only ${constants.userType.admin} are allowed`,
      });
    }
    next();
  } else {
    return res.status(403).send({
      message: `Only ADMINs and OWNERs are allowed to update the data`,
    });
  }
};
const authFunction = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrOwner: isAdminOrOwner,
};

module.exports = authFunction;
