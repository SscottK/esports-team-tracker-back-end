const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Team = require('../models/team');
const Time = require('../models/time')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token');


const SALT_LENGTH = 12;

//Create new user
router.post('/signup', async (req, res) => {
    try {
        const userTaken = await User.findOne({ username: req.body.username});
        if (userTaken) {
            return res.status(400).json({error: 'Username already exists.'})
        };
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        });
        
        const token = jwt.sign(
            { username: user.username, _id: user._id },
            process.env.JWT_SECRET
        );
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

//Sign in user
router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username});
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign(
                {username: user.username, _id: user._id},
                process.env.JWT_SECRET
            );
            res.json({ user,token })
        } else {
            res.json({ error: 'Invalid username or password.'})
        }
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

//Get all users
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find({}).populate('teams').populate('trackedTimes')
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

//get specific user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        .populate('teams');
        if (!user) {
            res.status(400).json({error: 'No user found.'});         
        }
        res.json({ user });
    } catch (error) {
        if (res.statusCode === 400) {
            res.status(400).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        }
    }
});

//Edit user info
router.put('/:userId/edit', verifyToken, async (req, res) =>{
    try {
        if (!req.params.userId === req.user._id) {
            return res.status(400).json('You are not authorized to do that!')
        }
        const updatedUser = await User.findByIdAndUpdate(
                    req.params.userId, 
                    req.body, 
                    {new: true})
        
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

//Delete user
router.delete('/:userId', verifyToken, async (req, res) => {
    try {        
        if (!req.params.userId === req.user._id) {
            return res.status(400).json('You are not authorized to do that!')
        }
        const user = await User.findById(req.params.userId)
        
        await Time.deleteMany({_id: { $in: user.trackedTimes } })
        
        const deletedUser = await User.findByIdAndDelete(req.params.userId)
        res.json(deletedUser)
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

module.exports = router;