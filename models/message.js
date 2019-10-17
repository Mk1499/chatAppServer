const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    senderID :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    receiverID :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    body: {
        type: String,
        required: true,

    },
    date: {
        type: Date,
        required: true , 

    }
});
module.exports = mongoose.model('Message', messageSchema);