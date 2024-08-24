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

// Danh sach chap nhan ket ban
module.exports.accept = async (req, res) => {

  const acceptFriends = res.locals.user.acceptFriends;

  await usersSocket(req, res);
  
  const listAcceptFriend = await userModel.find({
    _id: {
      $in: acceptFriends
    },
    status: "active",
    deleted: false
  }).select("fullName id avatar");

  res.render("client/pages/users/accept.pug", {
    pageTitle: "Trang chấp nhận kết bạn",
    users: listAcceptFriend
  })

}
//End Danh sach chap nhan ket ban

//Danh sach ban be
module.exports.friends = async (req, res) => {

  const Friends = res.locals.user.friendsList;
  const friendsListId = Friends.map(item => item.userId);

  const listIdFriends = await userModel.find({
    _id: {$in : friendsListId}
  }).select("fullName id avatar");
  
  res.render("client/pages/users/friends.pug", {
    pageTitle: "Danh sách bạn bè",
    users: listIdFriends
  });

};
//End Danh sach ban be
