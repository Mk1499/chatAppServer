const express = require("express");
const bcrypt = require("bcrypt");
const UploadRouter = express.Router();
const User = require("../models/user");
const bodyParser = require("body-parser");

const multer = require('multer');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, 50*Math.random()+Date.now()+'-'+file.originalname  )
    }
  })
   
  var upload = multer({ storage: storage ,  limits: {fileSize: 1000000} })
// const multerConfig = {
//     storage: multer.diskStorage({
//         destination: function (req, res, next) {
//             next(null, './public/images')
//         },
//         filename: function (req, file, next) {
//             console.log(file)
//         }
//     })
// }



const mongoose = require("mongoose");
let mongoDB =
    "mongodb+srv://MK14:123456789mK14@chatapp-njhcl.mongodb.net/test?retryWrites=true";
mongoose.connect(mongoDB, { useNewUrlParser: true })
    .catch((err) => { throw err; });

// UploadRouter.use(multer({ 
//     dest: './uploads/',
//     rename: function (fieldname, filename) {
//         return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
//     },
//     onFileUploadStart: function (file) {
//         console.log(file.fieldname + ' is starting ...')
//     },
//     onFileUploadData: function (file, data) {
//         console.log(data.length + ' of ' + file.fieldname + ' arrived')
//     },
//     onFileUploadComplete: function (file) {
//         console.log(file.fieldname + ' uploaded to  ' + file.path)
//     }
// }));

UploadRouter.use(bodyParser.urlencoded({extended: true}))

UploadRouter.post('/single', upload.single('myFile'), (req, res) => {
    console.log("upload New Image Called : ",req.file);
    try {
        res.send(req.file);
    } catch (err) {
        res.send(400);
    }
});


module.exports = UploadRouter;
