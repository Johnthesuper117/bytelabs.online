const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const samurai = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  color: 'red',
  speed: 5,
  isAttacking: false
};

const enemies = [];
const enemySpeed = 2;
const spawnInterval = 2000; // Spawn a new enemy every 2 seconds
let lastSpawnTime = 0;

function drawSamurai() {
  ctx.fillStyle = samurai.color;
  ctx.fillRect(samurai.x, samurai.y, samurai.width, samurai.height);
}

function drawEnemies() {
  enemies.forEach((enemy, index) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.x -= enemySpeed;

    // Remove enemies that go off the canvas
    if (enemy.x + enemy.width < 0) {
      enemies.splice(index, 1);
    }
  });
}

function handleAttack() {
  if (samurai.isAttacking) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(samurai.x + samurai.width, samurai.y, 20, samurai.height);

    // Check for collisions with enemies
    enemies.forEach((enemy, index) => {
      if (
        samurai.x + samurai.width + 20 > enemy.x &&
        samurai.y < enemy.y + enemy.height &&
        samurai.y + samurai.height > enemy.y
      ) {
        enemies.splice(index, 1); // Remove the enemy
      }
    });
  }
}

function spawnEnemy(timestamp) {
  if (timestamp - lastSpawnTime > spawnInterval) {
    enemies.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - 50),
      width: 50,
      height: 50
    });
    lastSpawnTime = timestamp;
  }
}

function update(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSamurai();
  drawEnemies();
  handleAttack();
  spawnEnemy(timestamp);

  requestAnimationFrame(update);
}

function moveSamurai(direction) {
  if (direction === 'up' && samurai.y > 0) samurai.y -= samurai.speed;
  if (direction === 'down' && samurai.y < canvas.height - samurai.height) samurai.y += samurai.speed;
  if (direction === 'left' && samurai.x > 0) samurai.x -= samurai.speed;
  if (direction === 'right' && samurai.x < canvas.width - samurai.width) samurai.x += samurai.speed;
}

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'W') moveSamurai('up');
  if (e.key === 'S') moveSamurai('down');
  if (e.key === 'A') moveSamurai('left');
  if (e.key === 'D') moveSamurai('right');
  if (e.key === ' ') samurai.isAttacking = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === ' ') samurai.isAttacking = false;
});

// Start the game
requestAnimationFrame(update);
