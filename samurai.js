document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        alert("Error: Canvas element not found!");
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        alert("Error: Unable to get 2D context!");
        return;
    }

    // Resize canvas to fit the screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let gameRunning = true;
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse movement
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });

    function endGame(reason) {
        gameRunning = false;
        alert(`Game Over! ${reason}`);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(`Game Over! ${reason}`, canvas.width / 2, canvas.height / 2);
    }

    // Load images
    const playerImage = new Image();
    playerImage.src = 'player.png';
    const swordImage = new Image();
    swordImage.src = 'sword.png';
    const enemyImage = new Image();
    enemyImage.src = 'enemy.png';
    const enemySwordImage = new Image();
    enemySwordImage.src = 'enemy_sword.png';

    class Player {
        constructor() {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.width = 50;
            this.height = 50;
            this.speed = 5;
            this.health = 100;
            this.isAttacking = false;
            this.isParrying = false;
            this.isDodging = false;
            this.stunTimer = 0;
            this.actionTimer = 0;
        }

        draw() {
            // Draw player image
            ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);

            // Draw health bar
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, (this.health / 100) * this.width, 5);

            // Draw sword
            this.drawSword();
        }

        drawSword() {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            // Calculate angle to cursor
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const angle = Math.atan2(dy, dx);

            // Sword properties
            const swordLength = 100;

            // Draw sword
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(swordImage, 0, -10, swordLength, 20);
            ctx.restore();
        }

        update(keys) {
            if (this.stunTimer > 0) {
                this.stunTimer -= 1;
                return; // Skip movement when stunned
            }

            if (this.actionTimer > 0) {
                this.actionTimer -= 1;
                if (this.actionTimer === 0) {
                    this.isAttacking = false;
                    this.isParrying = false;
                    this.isDodging = false;
                }
            }

            if (keys['w']) this.y -= this.speed;
            if (keys['s']) this.y += this.speed;
            if (keys['a']) this.x -= this.speed;
            if (keys['d']) this.x += this.speed;

            // Keep player within bounds
            this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));

            // Check if player health is 0
            if (this.health <= 0) {
                endGame("You lost all your health!");
            }
        }

        attack(enemies) {
            if (this.stunTimer > 0 || this.isDodging) return;

            this.isAttacking = true;
            this.actionTimer = 30;

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
                        console.log('Enemy defeated!');
                    }
                }
            });
        }

        parry() {
            if (this.stunTimer > 0 || this.isDodging) return;

            this.isParrying = true;
            this.actionTimer = 30; // Parry duration
        }

        dodge() {
            if (this.stunTimer > 0) return;

            this.isDodging = true;
            this.actionTimer = 30; // Dodge duration
            this.speed = 10;
        }

        stun() {
            this.stunTimer = 60; // Stunned for 1 second
            console.log('Player stunned!');
        }
    }

    class Enemy {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 40;
            this.height = 40;
            this.speed = 2;
            this.health = 50;
            this.isDodging = false;
            this.isParrying = false;
            this.isAttacking = false;
            this.stunTimer = 0;
            this.actionTimer = 0;
            this.strafeDirection = Math.random() < 0.5 ? -1 : 1; // Random initial strafe direction
        }

        draw(player) {
            // Draw enemy image
            ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);

            // Draw health bar
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, (this.health / 50) * this.width, 5);

            // Draw sword facing the player
            this.drawSword(player);
        }

        drawSword(player) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            // Calculate angle to the player
            const dx = player.x + player.width / 2 - centerX;
            const dy = player.y + player.height / 2 - centerY;
            const angle = Math.atan2(dy, dx);

            // Sword properties
            const swordLength = 80;

            // Draw sword
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(enemySwordImage, 0, -10, swordLength, 20);
            ctx.restore();
        }

        update(player) {
            if (this.stunTimer > 0) {
                this.stunTimer -= 1;
                return;
            }

            if (this.actionTimer > 0) {
                this.actionTimer -= 1;
                if (this.actionTimer === 0) {
                    this.isAttacking = false;
                    this.isParrying = false;
                    this.isDodging = false;
                }
            }

            if (this.isDodging) return;

            this.moveTowardsPlayer(player);
            this.strafe();
        }

        moveTowardsPlayer(player) {
            if (this.x < player.x) this.x += this.speed;
            if (this.x > player.x) this.x -= this.speed;
            if (this.y < player.y) this.y += this.speed;
            if (this.y > player.y) this.y -= this.speed;
        }

        strafe() {
            this.x += this.strafeDirection * 1; // Strafe speed
            if (Math.random() < 0.01) this.strafeDirection *= -1; // Randomly change direction
        }

        attack(player) {
            if (this.stunTimer > 0 || this.isDodging) return;

            this.isAttacking = true;
            this.actionTimer = 30;

            if (
                this.x < player.x + player.width &&
                this.x + this.width > player.x &&
                this.y < player.y + player.height &&
                this.y + this.height > player.y
            ) {
                if (player.isParrying) {
                    this.stun();
                    console.log('Enemy stunned by player parry!');
                } else if (!player.isDodging) {
                    player.health -= 10;
                    console.log('Player hit! Health:', player.health);
                }
            }
        }

        parry(player) {
            this.isParrying = true;
            this.actionTimer = 30; // Parry duration

            if (player.isAttacking) {
                player.stun();
                console.log('Player stunned by enemy parry!');
            }
        }

        dodge() {
            this.isDodging = true;
            this.actionTimer = 30; // Dodge duration
        }

        stun() {
            this.stunTimer = 60; // Stunned for 1 second
        }
    }

    const player = new Player();
    const enemies = [new Enemy(100, 100)];
    const keys = {};

    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (gameRunning) {
            if (e.key === 'j') player.attack(enemies);
            if (e.key === 'k') player.parry();
            if (e.key === 'l') player.dodge();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    function gameLoop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        player.update(keys);
        player.draw();

        enemies.forEach((enemy) => {
            enemy.update(player);
            enemy.draw(player);
        });

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
