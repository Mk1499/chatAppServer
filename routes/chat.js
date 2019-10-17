const express = require("express");
const ChatRouter = express.Router();
const Chat = require("../models/chat");
const mongo = require('mongodb');
const mongoose = require('mongoose');

ChatRouter.post('/newChat', function (req, res) {

    let users = req.body.users;
    let membersIDs = users.map((user) => mongoose.Types.ObjectId(user))
    // console.log("TEST : ",test)
// Chat.find({_id : chatID} , {messages : {$slice : -20} , _id : 0})
    Chat.find({ users: {$all: membersIDs } } ,  {messages : {$slice : -20} } )
        // .exec()
        .then(chat => {
            console.log("Chatttt : ", chat)
            if (chat.length < 1) {
                let newChat = {
                    _id : new mongoose.Types.ObjectId(), 
                    users
                }
                Chat.create(newChat
                , function (err , insertID) {
                    if (err)
                        console.log(err);
                    else {
                        console.log("Insertion ID : ",insertID) ;
                res.status(200).send({ code:"200", message: "new Chat Created" , chatID : insertID._id , messages : []})

                    }
                })
            } else {
                console.log("Sorry but this chat is already created")
                res.status(200).send({ code:"111", message: "Sorry but this chat is already created" , chatID : chat[0]._id , messages : chat[0].messages})
            }
        }) 
        // .then(async () => {
        //     await Chat.find({ users: membersIDs })
        //     .then(newChat => {
        //         console.log("NEw Chat : ",newChat)
        //         res.status(200).json({ code : "200" , message: "New Chat Created" , chatID: newChat[0]._id });
        //     })

        // })
});

ChatRouter.post('/newMessage', function (req, res) {
    console.log("new message API Called");
    let chatID = req.body.chatID;
    let senderID = req.body.senderID;
    let msgBody = req.body.msgBody;
    Chat.update({ _id: chatID }, {
        $push: {
            messages: {
                senderID,
                msgBody
            }
        }
    })
        .exec((err) => {

            if (err) {
                res.status(401).send({
                    message : `Sorry But there is an error ${err}`
                })
            } else {
                res.status(200).send({
                    message : "Message Send Successfully"
                })
            }
        }


        )

})

// Get Chat Messages 
ChatRouter.post('/chatMessages',function (req,res){
    let chatID  = new mongo.ObjectID(req.body.chatID) ; 
    console.log("Chat ID : ",chatID)
    Chat.find({_id : chatID} , {messages : {$slice : -20} , _id : 0})
    .then(messages => {
        console.log(messages)
        res.status(200).send({
            code:"200",
            msg : "Messages Retrived Succesfully" , 
            data : messages
        })
    })
})

// get user latest chats 
ChatRouter.get('/latestChats/:userID' , function (req,res){
    console.log("latest Chat Api Connected : ",req.params.userID);
    
    let userID = new mongo.ObjectID(req.params.userID) ; 
    Chat.find({users : userID} , {users : 1 ,messages:{$slice : -1} })
    .populate('users',['username','profileImg','status'])
    .exec((err, preChats) => {
        if (err) {
            res.status(401).send({ message: `Sorry but there is an error: ${err}` })
        } else {
            console.log(preChats)
            res.status(200).send({ code : 200 , preChats })
        }
    })
})

module.exports = ChatRouter;
