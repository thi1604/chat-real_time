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