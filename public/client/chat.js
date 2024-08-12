var socket = io();
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const formChat = document.querySelector(".chat .inner-form");
if(formChat){
  formChat.addEventListener("submit", (event)=> {
    event.preventDefault();
    const content = event.target.content.value;
    if(content){
      socket.emit("CLIENT_SEND_MESSAGES", {
        content: content
      });
    }
    event.target.content.value = "";
  });
}

socket.on("SEVER_SEND_MESSAGES", (data) => {
  console.log(data);
  const myId = document.querySelector(".chat").getAttribute("my-id")
  let div = document.createElement("div");
  let htmlFullName = "";
  if(data.userId == myId){
    div.classList.add("inner-outgoing");
  }else{
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;

  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
    `;
  const body = document.querySelector(".inner-body");
  body.appendChild(div);

  body.scrollTop = body.scrollHeight;
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


