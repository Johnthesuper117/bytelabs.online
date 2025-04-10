const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

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
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, (this.health / 100) * this.width, 5);
    }

    update(keys) {
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

    dodge() {
        this.isDodging = true;
        this.dodgeTimer = 30; // Roughly 0.5 seconds at 60 FPS
        this.speed = 10;
        this.color = 'cyan';
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
        this.health = 50;
        this.attackCooldown = 0;
        this.isDodging = false;
        this.dodgeTimer = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, (this.health / 50) * this.width, 5);
    }

    update(player) {
        if (this.isDodging) {
            this.dodgeTimer -= 1;
            if (this.dodgeTimer <= 0) {
                this.isDodging = false;
                this.speed = 2;
                this.color = 'red';
            }
        } else {
            // Move towards the player
            if (this.x < player.x) this.x += this.speed;
            if (this.x > player.x) this.x -= this.speed;
            if (this.y < player.y) this.y += this.speed;
            if (this.y > player.y) this.y -= this.speed;

            // Attempt to attack if close to the player
            if (this.attackCooldown <= 0 && this.isInRange(player)) {
                this.attack(player);
                this.attackCooldown = 60; // Cooldown for 1 second
            } else {
                this.attackCooldown -= 1;
            }
        }
    }

    isInRange(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    attack(player) {
        if (!player.isDodging) {
            player.health -= 10; // Player loses health if not dodging
            console.log('Player hit! Health:', player.health);
        }
    }

    dodge() {
        this.isDodging = true;
        this.dodgeTimer = 30; // Roughly 0.5 seconds at 60 FPS
        this.speed = 5;
        this.color = 'orange';
    }
}

const player = new Player();
const enemies = [];
let score = 0;

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        attack();
    }
    if (e.key === 'q' && !player.isDodging) {
        player.dodge();
    }
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function attack() {
    enemies.forEach((enemy, index) => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            if (Math.random() < 0.5) {
                enemy.dodge(); // Enemy attempts to dodge
            } else {
                enemies.splice(index, 1);
                score += 10;
                console.log('Enemy defeated! Score:', score);
            }
        }
    });
}

function spawnEnemy() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(x, y));
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
setInterval(spawnEnemy, 1000);

// Start the game loop
gameLoop();
