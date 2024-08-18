const userModel = require("../../models/user.model");

module.exports.notFriend = async (req, res) => {
  const idUser = res.locals.user.id;
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