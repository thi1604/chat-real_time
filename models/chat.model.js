const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: String,
  content: String,
  images: Array,
}, {
  timestamps: true
});

const Chat = new mongoose.model("Chat", chatSchema, "chat");

module.exports = Chat;