const { exitEmail } = require("../models");
const db = require("../models");

const ExitEmail = db.exitEmail;

checkDuplicateEmail = (req, res, next) => {
  // Email
  ExitEmail.findOne({
    email: req.body.email
  }).exec((err, exitEmail) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (exitEmail) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }  
    next();
  });
  
};

const verifyExitEmail = {
  checkDuplicateEmail
};

module.exports = verifyExitEmail;
