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
      }
    //End Cap nhat danh sach acceptFriends cua ongB 
    // End addFriend

  })
  
  // Huy ket ban
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
  // End Huy ket ban
  });
}

