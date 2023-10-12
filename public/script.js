var socket = io("http://localhost:3000");
var messages = document.getElementById("messages");
var typing = document.getElementById("typing");
var typingUser = document.getElementById("typingUser");
var form = document.getElementById("form");
var input = document.getElementById("input");

// Make a user choose their name from the start
const username = prompt("Please choose a nickname:");
appendMessage("You joined the chat.");
socket.emit("new-user", username);

// When user sends a message
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = input.value;
  if (message) {
    appendMessage(`You: ${message}`);
    socket.emit("chat message", message);
    input.value = "";
  }
});

//When user starts typing
form.addEventListener("input", function () {
  socket.emit("user-typing", username);
});

//When user stops typing
input.addEventListener('blur', () => {
  socket.emit('stopTyping');
  console.log("Stoped Typing.")
});

//
socket.on("user-connected", (name) => {
  appendMessage(`${name} has joined the chat.`);
});

socket.on("new-message", function (msg) {
  appendMessage(`${msg.name}: ${msg.message}`);
});

socket.on("user-disconnect", (user) => {
  appendMessage(`${user} has been disconnected.`);
});

socket.on("typing-msg", (user) => {
  typingMsg(user);
})

socket.on("stop-typing", () => {
  removeTyping();
})

// Create new message list element
function appendMessage(message) {
  const messageElem = document.createElement("li");
  messageElem.textContent = message;
  messages.append(messageElem);
}

function typingMsg(user) {
  typingUser.textContent = `${user}`;
  typing.classList.remove('hidden');
}

function removeTyping() {
  typing.classList.add('hidden');
}
