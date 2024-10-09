const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const verifyToken = require('../middleware/verify-token');

//Create game


module.exports = router