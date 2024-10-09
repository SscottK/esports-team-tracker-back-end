const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const Game = require('../models/game');
const Time = require('../models/time')
const verifyToken = require('../middleware/verify-token');



//Create Time
router.post('/:gameId/addtime', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const game = await Game.findById(req.params.gameId)
        const newTime = Time.create({
            user: user._id,
            game: game._id
        })

    } catch (error) {
        
    }
})



module.exports = router