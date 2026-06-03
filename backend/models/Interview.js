const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  topic: String,
  difficulty: String,
  score: Number,
  feedback: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);