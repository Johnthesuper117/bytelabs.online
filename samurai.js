alert("Canvas element found");
const canvas = document.getElementById('gameCanvas');
alert("Canvas context retrieved");
const ctx = canvas.getContext('2d');
alert("Script executed successfully");

// Resize canvas to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
alert("Window resized");

// Game running flag
let gameRunning = true;

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 50;
        this.height = 50;
        this.color = 'blue';
        this.speed = 5;
        this.isDodging = false;
        this.dodgeTimer = 0;
        this.health = 100;
        this.isAttacking = false;
        this.isParrying = false;
        this.isStunned = false;
        this.stunTimer = 0;
        this.actionTimer = 0;
    }

    draw() {
        alert(`Drawing player at (${this.x}, ${this.y})`);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, (this.health / 100) * this.width, 5);
    }

    update(keys) {
        if (this.isStunned) {
            this.stunTimer--;
            if (this.stunTimer <= 0) {
                this.isStunned = false;
                this.color = 'blue';
            }
            return; // Skip movement when stunned
        }

        if (this.actionTimer > 0) {
            this.actionTimer--;
            if (this.actionTimer === 0) {
                this.isAttacking = false;
                this.isParrying = false;
                this.color = 'blue';
            }
        }

        if (keys['w']) this.y -= this.speed;
        if (keys['s']) this.y += this.speed;
        if (keys['a']) this.x -= this.speed;
        if (keys['d']) this.x += this.speed;

        if (this.isDodging) {
            this.dodgeTimer -= 1;
            if (this.dodgeTimer <= 0) {
                this.isDodging = false;
                this.speed = 5;
                this.color = 'blue';
            }
        }

        // Keep player within bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.color = 'red';
        this.speed = 2;
    }

    draw() {
        alert(`Drawing enemy at (${this.x}, ${this.y})`);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(player) {
        // Move towards the player
        if (this.x < player.x) this.x += this.speed;
        if (this.x > player.x) this.x -= this.speed;
        if (this.y < player.y) this.y += this.speed;
        if (this.y > player.y) this.y -= this.speed;
    }
}

const player = new Player();
const enemies = [];
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function spawnEnemy() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(x, y));
}

function drawScore() {
    ctx.fillStyle = 'white'; // Use white for better visibility
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${enemies.length}`, 10, 20);
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    alert("Game loop running...");

    player.update(keys);
    player.draw();

    enemies.forEach((enemy) => {
        enemy.update(player);
        enemy.draw();
    });

    drawScore();
    requestAnimationFrame(gameLoop);
}

// Spawn enemies every second
setInterval(() => {
    if (gameRunning) spawnEnemy();
}, 1000);

// Start the game loop
gameLoop();
alert("After Loop?");
