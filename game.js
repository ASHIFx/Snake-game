const board = document.querySelector(".board");
const scoreEl = document.querySelector(".score p");

const pauseBtn = document.querySelectorAll(".btn")[0]; 
const resetBtn = document.querySelectorAll(".btn")[1]; 

const upBtn = document.querySelector(".up");
const downBtn = document.querySelector(".down");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");
const gameOverEl = document.querySelector(".gameover");

const highScoreEl = document.querySelector(".highscore");

const gridSize = 20; 
const totalCells = gridSize * gridSize;
let cells = [];

let snake = [42, 41, 40]; 
let direction = 1; 
let nextDirection = 1;

let food = 0;
let score = 0;

let speed = 220;        
let minSpeed = 70;     
let speedStep = 15; 
let gameInterval = null;
let isPaused = false;

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
    cells.push(cell);
  }
}

function draw() {
  cells.forEach((cell) => {
    cell.classList.remove("snake");
    cell.classList.remove("food");
  });

  snake.forEach((index) => {
    if (cells[index]) cells[index].classList.add("snake");
});

    if (cells[food]) cells[food].classList.add("food");
}

function spawnFood() {
    let newFood = Math.floor(Math.random() * totalCells);

  while (snake.includes(newFood)) {
    newFood = Math.floor(Math.random() * totalCells);
  }

    food = newFood;
}

function updateScore() {
    scoreEl.textContent = score;
}

function gameOver() {
  saveHighScore();
  clearInterval(gameInterval);
  gameInterval = null;

  gameOverEl.style.display = "block";
}



function moveSnake() {
    direction = nextDirection;

    const head = snake[0];
    const newHead = head + direction;

    if (direction === 1 && head % gridSize === gridSize - 1) return gameOver();
    if (direction === -1 && head % gridSize === 0) return gameOver();
    if (direction === -gridSize && head < gridSize) return gameOver();
    if (direction === gridSize && head >= totalCells - gridSize) return gameOver();

    if (snake.includes(newHead)) return gameOver();

    snake.unshift(newHead);

    if (newHead === food) {
        score += 1;
        updateScore();
        saveHighScore();
        increaseSpeed();  
        spawnFood();
    } else {
        snake.pop();
    }
    draw();
}

function startGame() {
  if (gameInterval) return;
  gameInterval = setInterval(moveSnake, speed);
}

function togglePause() {
  if (!gameInterval) {
    startGame();
    pauseBtn.textContent = "Pause";
    isPaused = false;
  } else {
    clearInterval(gameInterval);
    gameInterval = null;
    pauseBtn.textContent = "Resume";
    isPaused = true;
  }
}

function resetGame() {
    clearInterval(gameInterval);
    gameInterval = null;

    snake = [42, 41, 40];
    direction = 1;
    nextDirection = 1;
    speed = 220;

    score = 0;
    updateScore();
    loadHighScore();
    spawnFood();
    draw();
    gameOverEl.style.display = "none";

    pauseBtn.textContent = "Pause";
    isPaused = false;

    startGame();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== gridSize) {
        nextDirection = -gridSize;
    } else if (e.key === "ArrowDown" && direction !== -gridSize) {
        nextDirection = gridSize;
    } else if (e.key === "ArrowLeft" && direction !== 1) {
        nextDirection = -1;
    } else if (e.key === "ArrowRight" && direction !== -1) {
        nextDirection = 1;
    }
});

upBtn.addEventListener("click", () => {
    if (direction !== gridSize) nextDirection = -gridSize;
});
downBtn.addEventListener("click", () => {
    if (direction !== -gridSize) nextDirection = gridSize;
});
leftBtn.addEventListener("click", () => {
    if (direction !== 1) nextDirection = -1;
});
rightBtn.addEventListener("click", () => {
    if (direction !== -1) nextDirection = 1;
});

function loadHighScore() {
    const savedHigh = localStorage.getItem("snakeHighScore");
    highScoreEl.textContent = savedHigh ? savedHigh : 0;
}

function saveHighScore() {
    let currentHigh = Number(localStorage.getItem("snakeHighScore")) || 0;

  if (score > currentHigh) {
    localStorage.setItem("snakeHighScore", score);
    highScoreEl.textContent = score;
  }
}

function increaseSpeed() {
  if (!gameInterval) return;

  if (score % 5 === 0 && speed > minSpeed) {
    speed -= speedStep;

    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, speed);
  }
}


pauseBtn.addEventListener("click", togglePause);
resetBtn.addEventListener("click", resetGame);

createBoard();
spawnFood();
draw();
updateScore();
loadHighScore();
startGame();

