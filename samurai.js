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

  updateSamuraiMovement(); // Continuously update movement
  drawSamurai();
  drawEnemies();
  handleAttack();
  spawnEnemy(timestamp);

  requestAnimationFrame(update);
}

function updateSamuraiMovement() {
  if (keys['w'] && samurai.y > 0) samurai.y = Math.max(0, samurai.y - samurai.speed); // Move up
  if (keys['s'] && samurai.y < canvas.height - samurai.height)
    samurai.y = Math.min(canvas.height - samurai.height, samurai.y + samurai.speed); // Move down
  if (keys['a'] && samurai.x > 0) samurai.x = Math.max(0, samurai.x - samurai.speed); // Move left
  if (keys['d'] && samurai.x < canvas.width - samurai.width)
    samurai.x = Math.min(canvas.width - samurai.width, samurai.x + samurai.speed); // Move right
}

// Event listeners for key press and release
document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true; // Track pressed keys
  if (e.key === ' ') samurai.isAttacking = true; // Spacebar for attack
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false; // Release keys
  if (e.key === ' ') samurai.isAttacking = false; // Stop attack
});

// Start the game
requestAnimationFrame(update);
