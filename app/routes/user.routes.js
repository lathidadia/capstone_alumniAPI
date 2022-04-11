const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const Acontroller = require("../controllers/admin.controller")
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    Acontroller.adminBoard
  );

  app.get("/api/user/files", [authJwt.verifyToken], controller.getFiles);
  app.get("/api/user/file", [authJwt.verifyToken], controller.getFile);
};
