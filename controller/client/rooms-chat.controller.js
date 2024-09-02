const usermModel = require("../../models/user.model");
const roomChatModel = require("../../models/room-chat.model");


module.exports.index = async (req, res) => {
  
  const listRooms = await roomChatModel.find({
    type: "group",
    "users.idUser": res.locals.user.id
  });

  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Nhóm Chat",
    listRooms: listRooms
  });

};


module.exports.creat = async (req, res) => {
  const friendsList = res.locals.user.friendsList;

  for (const item of friendsList) {
    const user = await usermModel.findOne({
      _id: item.userId
    }).select("fullName");
    item.fullName = user.fullName;
  }

  res.render("client/pages/rooms-chat/creat.pug", {
    pageTitle: "Nhóm Chat",
    friendsList: friendsList
  });
};

module.exports.creatPost = async (req, res) => {

  const dataRoom = {
    title: "",
    type: "group",
    users: []
  };
  const dataForm = req.body;

  if(typeof(dataForm.usersId) == 'object'){
    dataRoom.users.push({
    idUser: res.locals.user.id,
    role: "superAdmin"
    });

    dataForm.usersId.forEach( item => {
      dataRoom.users.push({
        idUser: item,
        role: "member"
      });
    });
    const newRoom = new roomChatModel(dataRoom);
    await newRoom.save();
    res.redirect(`/chat/${newRoom.id}`);
  }
  else{
    //Nhung thu vien flash vao project(chua lam)
    res.redirect(`/rooms-chat/create`);
  }
  // res.send("ok");

};