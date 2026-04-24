let board = ["","","","","","","","",""];
let human = "X";
let ai = "O";

const boardDiv = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");

function render() {
  boardDiv.innerHTML = "";
  board.forEach((val, i) => {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = val;
    cell.addEventListener("click", () => playerMove(i));
    boardDiv.appendChild(cell);
  });
}

function playerMove(i) {
  if (board[i] !== "" || checkWin(board, human) || checkWin(board, ai)) return;

  board[i] = human;
  render();

  if (checkWin(board, human)) {
    message.innerText = "You Win ";
    return;
  }

  if (isDraw()) {
    message.innerText = "Draw!";
    return;
  }

  setTimeout(aiMove, 300);
}

function aiMove() {
  let bestMove = minimax(board, ai).index;
  board[bestMove] = ai;
  render();

  if (checkWin(board, ai)) {
    message.innerText = "Computer Wins ";
  } else if (isDraw()) {
    message.innerText = "Draw!";
  }
}

function minimax(newBoard, player) {
  let avail = newBoard
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  if (checkWin(newBoard, human)) return {score: -10};
  if (checkWin(newBoard, ai)) return {score: 10};
  if (avail.length === 0) return {score: 0};

  let moves = [];

  for (let i of avail) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    let result = minimax(newBoard, player === ai ? human : ai);
    move.score = result.score;

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWin(b, player) {
  const win = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return win.some(combo => combo.every(i => b[i] === player));
}

function isDraw() {
  return board.every(cell => cell !== "");
}

resetBtn.onclick = () => {
  board = ["","","","","","","","",""];
  message.innerText = "";
  render();
};

render();