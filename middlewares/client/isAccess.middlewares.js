const roomChatModel = require("../../models/room-chat.model");

module.exports = async (req, res, next) => {
  try {
    const idUser = res.locals.user.id;
    const roomChatId = req.params.id;
    console.log(idUser, roomChatId);

  const roomChat = await roomChatModel.findOne({
    _id: roomChatId,
    "users.idUser": idUser
  });

  if(roomChat){
    next();
  }
  else {
    res.redirect("/");
  }
  } catch (error) {
    res.redirect("/");
  }
};