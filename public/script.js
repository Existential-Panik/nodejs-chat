var socket = io("http://localhost:3000");
var messages = document.getElementById("messages");
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

// Create new message list element
function appendMessage(message) {
  const messageElem = document.createElement("li");
  messageElem.textContent = message;
  messages.append(messageElem);
}
