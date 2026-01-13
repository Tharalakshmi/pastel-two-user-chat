const socket = io("http://localhost:3000");
const messages = document.getElementById("messages");
const typing = document.getElementById("typing");

function sendMessage() {
  const msg = document.getElementById("msg").value;
  if (!msg) return;
  addMessage("You: " + msg);
  socket.emit("send-message", msg);
  document.getElementById("msg").value = "";
}

function addMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerText = text;
  messages.appendChild(div);
}

socket.on("receive-message", msg => {
  addMessage("Them: " + msg);
});

document.getElementById("msg").addEventListener("input", () => {
  socket.emit("typing");
});

socket.on("typing", () => {
  typing.innerText = "Typing...";
  setTimeout(() => typing.innerText = "", 800);
});

// Music
function toggleMusic() {
  const m = document.getElementById("music");
  m.paused ? m.play() : m.pause();
}

// Game
const game = document.getElementById("game");
const boardDiv = document.querySelector(".board");

function openGame() {
  game.classList.remove("hidden");
}

function resetGame() {
  socket.emit("reset-game");
}

socket.on("game-update", ({ board }) => {
  boardDiv.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.innerText = cell || "";
    div.onclick = () => socket.emit("play-move", i);
    boardDiv.appendChild(div);
  });
});
