const chatForm = document.getElementById("chat-form");
const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// Join Chat/Room
socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // get room and users
  socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  // scroll down for every msg
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;
  console.log(msg);

  // Emitting message to server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> &nbsp; ${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
