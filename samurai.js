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
        this.isAttacking = false;
        this.isParrying = false;
        this.actionTimer = 0;
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

    attack(enemies) {
        this.isAttacking = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'royalblue';

        enemies.forEach((enemy, index) => {
            if (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            ) {
                if (enemy.isParrying) {
                    console.log('Enemy parried the attack!');
                } else if (enemy.isDodging) {
                    console.log('Enemy dodged the attack!');
                } else {
                    enemies.splice(index, 1);
                    console.log('Enemy defeated!');
                }
            }
        });
    }

    parry() {
        this.isParrying = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'indigo';
    }

    dodge() {
        this.isDodging = true;
        this.dodgeTimer = 30; // 0.5 seconds at 60 FPS
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
        this.isAttacking = false;
        this.isParrying = false;
        this.actionTimer = 0;
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
        if (this.actionTimer > 0) {
            this.actionTimer--;
            if (this.actionTimer === 0) {
                this.isAttacking = false;
                this.isParrying = false;
                this.isDodging = false;
                this.color = 'red';
            }
        }

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
        this.isAttacking = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'darkred';

        if (!player.isDodging && !player.isParrying) {
            player.health -= 10; // Player loses health if not dodging or parrying
            console.log('Player hit! Health:', player.health);
        }
    }

    dodge() {
        this.isDodging = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'yellow';
        this.speed = 5;
    }

    parry() {
        this.isParrying = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
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
        player.attack(enemies);
    }
    if (e.key === 'f') {
        player.parry();
    }
    if (e.key === 'q' && !player.isDodging) {
        player.dodge();
    }
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function spawnEnemy() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(x, y));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(keys);
    player.draw();

    enemies.forEach((enemy) => {
        enemy.update(player);
        enemy.draw();
    });

    requestAnimationFrame(gameLoop);
}

// Spawn enemies every second
setInterval(spawnEnemy, 1000);

// Start the game loop
gameLoop();
