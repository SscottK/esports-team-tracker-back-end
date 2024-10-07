const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    displayName: String,
    trackedTimes: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'Time'
    }],
    teams: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'Team'
    }],
    messages: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'Message'
    }]
})

const User = mongoose.model('User', userSchema);
module.exports = User