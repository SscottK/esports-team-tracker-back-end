const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const verifyToken = require('../middleware/verify-token');

//create team
router.post('/newteam/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(400).json({error: 'No user found.'});         
        }
        const team = await Team.create({
            teamName: req.body.teamName,
            coaches: [user._id]
        })
        user.teams.push(team._id);
        await user.save()
        res.json({ user, team });
    } catch (error) {
        if (res.statusCode === 400) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        }
    }
});

//Get One team
router.get('/:teamId', async (req, res) => {
    try {
        
        const team = await Team.findById(req.params.teamId)
        res.status(200).json({ team })
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

module.exports = router;