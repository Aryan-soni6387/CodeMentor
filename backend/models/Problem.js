const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({

  name: String,

  difficulty: String,

  userEmail: String,

  topic: String,

  statement: String,

  link: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Problem",
  problemSchema
);