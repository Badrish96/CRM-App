const userController = require("../controllers/user.controller");

const { authMiddleware } = require("../middlewares");

module.exports = function (app) {
  app.get(
    "/crm/api/v1/users",
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    userController.findAll
  );
  app.put(
    "/crm/api/v1/users/:id",
    authMiddleware.verifyToken,
    authMiddleware.isAdminOrOwner,
    userController.update
  );
};
