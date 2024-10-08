const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userCtrl = require('./controllers/user')
const teamCtrl = require('./controllers/team')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// Routes go here
app.use('/users', userCtrl)
app.use('/teams', teamCtrl)


app.listen((process.env.PORT) || 3000, () => {
  console.log('The express app is ready!');
});