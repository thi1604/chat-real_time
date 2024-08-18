// Gui yeu cau ket ban
const buttonsRequest = document.querySelectorAll("[btn-add-friend]");
if(buttonsRequest.length > 0){
  buttonsRequest.forEach( (item)=> {
    item.addEventListener("click", ()=> {
      const idUserB = item.getAttribute("btn-add-friend");
      
      socket.emit("CLIENT_SEND_ADD_FRIEND", {
        idUserB : idUserB
      });
    });
  });
};
// End Gui yeu cau ket ban