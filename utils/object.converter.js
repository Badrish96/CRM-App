exports.userResponse = (users) => {
  var userResponse = [];
  users.forEach((user) => {
    userResponse.push({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  });
  return userResponse;
};
