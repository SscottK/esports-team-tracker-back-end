const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const SALT_LENGTH = 12

router.post('/signup', async (req, res) => {
    try {
        const userTaken = await User.findOne({ userName: req.body.userName});
        if (userTaken) {
            return res.status(400).json({error: 'Username already exists'})
        }
        const user = await User.create({
            userName: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        res.status(201).json({ user })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});


module.exports = router