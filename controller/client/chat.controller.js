const chatModel = require("../../models/chat.model");
const chatSoket = require("../../socket/chat.socket");
const userModel = require("../../models/user.model");
const roomChatModel = require("../../models/room-chat.model");
// const streamUpLoad = require("../../helper/streamUpload");

module.exports.chat = async (req, res) => {
  // socket.io
  await chatSoket(req, res);
  //End socket.io
  
  const chats = await chatModel.find({
    roomChatId: req.params.id
  });

  const roomChat = await roomChatModel.findOne({
    _id: req.params.id
  });

  let titleRoomChat = roomChat.title || "Phòng Chat Của ";
  //Lay ten doi phuong khi typeRoom la "friend"
  const listUser = roomChat.users;
  if(listUser.length == 2){
    titleRoomChat = listUser[0].idUser == res.locals.user.id ? listUser[1].idUser : listUser[0].idUser; 
    const friend = await userModel.findOne({
      _id: titleRoomChat
    }).select("fullName avatar");
  
    titleRoomChat = friend;
  }
  //End Lay ten doi phuong khi typeRoom la "friend"
  
  //Lay ra role cua user current
  const roleUser = listUser.find(item => item.idUser == res.locals.user.id).role;

  for (const item of chats) {
    const user = await userModel.findOne({
      _id: item.userId
    }).select("fullName");
    item.fullName = user.fullName;  
    //Neu co alias, thay the fullName thanh alias luon
    const aliasUser = listUser.find(user => user.idUser == item.userId);
    if(aliasUser.alias) {
      item.fullName = aliasUser.alias
    }
  }

  
  res.render("client/pages/chat/index.pug", {
    chats: chats,
    titleRoomChat: titleRoomChat,
    roleUser: roleUser,
    roomChat: roomChat
  });
}

module.exports.changeTitle = async (req, res) => {

  const roomChat = await roomChatModel.findOne({
    _id: req.params.id
  });

  const idRoom = roomChat.id;

  res.render("client/pages/chat/change-title.pug", {
    pageTitle: "Đổi tên nhóm",
    idRoom: idRoom
  });
}

module.exports.changeTitlePatch = async (req, res) => {
  const idRoom = req.params.id;
  const newTitle = req.body.newTitle;
  await roomChatModel.updateOne({
    _id: idRoom
  }, {
    "title": newTitle
  });
  res.redirect(`/chat/${idRoom}`);
}

module.exports.changeName = async (req, res) => {

  const userRoomChat = await roomChatModel.findOne({
    _id: req.params.id
  }).select("users id");


  for (const user of userRoomChat.users ) {
    const inforUser = await userModel.findOne({
      _id: user.idUser
    }).select("fullName avatar");

    user.fullName = inforUser.fullName;
    // user.avatar = inforUser.avatar;
  }

  res.render("client/pages/chat/change-name-user.pug", {
    pageTitle: "Đổi tên thành viên",
    userRoomChat: userRoomChat.users,
    idRoom: userRoomChat.id
  });

  // res.send("ok");
}

module.exports.changeNamePatch = async (req, res) => {
  
  const idRoom = req.params.id;

  await roomChatModel.updateOne({
    _id: idRoom,
    "users.idUser": req.params.idUser
  }, {
    $set: {"users.$.alias" : req.body.newAlias}
  });

  res.redirect(`/chat/${idRoom}`);
}

module.exports.changeAvatar = async (req, res) => {
  // res.send("ok");
  const roomChat = await roomChatModel.findOne({
    _id: req.params.id
  });
  res.render("client/pages/chat/change-avatar.pug", {
    pageTitle: "Đổi ảnh nhóm",
    roomChat: roomChat
  })
}

module.exports.changeAvatarPatch = async (req, res) => {
  // const result = await streamUpLoad(req.file.buffer);
  const idRoom = req.params.id;
  await roomChatModel.updateOne({
    _id: req.params.id
  }, {
    "avatar" : req.urlCloud // Da them link image tu cloudinary ben middlewares
  });
  res.redirect(`/chat/${idRoom}`)
}

