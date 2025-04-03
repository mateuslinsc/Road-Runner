const gameArea = document.getElementById('gameArea');
const playerCar = document.getElementById('playerCar');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');  // Elemento para exibir a melhor pontuação

let player = { x: 175, y: 500, speed: 30, score: 0 };
let enemies = [];
let isGameOver = false;

// Recupera a melhor pontuação do localStorage ou define como 0 se não houver
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreElement.textContent = `Melhor Pontuação: ${highScore}`;

// Movimenta o carro do jogador
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

// Função para criar inimigos
function createEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${Math.random() * 350}px`;
  enemy.style.top = '-120px';
  gameArea.appendChild(enemy);
  enemies.push({ element: enemy, speed: 3 + Math.random() * 2 });
}

// Atualiza os inimigos
function updateEnemies() {
  enemies.forEach((enemy, index) => {
    const rect = enemy.element.getBoundingClientRect();
    const playerRect = playerCar.getBoundingClientRect();

    // Checa colisão
    if (
      rect.top < playerRect.bottom &&
      rect.bottom > playerRect.top &&
      rect.left < playerRect.right &&
      rect.right > playerRect.left
    ) {
      isGameOver = true;
      alert('Game Over! Pontuação: ' + player.score);
      updateHighScore();
      window.location.reload();  // Recarrega o jogo
    }

    // Movimenta os inimigos
    const currentTop = parseFloat(enemy.element.style.top);
    enemy.element.style.top = `${currentTop + enemy.speed}px`;

    // Remove os inimigos que saem da tela
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

// Atualiza o jogo
function updateGame() {
  if (isGameOver) return;

  // Atualiza a dificuldade
  updateDifficulty();

  // Atualiza a posição do jogador
  playerCar.style.left = `${player.x}px`;
  playerCar.style.top = `${player.y}px`;

  // Atualiza os inimigos
  updateEnemies();

  // Atualiza a pontuação
  scoreElement.textContent = `Pontuação: ${player.score}`;

  // Cria inimigos periodicamente
  if (Math.random() < 0.02) {
    createEnemy();
  }

  requestAnimationFrame(updateGame);
}

function updateHighScore() {
  if (player.score > highScore) {
    highScore = player.score;
    localStorage.setItem('highScore', highScore);  // Salva a nova melhor pontuação no localStorage
    highScoreElement.textContent = `Melhor Pontuação: ${highScore}`;  // Atualiza a exibição
  }
}

// Inicia o jogo
updateGame();




