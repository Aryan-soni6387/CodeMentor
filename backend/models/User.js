const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,

  email: String,

  password: String,

  currentStreak: {
    type: Number,
    default: 0,
  },

  bestStreak: {
    type: Number,
    default: 0,
  },

  lastActiveDate: {
    type: Date,
    default: null,
  },

  dailyGoal: {
    type: Number,
    default: 3,
  },

  todaySolved: {
    type: Number,
    default: 0,
  },

  badges: {
    type: [String],
    default: [],
  },

  dsaProgress: {

    arrays: {
      type: Number,
      default: 0,
    },

    strings: {
      type: Number,
      default: 0,
    },

    trees: {
      type: Number,
      default: 0,
    },

    graphs: {
      type: Number,
      default: 0,
    },
  },

  solvedA2Z: {
    type: [String],
    default: [],
  },
});



module.exports = mongoose.model(
  "User",
  userSchema
);

