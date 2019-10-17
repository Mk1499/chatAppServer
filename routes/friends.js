const express = require("express");
const FriendsRouter = express.Router();
const User = require("../models/user");
const mongo = require('mongodb');

FriendsRouter.get("/friends/:uid", function(req, res) {
    console.log("Friends api connected");
    console.log(req.params.uid);
    let uid = req.params.uid;
    let o_id = new mongo.ObjectID(uid);
    console.log(o_id);
    User.find({ _id: o_id }, { friends: 1 })
        .populate('friends', ['username', 'email','profileImg'])
        .exec((err, friends) => {
            if (err) {
                res.status(401).send({ message: `Sorry but there is an error: ${err}` })
            } else {
                res.status(200).send({ friends })
            }
        })
})

FriendsRouter.get("/searchFriends/:name", function(req, res) {
    let nameOrEmail = req.params.name;
    User.find({ $or: [{ username: { $regex: `${nameOrEmail}`, $options: 'i' } }, { email: { $regex: `${nameOrEmail}`, $options: 'i' } }] }, { username: 1, email: 1 , profileImg:1})
        .exec((err, users) => {
            if (err) {
                res.status(401).send({ message: `sorry but there is ${err}` })
            } else {
                res.status(200).send({ users })
            }
        })
})


// Add New Friend
FriendsRouter.post("/addFriend", function(req, res) {
    let currentUserId = req.body.currentUserId;
    let newFriendId = req.body.newFriendId;


    if (currentUserId !== newFriendId) {
        User.update({ _id: currentUserId }, { $push: { friends: newFriendId } })
            .exec((err) => {
                if (err) {
                    res.status(401).send({ message: `sorry but there is ${err}` });
                } else {
                    res.status(200).send({ message: "Friend list updated" });
                }
            })
    } else {
        console.log("Sorry But You Cann't add Your Self as Friend")
    }


})

module.exports = FriendsRouter;
