const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("new-message", {
      message: msg,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (data) => {
    data = users[socket.id];
    socket.broadcast.emit("user-disconnect", data);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("listening on port: 3000");
});
