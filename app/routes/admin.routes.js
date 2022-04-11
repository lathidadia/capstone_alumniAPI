const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller")
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/admin/exitEmail/findAll", [authJwt.verifyToken, authJwt.isAdmin],controller.findAll);

  app.post("/api/admin/exitEmail/create", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.post("/api/admin/exitEmail/update", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  
};
