const roomChatModel = require("../../models/room-chat.model");

module.exports = async (req, res, next) => {
  try {
    const idUser = res.locals.user.id;
    const roomChatId = req.params.id;

    const roomChat = await roomChatModel.findOne({
      _id: roomChatId,
      "users": {
        $elemMatch: {
          idUser: idUser,
          role: "superAdmin"
        }
      }
    });

    if(roomChat){
      next();
    }
    else
      res.redirect("/");

    // const listUser = roomChat.users;

    // for (const item of listUser) {
    //   if(item.idUser == idUser && item.role == "superAdmin"){
    //     next();
    //     return;
    //   }
    // }


  } catch (error) {
    res.redirect("/");
  }
};