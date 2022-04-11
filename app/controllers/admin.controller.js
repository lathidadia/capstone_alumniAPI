exports.adminBoard = (req, res) => {
  res.status(200).send("Admin content.");
};

const db = require("../models");
const ExitEmail = db.exitEmail;
//const User = db.user;

// Create and Save a new Exit email
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: "Email can not be empty!" });
    return;
  }
  //Check duplicates
  ExitEmail.findOne({ email: req.body.email }, (err, exitEmail) => {
    if (err) {
      res.status(500).send({ message: `err ${err}` });
      return;
    }
    if(exitEmail){
      res.status(500).send({ message: `Exit email already exists ${exitEmail.id}` });
      return;
    }    
  });
  // Create an Exit Email
  const exitEmail = new ExitEmail({
    email: req.body.email,
  });
  // Save Email in the database
  exitEmail
    .save(exitEmail)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};
// Retrieve all Exit Emails from the database.
exports.findAll = (req, res) => {
  ExitEmail.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving emails."
      });
    });
};
//Retrieve one Exit Email

//Update exit email
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.body.id;
  //console.log(req.body.id);
  ExitEmail.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(exitEmail => {
      if (!exitEmail) {
        res.status(404).send({
          message: `Cannot update Exit Email with id=${id}. Maybe Exit Email was not found!`
        });
      } else {        
          res.send({ message: "Exit Email was updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Tutorial with id=${id} ${err}`
      });
    });
};
