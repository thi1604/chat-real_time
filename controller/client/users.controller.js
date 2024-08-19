const userModel = require("../../models/user.model");
const usersSocket = require("../../socket/users.socket");


// Danh sách người dùng


module.exports.notFriend = async (req, res) => {
  const idUser = res.locals.user.id;
  
  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;
  const friendsList = res.locals.user.friendsList;
  const friendsListId = friendsList.map(item => item.userId);
  
  
  await usersSocket(req, res);
  
  const listNotFriend = await userModel.find({
    $and: [
      {_id: {$ne: idUser}},
      {_id: {$nin: acceptFriends}},
      {_id: {$nin: requestFriends}}, 
      {_id: {$nin: friendsListId}}    // $nin va $in: chi chap nhan 1 mang id, khong chap nhan object !!!
    ],
    status: "active",
    deleted: false
  }).select("fullName id avatar");
  
  res.render("client/pages/user/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    listNotFriend: listNotFriend
  });
}
//End Danh sách người dùng


//Danh sách yêu cầu kết bạn
module.exports.request = async (req, res) => {

  const requestFriends = res.locals.user.requestFriends;
 
  await usersSocket(req, res);
  
  const listRequestFriend = await userModel.find({
    _id: {
      $in: requestFriends
    },
    status: "active",
    deleted: false
  }).select("fullName id avatar");

  res.render("client/pages/users/request.pug", {
    pageTitle: "Trang yêu cầu kết bạn",
    users: listRequestFriend
  })


}
//End Danh sách yêu cầu kết bạn