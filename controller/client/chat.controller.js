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
    pageTitle: `${titleRoomChat.fullName}`,
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

module.exports.member = async (req, res) => {
  const roomChat = await roomChatModel.findOne({
    _id: req.params.id
  });
  
  const usersInGroup = roomChat.users;

  for (const item of usersInGroup) {

    const user = await userModel.findOne({
      _id: item.idUser
    }).select("fullName statusOnline");
    
    item.statusOnline = user.statusOnline;

    item.fullName = user.fullName;  
    //Neu co alias, thay the fullName thanh alias luon
    if(item.alias){
      item.fullName = item.alias;
    }
  }

  // console.log(usersInGroup);

  res.render("client/pages/chat/member.pug", {
    pageTitle: "Thành viên nhóm",
    usersInGroup: usersInGroup,
    idRoom : roomChat.id
  })
  // res.send("ok");
};

module.exports.addMember = async (req, res) => {

  const roomChat = await roomChatModel.findOne({
    _id: req.params.id
  });

  const listFriends = roomChat.users;
  const arrayIdUSer = [];
  listFriends.forEach(item => {
    if(item.idUser != res.locals.user.id)
      arrayIdUSer.push(item.idUser);
  });

  const listUserNotInGroup = await userModel.find({
    $and: [
     { _id: {$ne: res.locals.user.id}},
    {_id: {
        $nin : arrayIdUSer}
    }
    ] //Dau ngoac vuong cho $and
  }).select("fullName avatar statusOnline id");

  res.render("client/pages/chat/add-member.pug", {
    pageTitle: "Thêm thành viên",
    listUserNotInGroup: listUserNotInGroup,
    idRoom : roomChat.id
  })

};

module.exports.addMemberPatch = async (req, res) => {
  const newUser = {};
  newUser.idUser = req.body.id;
  newUser.role = "Member"
  newUser.alias = "";

  await roomChatModel.updateOne({
    _id: req.params.id
  }, {
    $push: {
      "users": newUser
    }
  });

  res.json({
    code: 200
  });
}

module.exports.updateRoleMember = async (req, res) => {
  const roomChat = await roomChatModel.findOne({
    _id: req.params.id
  });
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


  res.render("client/pages/chat/update-role.pug", {
    pageTitle: "Nâng cấp thành viên",
    userRoomChat: userRoomChat.users,
    idRoom: userRoomChat.id
  });
};


module.exports.updateRoleMemberPatch = async (req, res) => {
  const roleChange = req.body.role;
  const idUser = req.body.idUser;

  await roomChatModel.updateOne({
    _id: req.params.id,
    "users.idUser": idUser
  }, {
    $set: {"users.$.role" : roleChange}
  });
  
  res.json({
    code: 200
  });
}