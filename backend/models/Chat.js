const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

  userEmail: String,

  sender: String,

  text: String,
});

module.exports = mongoose.model(
  "Chat",
  chatSchema
);