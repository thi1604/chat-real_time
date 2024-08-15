const chatModel = require("../../models/chat.model");
const chatSoket = require("../../socket/chat.socket");
const userModel = require("../../models/user.model");

module.exports.chat = async (req, res) => {
  // socket.io
  await chatSoket(req, res);
  //End socket.io
  
  const chats = await chatModel.find({});
  
  for (const item of chats) {
      const user = await userModel.findOne({
        _id: item.userId
      }).select("fullName");

      item.fullName = user.fullName;
  }

  res.render("client/pages/chat/index.pug", {
    chats: chats
  });
}