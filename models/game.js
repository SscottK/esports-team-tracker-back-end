const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String, 
        required: true
    },
    levels: [String]
})

const Game = mongoose.Schema('Game', gameSchema)

module.exports = Game