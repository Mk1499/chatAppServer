const express = require("express");
const bcrypt = require("bcrypt");
const RegRouter = express.Router();
const User = require("../models/user");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let mongoDB =
  "mongodb+srv://MK14:123456789mK14@chatapp-njhcl.mongodb.net/test?retryWrites=true";
mongoose.connect(mongoDB, { useNewUrlParser: true })
.catch( (err) => {throw err ;} );

RegRouter.post("/addAccount", function(req, res) {
  console.log("Connected Well");
  console.log(req.body.email);

  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email Exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            User.insertMany(
              [
                {
                  username: req.body.username,
                  email: req.body.email,
                  password: hash
                }
              ],
              function(err) {
                if (err) console.log(err);
                else res.status(200).json({ message: "User Created" });
              }
            );
          }
        });
      }
    });
});

module.exports = RegRouter;
