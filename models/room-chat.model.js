const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema({
  title: String,
  type: String,
  avatar: String,
  users: [
    {
      idUser: String,
      role: String,
      alias: String
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const roomChat = new mongoose.model("roomChat", roomChatSchema, "room-chat");

module.exports = roomChat;

