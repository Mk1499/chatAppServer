const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /\S+@\S+\.\S+/
    },
    username: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String ,
        default : "http://aras.kntu.ac.ir/wp-content/uploads/2019/05/hoodie-.png"
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] , 
    status: {
        type: String , 
        default : 'offline'
    }
});
module.exports = mongoose.model('User', userSchema);
