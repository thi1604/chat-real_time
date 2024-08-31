const userModel = require("../models/user.model");
const roomChatModel = require("../models/room-chat.model");

module.exports = async (req, res) => {

  _io.once('connection',  (socket) => {
    socket.on("CLIENT_SEND_ADD_FRIEND", async (data) => { //De y dau ngoac, phai ngoac het ham!!!
      const idA = res.locals.user.id;
      const idB = data.idUserB;
      //Cap nhat danh sach yeu cau kb cua ongA
      const existidBinA = await userModel.findOne({
        _id: idA,
        requestFriends: idB
      });
    
      if(!existidBinA){
        await userModel.updateOne({
          _id: idA
        }, {
          $push: {
            requestFriends: idB
          }
        });
      }
      //End Cap nhat danh sach yeu cau kb cua ongA
    
      //Cap nhat danh sach acceptFriends cua ongB 
      const existidAinB = await userModel.findOne({
        _id: idB,
        acceptFriends: idA
      });
      if(!existidAinB){
        await userModel.updateOne({
          _id: idB
        }, {
          $push: {
            acceptFriends: idA
          }
        });

        //Cap nhat danh sach acceptFriends realtime cho ong B

        const userIdB = await userModel.findOne({
          _id: idB
        });

        socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
          idB: userIdB.id,
          length: userIdB.acceptFriends.length
        });


        //Hien thi ong A trong list accept cua ong B
        const userIdA = await userModel.findOne({
          _id: idA
        }).select("fullName avatar id requestFriends");

        socket.broadcast.emit("SERVER_RETURN_INFO_A_IN_ACCEPT_FRIENDS", {
          infoA: userIdA,
          idB: idB
        });

      }
    //End Cap nhat danh sach acceptFriends cua ong  B 

    //Hien thi so luong requestFriend cho ong A
      const userIdA = await userModel.findOne({
        _id: idA
      });

      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", {
        idA: idA,
        length: userIdA.requestFriends.length
      });
    

    //Xoa ong A khoi danh sach user cua ong B
    socket.broadcast.emit("SERVER_RETURN_ID_USER_ACCEPT_FR", {
      idA: idA,
      idB: idB
    });
    // End addFriend

  })
  
  // A huy ket ban
    socket.on("CLIENT_SEND_CANCEL_FRIEND", async (data) => {
      const idB = data.idB;
      const idA = res.locals.user.id;
      //Cap nhat danh sach gui yeu cau kb cua ong A
      await userModel.updateOne({
        _id: idA
      }, {
        $pull: {
          requestFriends: idB
        }
      });
      //End Cap nhat danh sach gui yeu cau kb cua ong A

      //Cap nhat danh sach chap nhan kb cua ong B
      await userModel.updateOne({
        _id: idB
      }, {
        $pull: {
          acceptFriends: idA
        }
      });
      //End Cap nhat danh sach chap nhan kb cua ong B

      const userIdB = await userModel.findOne({
        _id: idB
      });

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        idB: userIdB.id,
        length: userIdB.acceptFriends.length
      });

      socket.broadcast.emit("SERVER_RETURN_CANCEL_REQUEST_FRIEND", {
        idB: userIdB.id,
        idA: idA
      });

      const userIdA = await userModel.findOne({
        _id: idA
      });

      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIENDS", {
        idA: idA,
        length: userIdA.requestFriends.length
      });

    });
  // End A huy ket ban

  //A dong y ket ban vs B
    socket.on("CLIENT_SEND_ACCEPT_FRIEND", async (data)=>{
      const idA = res.locals.user.id;
      const idB = data.idB;
      const IdBInfriendlistIdA = await userModel.findOne({
        $and: [
          {_id: idA},
          {
            friendsList: idB
          }
        ]
      });
      //Kiem tra xem A va B da la ban chua, neu chua thi moi cap nhat
      if(!IdBInfriendlistIdA){
        //Cap nhat danh sach acceptFriend, FriendList cua A
        await userModel.updateOne({
          _id: idA
        }, {
          $pull: {
            acceptFriends: idB
          }
        });
        //End Cap nhat danh sach acceptFriend, FriendList cua A
        //Tao phong chat cho A va B khi acceptFriend
        const roomChat = new roomChatModel({
          type: "friend",
          users: [
            {
              idUser: idA,
              role: "superAdmin"
            },
            {
              idUser: idB,
              role: "superAdmin"
            }
          ] 
        });

        await roomChat.save();

        await userModel.updateOne({
          _id: idA
        }, {
          $push: {
            friendsList: {
              userId: idB,
              roomChatId: `${roomChat.id}`
            }
          }
        });
        //Realtime
        const userA = await userModel.findOne({
          _id: idA
        });

        socket.emit("SERVER_RETURN_LENGTH_LIST_AND_ACCEPT_A", {
          idA: idA,
          lengthAC: userA.acceptFriends.length,
          lengthFr: userA.friendsList.length
        });

        //Cap nhat danh sach request cua B, FriendList cua B
        await userModel.updateOne({
          _id: idB
        }, {
          $pull: {
            requestFriends: idA
          }
        });

        await userModel.updateOne({
          _id: idB
        }, {
          $push: {
            friendsList: {
              userId: idA,
              roomChatId: `${roomChat.id}`
            }
          }
        });

        const userB = await userModel.findOne({
          _id: idB
        });

        socket.broadcast.emit("SERVER_RETURN_LENGTH_LIST_AND_REQUEST_B", {
          idB: idB,
          lengthRQ: userB.requestFriends.length,
          lengthFr: userB.friendsList.length
        });
      }
        //End Cap nhat danh sach request cua B, FriendList cua B
    })
  //End A dong y ket ban vs B
  
  //A !dong y ket ban B
    socket.on("CLIENT_SEND_REFUSE_FRIEND", async (data)=> {
      const idA = res.locals.user.id;
      const idB = data.idB;
      //Cap nhat acceptFriend cua A
      await userModel.updateOne({
        _id: idA
      }, {
        $pull: {
          acceptFriends: idB
        }
      });
      //End Cap nhat acceptFriend cua A
  
      //Cap nhat requestFriend cua B
      await userModel.updateOne({
        _id: idB
      }, {
        $pull: {
          requestFriends: idA
        }
      });
      //End Cap nhat requestFriend cua B
    })
  //End A !dong y ket ban B

  });
}

