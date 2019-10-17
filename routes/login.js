const express = require("express");
const bcrypt = require("bcrypt");
const LoginRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");



LoginRouter.post("/login", function(req, res) {
    console.log("Login Path Called ");
    console.log(req.body.email);
    // console.log("Password : ",hashedPassword) ;
    let email = req.body.email;

    User.find({ email: { $regex: req.body.email, $options: "i" } })
        .exec()
        .then(user => {
            if (user.length < 1) {
                console.log("Login Failed");
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    console.log("Login Failed");

                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {
                    console.log("Login Success");
                    let u = user[0];
                    let username = u.username;
                    let uid = u._id;
                    let profileImg = u._doc.profileImg;
                    const token = jwt.sign({ uid, email, username , profileImg  }, "kdmklsdklsndflksdn");
                    res.header('auth_token', token);
                    return res.status(200).json({
                        message: "Auth Successful",
                        token
                    });
                } else {
                    console.log("Login Failed");
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
module.exports = LoginRouter;
