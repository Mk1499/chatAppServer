const mongoose = require('mongoose');

const chatBoxSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    users : [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }] , 
    messages : [{
        _id : mongoose.Schema.Types.ObjectId , 
        senderID : {
            type : mongoose.Schema.Types.ObjectId, ref: 'User' , 
            required : true
        } , 
        msgBody : {
            type : String , 
            required : true
        },
        date : {
            type : Date , 
            default : Date(Date.now())
        }
    }]
});
module.exports = mongoose.model('chat', chatBoxSchema);