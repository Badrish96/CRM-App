const User = require("../model/user.model");
const objectConverter = require("../utils/object.converter");

exports.findAll = async (req, res) => {
  const queryObj = {};

  const userType = req.query.userType;
  const userStatus = req.query.userStatus;
  if (userType) {
    queryObj.userType = userType;
  }
  if (userStatus) {
    queryObj.userStatus = userStatus;
  }
  const users = await User.find(queryObj);

  res.status(200).send(objectConverter.userResponse(users));
};

exports.update = async (req, res) => {
  //Find user which needs updation
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) {
      return res.status(404).send({
        message: `User with given ID ${req.params.id} not found`,
      });
    }
    user.name = req.body.name != undefined ? req.body.name : user.name;

    user.userStatus =
      req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;

    user.userType =
      req.body.userType != undefined ? req.body.userType : user.userType;

    //save the user
    const updatedUser = await user.save();

    res.status(200).send({
      name: updatedUser.name,
      userId: updatedUser.userId,
      email: updatedUser.email,
      userType: updatedUser.userType,
      userStatus: updatedUser.userStatus,
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
