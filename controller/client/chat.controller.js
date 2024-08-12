const userModel = require("../../models/user.model");
const chatModel = require("../../models/chat.model");

module.exports.chat = async (req, res) => {
  const idUser = res.locals.user.id;
  const user = await userModel.findOne({
    _id: idUser
  }).select("fullName");

  _io.once('connection',  (socket) => {
    console.log('a user connected', socket.id);
    socket.on("CLIENT_SEND_MESSAGES", async (data) => {
      data.userId = idUser;
      const record = new chatModel(data);
      await record.save();
      _io.emit("SEVER_SEND_MESSAGES", {//Cho tat ca mn thay tin nhan
        userId: idUser,
        fullName: user.fullName,
        content: data.content
      });
    });
    
    // typing
    socket.on("CLIENT_SEND_TYPING", (data) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: idUser,
        fullName: user.fullName,
        typing: data
      });
    });
    // End typing
    
  });

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