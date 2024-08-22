const userModel = require("../models/user.model");

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
        })

      }
    //End Cap nhat danh sach acceptFriends cua ong  B 
    
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

    });
  // End A huy ket ban

  //A dong y ket ban vs B
    socket.on("CLIENT_SEND_ACCEPT_FRIEND", async (data)=>{
      const idA = res.locals.user.id;
      const idB = data.idB;
      const IdBInAcceptidA = await userModel.findOne({
        $and: [
          {_id: idA},
          {
            friendsList: idB
          }
        ]
      });
      //Kiem tra xem A va B da la ban chua, neu chua thi moi cap nhat
      if(!IdBInAcceptidA){
        //Cap nhat danh sach acceptFriend, FriendList cua A
        await userModel.updateOne({
          _id: idA
        }, {
          $pull: {
            acceptFriends: idB
          }
        });
        //End Cap nhat danh sach acceptFriend, FriendList cua A

        await userModel.updateOne({
          _id: idA
        }, {
          $push: {
            friendsList: {
              userId: idB,
              roomChatId: ""
            }
          }
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
              roomChatId: ""
            }
          }
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

