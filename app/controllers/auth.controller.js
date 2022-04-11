const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const ExitEmail = db.exitEmail;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  
  ExitEmail.findOne({ email: req.body.email }, (err, exitEmail) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.exitEmail = [exitEmail._id];
      console.log(user.exitEmail);      
    });
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }        
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            res.send({ message: "User was registered successfully!" });
          });
        });
      
    });
  
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      try {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
    }catch (error){
      return res.status(500).send({message:error})
    }

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};
