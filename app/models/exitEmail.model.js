const mongoose = require("mongoose");

const ExitEmail = mongoose.model(
  "ExitEmail",
  new mongoose.Schema({
    email: String
  })
);

module.exports = ExitEmail;