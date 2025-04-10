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

    attack(enemies) {
        if (this.isStunned) return; // Can't attack if stunned

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
                    this.stun();
                } else if (enemy.isDodging) {
                    console.log('Enemy dodged the attack!');
                } else {
                    enemies.splice(index, 1);
                    score += 10; // Add points for defeating an enemy
                    console.log('Enemy defeated! Score:', score);
                }
            }
        });
    }

    parry() {
        if (this.isStunned) return; // Can't parry if stunned

        this.isParrying = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'indigo';
    }

    dodge() {
        if (this.isStunned) return; // Can't dodge if stunned

        this.isDodging = true;
        this.dodgeTimer = 30; // 0.5 seconds at 60 FPS
        this.speed = 10;
        this.color = 'cyan';
    }

    stun() {
        this.isStunned = true;
        this.stunTimer = 60; // Stunned for 1 second
        this.color = 'cyan';
        console.log('Player stunned!');
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
        this.isStunned = false;
        this.stunTimer = 0;
        this.strafeDirection = Math.random() < 0.5 ? -1 : 1; // Randomize initial strafe direction
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
        if (this.isStunned) {
            this.stunTimer--;
            if (this.stunTimer <= 0) {
                this.isStunned = false;
                this.color = 'red';
            }
            return; // Skip updating while stunned
        }

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
            this.dodgeTimer--;
            if (this.dodgeTimer <= 0) {
                this.isDodging = false;
                this.speed = 2;
                this.color = 'red';
            }
        } else {
            this.moveTowardsPlayer(player);
            this.strafe(); // Add strafing movement
        }

        if (this.attackCooldown <= 0 && this.isInRange(player)) {
            if (Math.random() < 0.3) {
                this.parry(player); // 30% chance to parry
            } else {
                this.attack(player);
            }
            this.attackCooldown = 60; // Cooldown for 1 second
        } else {
            this.attackCooldown--;
        }
    }

    moveTowardsPlayer(player) {
        if (this.x < player.x) this.x += this.speed;
        if (this.x > player.x) this.x -= this.speed;
        if (this.y < player.y) this.y += this.speed;
        if (this.y > player.y) this.y -= this.speed;
    }

    strafe() {
        // Strafe movement (side-to-side)
        this.x += this.strafeDirection * 1; // Strafe speed
        if (Math.random() < 0.01) {
            // Randomly change strafe direction
            this.strafeDirection *= -1;
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

        if (!player.isDodging && player.isParrying) {
            this.stun(); // Enemy gets stunned if the player parries
        } else if (!player.isDodging && !player.isParrying) {
            player.health -= 10; // Player loses health if not dodging or parrying
            console.log('Player hit! Health:', player.health);
        }
    }

    parry(player) {
        this.isParrying = true;
        this.actionTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'orange';

        if (player.isAttacking) {
            player.stun(); // Player gets stunned if the enemy parries
            console.log('Player stunned by enemy parry!');
        }
    }

    dodge() {
        this.isDodging = true;
        this.dodgeTimer = 30; // 0.5 seconds at 60 FPS
        this.color = 'yellow';
        this.speed = 5;
    }

    stun() {
        this.isStunned = true;
        this.stunTimer = 60; // Stunned for 1 second
        this.color = 'orange';
        console.log('Enemy stunned!');
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

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function endGame() {
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over! Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
    if (!gameRunning) return;

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
setInterval(() => {
    if (gameRunning) spawnEnemy();
}, 1000);

// Start the game loop
gameLoop();
