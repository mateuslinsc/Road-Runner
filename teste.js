const gameArea = document.getElementById('gameArea');
const playerCar = document.getElementById('playerCar');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');  

let player = { x: 175, y: 500, speed: 30, score: 0 };
let enemies = [];
let isGameOver = false;


let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreElement.textContent = `Melhor Pontuação: ${highScore}`;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && player.x > 0) {
    player.x -= player.speed;
  }
  if (e.key === 'ArrowRight' && player.x < 350) {
    player.x += player.speed;
  }
  if (e.key === 'ArrowUp' && player.y > 0) {
    player.y -= player.speed;
  }
  if (e.key === 'ArrowDown' && player.y < 500) {
    player.y += player.speed;
  }
});

function createEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${Math.random() * 350}px`;
  enemy.style.top = '-120px';
  gameArea.appendChild(enemy);
  enemies.push({ element: enemy, speed: 3 + Math.random() * 2 });
}

function updateEnemies() {
  enemies.forEach((enemy, index) => {
    const rect = enemy.element.getBoundingClientRect();
    const playerRect = playerCar.getBoundingClientRect();

    if (
      rect.top < playerRect.bottom &&
      rect.bottom > playerRect.top &&
      rect.left < playerRect.right &&
      rect.right > playerRect.left
    ) {
      isGameOver = true;
      alert('Game Over! Pontuação: ' + player.score);
      updateHighScore();
      window.location.reload();  
    }

    const currentTop = parseFloat(enemy.element.style.top);
    enemy.element.style.top = `${currentTop + enemy.speed}px`;

    if (currentTop > 600) {
      gameArea.removeChild(enemy.element);
      enemies.splice(index, 1);
      player.score += 1;
    }
  });
}

function updateDifficulty() {
  if (player.score >= 25) {
    player.speed = 30;
  } else if (player.score >= 20) {
    player.speed = 25;
  } else if (player.score >= 10) {
    player.speed = 15;
  }
}

function updateGame() {
  if (isGameOver) return;

  updateDifficulty();

  playerCar.style.left = `${player.x}px`;
  playerCar.style.top = `${player.y}px`;

  updateEnemies();

  scoreElement.textContent = `Pontuação: ${player.score}`;

  if (Math.random() < 0.02) {
    createEnemy();
  }

  requestAnimationFrame(updateGame);
}

function updateHighScore() {
  if (player.score > highScore) {
    highScore = player.score;
    localStorage.setItem('highScore', highScore);  
    highScoreElement.textContent = `Melhor Pontuação: ${highScore}`; 
  }
}

updateGame();




