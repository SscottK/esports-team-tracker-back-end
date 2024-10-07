const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    },
    messageContent: String
})