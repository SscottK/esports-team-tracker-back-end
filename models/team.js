const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    games: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'Game'
    }],
    members: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }],
    coaches: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }]
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team