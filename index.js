// ======================================= External Liberaries ============================//

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require('cors');
// const socketIo = require('socket.io');
const server = require("http").Server(app);
const socket = require("socket.io")(server, {
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

const bodyParser = require("body-parser");

const mongoose = require("mongoose");
let mongoDB =
    "mongodb+srv://MK14:123456789mK14@chatapp-njhcl.mongodb.net/test?retryWrites=true";
mongoose.connect(mongoDB, { useNewUrlParser: true })
    .catch((err) => { throw err; });



const multer = require("multer");
// ======================================= Models ====================================//

const User = require('./models/user');

// ======================================= MiddleWares ====================================//


// WARNING: app.listen(80) will NOT work here!
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set("view engine", "ejs");
app.use(express.static("./public/"));

app.get("/", function (req, res) {
    res.send("Welcome in MK14 Chat App Server");
    console.log("user Connected :D ");
});


// ======================================= Web Sockets ====================================//

let onlineUsers = [];
let activeChats = [];

socket.on('connection', function (socket) {
    // add new user connections to online users array 
    socket.on('addOnlineUser', (data) => {

        let haveASocket = false;
        onlineUsers.map(user => {
            if (user.userID == data.userID) {
                user.socketsIDs.push(socket.id)
                haveASocket = true;
            }

        })
        if (!haveASocket)
            onlineUsers.push({ userID: data.userID, socketsIDs: [socket.id] });

        // change user status 
        User.update({ _id: data.userID }, { $set: { status: "online" } })
            .exec((err) => {
                if (err) {
                    console.log("Error : ", err)
                }
                else {
                    console.log("Status changed to online")
                }
            })

    })

    // add new chat connections to active chats array 
    socket.on('addActiveChat', (data) => {

        let haveASocket = false;
        activeChats.map(chat => {
            if (chat.chatID == data.chatID) {
                chat.socketsIDs.push(socket.id)
                haveASocket = true;
            }

        })
        if (!haveASocket)
            activeChats.push({ chatID: data.chatID, socketsIDs: [socket.id] });

    })

    // new message sent 
    socket.on("sendMsg", data => {
        console.log("DATA : ", data);
        onlineUsers.map(user => {
            if (user.userID === data.receiverID) {
                user.socketsIDs.map(id => {
                    socket.broadcast.to(id).emit('recieveMsg', { data })
                })
            }
        })
    })



    socket.on('disconnect', async () => {

        var userData = await onlineUsers.find(i => {
            if (Object.values(i)[0].includes("f")) {
                return i
            }
        })

             // change user status 
             User.update({ _id: userData.userID }, { $set: { status: "offline" } })
             .exec((err) => {
                 if (err) {
                     console.log("Error : ", err)
                 }
                 else {
                     console.log("Status changed to Offline")
                 }
             })

        // console.log(`user with id : ${user.userID} Disconnected `);

        console.log(`Socket ${socket.id} disconnected.`);
    })


});
// ======================================= Routes ====================================//
app.use("/",function (req,res,next) {
    console.log("Connection") ;
    next() ;
})
const RegRouter = require("./routes/register");
app.use("/", RegRouter);

const LoginRouter = require("./routes/login");
app.use("/", LoginRouter);

const UserRouter = require("./routes/users");
app.use("/", UserRouter);

const FriendsRouter = require("./routes/friends");
app.use("/", FriendsRouter);

const ChatRouter = require("./routes/chat");
app.use("/", ChatRouter);

const UploadRouter = require("./routes/upload");
app.use("/", UploadRouter);



let port = process.env.PORT || 3005;
server.listen(port, process.env.IP, function () {
    console.log("DB Server has started on port no : " + port);
});
