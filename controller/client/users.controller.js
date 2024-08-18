const userModel = require("../../models/user.model");
const usersSocket = require("../../socket/users.socket");


module.exports.notFriend = async (req, res) => {
  const idUser = res.locals.user.id;

  await usersSocket(req, res);

  const listNotFriend = await userModel.find({
    _id: {$ne : idUser},
    status: "active",
    deleted: false
  }).select("fullName id avatar");
  
  res.render("client/pages/user/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    listNotFriend: listNotFriend
  });
}