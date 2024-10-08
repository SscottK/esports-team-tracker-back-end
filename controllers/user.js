const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Team = require('../models/team')
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
            res.json({ token })
        } else {
            res.json({ error: 'Invalid username or password.'})
        }
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

//get specific user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
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



module.exports = router;