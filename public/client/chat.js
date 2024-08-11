var socket = io();

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
})

