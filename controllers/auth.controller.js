const User = require("../model/user.model");

const bcrypt = require("bcryptjs");

const constants = require("../utils/constants");

const jwt = require("jsonwebtoken");

const authConfig = require("../configs/auth.config");

exports.signup = async (req, res) => {
  const hashPass = bcrypt.hashSync(req.body.password, 10);
  var userStatus = req.body.userStatus;
  if (!userStatus) {
    if (req.body.userType == constants.userType.customer) {
      userStatus = constants.userStatus.approved;
    } else {
      userStatus = constants.userStatus.pending;
    }
  }
  const userObj = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    password: hashPass,
    userType: req.body.userType,
    userStatus: userStatus,
  };
  try {
    const userCreated = await User.create(userObj);
    const postResponse = {
      name: userCreated.name,
      userId: userCreated.userId,
      email: userCreated.email,
      userType: userCreated.userType,
      userStatus: userCreated.userStatus,
      createdAt: userCreated.createdAt,
      updatedAt: userCreated.updatedAt,
    };
    res.status(201).send(postResponse);
  } catch (err) {
    console.log(`Error while inserting user ${err}`);
    res.status(500).send({
      message: "Some internal error while registration",
    });
  }
};

exports.signin = async (req, res) => {
  //fetch user based on the userID provided in req.body
  const user = await User.findOne({ userId: req.body.userId });
  if (user == null) {
    return res.status(400).send({
      message: "Provided userId doesn't exist.",
    });
  }

  if (user.userStatus != constants.userStatus.approved) {
    return res.status(200).send({
      message: `Can't login with ${user.userStatus} status`,
    });
  }
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign({ id: user.userId }, authConfig.secret, {
    expiresIn: 120,
  });
  var responseUser = {
    name: user.name,
    userId: user.userId,
    email: user.email,
    userType: user.userType,
    userStatus: user.userStatus,
    acessToken: token,
  };
  res.status(200).send(responseUser);
};
