import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

import {FileUploadWithPreview} from 'https://unpkg.com/file-upload-with-preview/dist/index.js';

const formChat = document.querySelector(".chat .inner-form");
if(formChat){
  const upload = new FileUploadWithPreview('image-preview', {
    multiple: true,
    maxFileCount: 6
  });
  formChat.addEventListener("submit", (event)=> {
    event.preventDefault();
    const content = event.target.content.value || ""; 
    const listImages = upload.cachedFileArray;
    if(content || listImages.length > 0){
      socket.emit("CLIENT_SEND_MESSAGES", {
        content: content,
        images: listImages
      });
    }
    event.target.content.value = "";
    upload.resetPreviewPanel();
    // socket.emit("CLIENT_SEND_TYPING", "hidden");
  });
}

// console.log(FileUploadWithPreview);

socket.on("SEVER_SEND_MESSAGES", (data) => {
  
  const myId = document.querySelector(".chat").getAttribute("my-id")
  let div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";
  if(data.userId == myId){
    div.classList.add("inner-outgoing");
  }else{
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  if(data.content){
    htmlContent = ` <div class="inner-content">${data.content}</div>`;
  }
  if(data.listImages.length > 0) {
    htmlImages += `
      <div class="inner-images">
    `;

    for(const linkImage of data.listImages){
      htmlImages += `<img src=${linkImage}>
      `;
    }

    htmlImages += "</div>";

  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
    `;
  const body = document.querySelector(".inner-body");
  body.appendChild(div);

  body.scrollTop = body.scrollHeight;
  new Viewer(div);
})

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom

//Chen icon
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker){
  emojiPicker.addEventListener('emoji-click', (event)=>{
    const iconChat = event.detail.unicode;
    const input = document.querySelector(".inner-form input[name='content']");
    if(input){
      input.value += iconChat;
    }
  });
}
//End Chen icon

// Popup Icon
const button = document.querySelector('[button-icon]');
if(button){
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(button, tooltip);
  button.addEventListener("click", ()=> {
    tooltip.classList.toggle('shown');
  });
}
// End Popup Icon

//Preview images
if(bodyChat){
  new Viewer(bodyChat)
}
//End Preview images

// Typing
var typingTimeOut;
const input = document.querySelector(".inner-form input[name='content']");
if(input){
  input.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
    clearTimeout(typingTimeOut);
    
    typingTimeOut = setTimeout( ()=> {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
  });
  // setTimeout( ()=> {
  //   socket.emit("CLIENT_SEND_TYPING", "hidden");
  // }, 3000);

}
// End Typing

// SERVER_RETURN_TYPING
const listTyping = document.querySelector(".chat .inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data)=> {
  if(data.typing == "show"){
    const existTyping = listTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
    if(!existTyping){
      const divTyping = document.createElement("div");
      divTyping.classList.add("box-typing");
      divTyping.setAttribute("user-id", `${data.userId}`);
      divTyping.innerHTML = 
        `<div class="inner-name">${data.fullName}</div>
        <div class="inner-dots"><span></span><span></span><span></span></div>`;

      listTyping.appendChild(divTyping);
    }
  }
  else{
    const boxTyping = listTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
    if(boxTyping)
      listTyping.removeChild(boxTyping);
  }
});
// End SERVER_RETURN_TYPING


// preview anh trong form ben admin
const divImage = document.querySelector("[upload-image]");
if(divImage){
  const imageInput = divImage.querySelector("[upload-image-input]"); 
  const imagePreview = divImage.querySelector("[upload-image-preview]");
  if(imageInput){
    imageInput.addEventListener("change", ()=>{
      const file = imageInput.files[0];
      if(file){
        imagePreview.src = URL.createObjectURL(file);
      }
    });
  } 
}
// End preview anh trong form ben admin


//Change role user in Group
const buttonChange = document.querySelectorAll("[change-role-user]");
const listGroup = document.querySelector(".list-group");
if(buttonChange.length > 0){
  buttonChange.forEach(item => {
    item.addEventListener("click", ()=> {
      const idUserChange = item.getAttribute("idUser");
      if(listGroup){
        const valueSelect = listGroup.querySelector(`[iduser="${idUserChange}"]`);
        if(valueSelect){
          const dataChange = {
            role: valueSelect.value,
            idUser: item.getAttribute("idUser")
          }
          const link = item.getAttribute("link");
          // console.log(dataChange);
          fetch(link, {
            method : "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataChange)
          })
          // Tra ve cho FE data dang json, roi dich json thanh js
          .then(res => res.json())
          //Dich xong tra gia tri cho data, neu thanh cong reload lai trang
          .then(data => {
            if(data.code == 200){
              // window.location.reload();
              console.log("ok");
            }
          })
        }
      }
    });
  });
}
//End Change role user in Group


//Add member vao group
const listButtonAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listButtonAddFriend.length > 0){
  listButtonAddFriend.forEach(item => {
    item.addEventListener("click", ()=>{
      const parent = item.closest(".box-user-add");
      if(parent){
        parent.classList.add("added");
      }
      const link = item.getAttribute("link");
      const dataUser = {
        id : item.getAttribute("btn-add-friend")
      };
      fetch(link, {
        method : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser) //Chi nhan object
      })
      .then(res => res.json())
      .then(data => {
        if(data.code == 200){
          // window.location.reload();
          console.log("ok");
        }
      })
  });
})}
//End Add member vao group










