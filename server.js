const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userCtrl = require('./controllers/user')
const teamCtrl = require('./controllers/team')
const gameCtrl = require('./controllers/game')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// Routes go here
app.use('/users', userCtrl)
app.use('/teams', teamCtrl)
app.use('/games', gameCtrl)


app.listen((process.env.PORT) || 3000, () => {
  console.log('The express app is ready!');
});