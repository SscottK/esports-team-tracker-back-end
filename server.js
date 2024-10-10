const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')

const userCtrl = require('./controllers/user')
const teamCtrl = require('./controllers/team')
const gameCtrl = require('./controllers/game')
const timeCtrl = require('./controllers/time')

app.use(cors({ origin: 'http://localhost:5173'}))

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// Routes go here
app.use('/users', userCtrl)
app.use('/teams', teamCtrl)
app.use('/games', gameCtrl)
app.use('/times', timeCtrl)


app.listen((process.env.PORT) || 3000, () => {
  console.log('The express app is ready!');
});