// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-1', accessKeyId: 'AKIAW7SCRAFEUTAE6QGQ', secretAccessKey: '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' });
// Create S3 service object
const s3 = new AWS.S3();

const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// Get a list of files for this user
exports.getFiles = (req,res) => {
  

  //find the user's email and add it to bucket params 
  //Then get a list of objects
  User.findById(req.userId, (err, user) => {
    if (err) {
      res.status(500).send({ message: `err ${err}` });
      return;
    }
    if(user){
      // Create the S3 bucket parameters for calling listObjects
      var bucketParams = {
        Bucket: 'alumnidashboard',
        Delimiter: '/',
        Prefix: `${user.email}/`
      };
      // Call S3 to obtain a list of the objects in the bucket
      s3.listObjectsV2(bucketParams, function (err, data) {
        if (err) {
          console.log("Error", err);
          return;
        } else {
          //console.log(data);
          data.Contents.forEach(function (obj, index) {
            console.log(obj);
            console.log(bucketParams);
            data.bucketParams = bucketParams
          });
          res.status(200).send(data.Contents);
          return;
        }
      });
      return;
    }    
  });
  
};

exports.getFile = (req, res) => {
  try {
    console.log(req.query.key);
    s3.getObject({
      Bucket: 'alumnidashboard',
      Key: req.query.key
    }, function (err, data) {
      if(err)
      {
        res.status(500).send({message:err});
        return;
      }
      else{
        res.status(200).send(data);
        return;
      }
    });
  } catch (e) {
    res.status(500).send(e);
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
};
