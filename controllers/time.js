const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const Game = require('../models/game');
const Time = require('../models/time')
const verifyToken = require('../middleware/verify-token');



//Create Time
router.post('/addtime', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        // const game = await Game.findById(req.params.gameId)
        const newTime = await Time.create({
            user: user._id,
            game: req.body.game,
            trackName: req.body.trackName,
            time: req.body.time             
        })
        user.trackedTimes.push(newTime._id)
        user.save()
        res.json(newTime)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

//get all times by user
 router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('trackedTimes')
        res.json({user})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
 })

//update time
router.put('/:timeId', verifyToken, async (req, res) => {
    try {
        const updatedTime = await Time.findByIdAndUpdate(
            req.params.timeId, 
            req.body, 
            {new: true}
        )
        res.json(updatedTime)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

//delete time
router.delete('/:timeId', verifyToken, async (req, res) => {
    try {
        const deletedTime = await Time.findByIdAndDelete(req.params.timeId)
        res.json(deletedTime)
    } catch (error) {
        res.status(400).json({ error: error.message })   
    }
})



module.exports = router