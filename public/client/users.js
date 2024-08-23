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

//Cap nhat danh sach acceptFriends realtime cho ong B
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
  const badgeAcceptFriend = document.querySelector(`[badge-user-id="${data.idB}"]`);
  if(badgeAcceptFriend){
    badgeAcceptFriend.innerHTML = data.length;
  }
});
//End Cap nhat danh sach acceptFriends realtime cho ong B

socket.on("SERVER_RETURN_INFO_A_IN_ACCEPT_FRIENDS", (data)=> {
  const listAcceptOfB = document.querySelector(`[data-user-accept="${data.idB}"]`);
  if(listAcceptOfB){
    const boxUserA = document.createElement("div");
    boxUserA.classList.add("col-6");
    boxUserA.innerHTML = `
      <div class="box-user" box-user-accept="${data.infoA._id}">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.infoA.fullName}">
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.infoA.fullName}
          </div>
          <div class="inner-buttons">
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoA._id}">Chấp nhận
            </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoA._id}">Xóa
            </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">Đã xóa
            </button>
            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">Đã chấp nhận
            </button>
          </div>
        </div>
      </div>`
    listAcceptOfB.appendChild(boxUserA);
  };
})


socket.on("SERVER_RETURN_CANCEL_REQUEST_FRIEND", (data) => {
  const listBoxUser = document.querySelector(`[data-user-accept="${data.idB}"]`);
  const boxUserA = listBoxUser.querySelector(`[box-user-accept="${data.idA}"]`);
  if(boxUserA){
    const colOfBoxA = boxUserA.closest(".col-6");
    if(colOfBoxA){
      colOfBoxA.remove();
    }
  }
});
