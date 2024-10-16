const mongoose = require("mongoose");

const timeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  game: {
    type: mongoose.Schema.ObjectId,
    ref: "Game",
  },
  trackName: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Time = mongoose.model("Time", timeSchema);

module.exports = Time;
