const express = require("express");
const UserRouter = express.Router();
const User = require("../models/user");

UserRouter.get("/users", function(req, res) {
    users = User.find({}, (err, users) => {
        console.log("users : ", users);
        res.send({ users });
        console.log("OK");
    });
});

UserRouter.get("/user/:email", function(req, res) {
    let email = req.params.email;
    let user = User.findOne({ email }, (err, user) => {
        console.log("user", user);
        res.send({ user });
    });
});

module.exports = UserRouter;