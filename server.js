require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const ExitEmail = db.exitEmail;
const Role = db.role;
const User = db.user;

var bcrypt = require("bcryptjs");


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Alumini API." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/admin.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT  || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Added 'admin' to roles collection");
      });
    }
  });
  ExitEmail.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new ExitEmail({
        email: 'root@abc.com'
      }).save(err => {
        if (err) {
          console.log('error ' + err);
        }
        console.log("Added exit email");
      });
    }
  });
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new User({
        username: 'root',
        email: 'root@abc.com',
        password: bcrypt.hashSync("123456", 8)
      })
        .save((err, user) => {
          if (err) {
            console.log(err);
            return;
          }
          Role.findOne({ name: "admin" }, (err, role) => {
            if (err) {
              console.log(err);
              return;
            }

            user.roles = [role._id];
            user.save(err => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Default Admin User 'root' was registered successfully!");
            });
          });

        });
    }
  });
}
