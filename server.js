const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

let users = [];
let board = Array(9).fill(null);
let turn = "X";

io.on("connection", socket => {
  if (users.length < 2) users.push(socket.id);
  io.emit("user-count", users.length);

  socket.on("send-message", msg => {
    socket.broadcast.emit("receive-message", msg);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });

  socket.on("play-move", index => {
    if (!board[index]) {
      board[index] = turn;
      turn = turn === "X" ? "O" : "X";
      io.emit("game-update", { board });
    }
  });

  socket.on("reset-game", () => {
    board = Array(9).fill(null);
    turn = "X";
    io.emit("game-update", { board });
  });

  socket.on("disconnect", () => {
    users = users.filter(id => id !== socket.id);
    io.emit("user-count", users.length);
  });
});

http.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
