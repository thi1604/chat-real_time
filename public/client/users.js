// Gui yeu cau ket ban
const buttonsRequest = document.querySelectorAll("[btn-add-friend]");
if(buttonsRequest.length > 0){
  buttonsRequest.forEach( (item)=> {
    item.addEventListener("click", ()=> {
      const idUserB = item.getAttribute("btn-add-friend");
      item.closest(".box-user").classList.add("add");
      socket.emit("CLIENT_SEND_ADD_FRIEND", {
        idUserB : idUserB
      });
    });
  });
};
// End Gui yeu cau ket ban


//Huy yeu cau ket ban

const buttonsCancel = document.querySelectorAll("[btn-cancel-friend]");
if(buttonsCancel.length > 0){
  buttonsCancel.forEach((item)=> {
    item.addEventListener("click", () => {
      const userIdB = item.getAttribute("btn-cancel-friend");
      item.closest(".box-user").classList.remove("add");
      socket.emit("CLIENT_SEND_CANCEL_FRIEND", {
        idB: userIdB
      });
    });
  });
}

//End Huy yeu cau ket ban


//Chap nhan ket ban
const buttonsAccept = document.querySelectorAll("[btn-accept-friend]");
if(buttonsAccept.length > 0){
  buttonsAccept.forEach((item)=> {
    item.addEventListener("click", ()=> {
      item.closest(".box-user").classList.add("accepted");
      const userIdB = item.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_SEND_ACCEPT_FRIEND", {
        idB: userIdB
      });
    });
  });
}
//Chap nhan ket ban

//!chap nhan ket ban
const buttonsRefuse = document.querySelectorAll("[btn-refuse-friend]");
if(buttonsRefuse.length > 0){
  buttonsRefuse.forEach((item)=> {
    item.addEventListener("click", ()=> {
      item.closest(".box-user").classList.add("refuse");
      const userIdB = item.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_SEND_REFUSE_FRIEND", {
        idB: userIdB
      });
    });
  });
}
//End !chap nhan ket ban