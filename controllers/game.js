const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const Game = require('../models/game');
const verifyToken = require('../middleware/verify-token');

console.log("game file running")
//Create game
router.post('/:teamId/addgame', verifyToken, async (req, res) => {
    try {
        const team = await  Team.findById(req.params.teamId);
        if (!team) {
            res.status(400).json({error: 'No team found.'});         
        }
        const game = await Game.create({
            gameName: req.body.gameName,
            levels: [req.body.levels]
        })
        team.games.push(game._id);
        await team.save()
        res.json({ team, game});
    } catch (error) {
        if (res.statusCode === 400) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        }
    }
    
});

//Get all games
router.get('/', verifyToken, async (req, res) => {
    try {        
        const games = await Game.find({})        
        res.status(200).json(games)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
    
})

//Get one game
router.get('/:gameId', verifyToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId)
        if (!game) {
            res.status(400).json({error: 'No game found.'});         
        }
        res.status(200).json({ game })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Update game
router.put('/:gameId/edit', verifyToken, async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(
            req.params.gameId, 
            req.body, 
            {new: true})
            res.json(updatedGame )
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

//Delete game
router.delete('/:gameId', verifyToken, async (req, res) => {
    try {
        const deletedGame = await Game.findByIdAndDelete(req.params.gameId);
        res.json(deletedGame)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router