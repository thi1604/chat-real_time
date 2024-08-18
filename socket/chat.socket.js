const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const streamUpLoad = require("../helper/streamUpload");


module.exports = async (req, res) => {

  const idUser = res.locals.user.id;
  const user = await userModel.findOne({
    _id: idUser
  }).select("fullName");


  _io.once('connection',  (socket) => {
    console.log('a user connected', socket.id);
    socket.on("CLIENT_SEND_MESSAGES", async (data) => {
      data.userId = idUser;
      const listLinkImages = [];

      for(const item of data.images) {
        const result = await streamUpLoad(item);
        listLinkImages.push(result.url);
      }
      
      data.images = listLinkImages;

      const record = new chatModel(data);
      await record.save();
     
      _io.emit("SEVER_SEND_MESSAGES", {//Cho tat ca mn thay tin nhan
        userId: idUser,
        fullName: user.fullName,
        content: data.content,
        listImages: data.images
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
};