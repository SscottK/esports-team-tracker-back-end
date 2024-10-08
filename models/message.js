const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    },
    messageContent: String
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message