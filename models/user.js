const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    displayName: {type: String},
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

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User