const canvas = document.getElementById('Matrix');
const context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼ';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;
const fontSize = 16;
const columns = canvas.width / fontSize;

// Each raindrop now tracks its y position and its "age" (how many frames it's been visible)
const rainDrops = [];
for (let x = 0; x < columns; x++) {
    rainDrops[x] = {
        y: 1,
        age: 0 // age starts at 0; increases every frame
    };
}

const draw = () => {
    // Fade canvas very slightly
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = fontSize + 'px monospace';
    for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

        // Calculate color based on age: start white, get darker (towards black), but stay same hue (white to gray to black)
        // We'll use HSL for this: white = hsl(120, 100%, 100%), green = hsl(120, 100%, <lightness>)
        // But you want "stay the same color" -- so for white to green-black, use rgb(0,255,0) for green, but fade from white to green-black

        // Instead, let's just fade from white to black using grayscale:
        // So: color = `rgb(${light},${light},${light})`, where light goes from 255 down to 0 as age increases

        // If you want to keep the "green" hue, then fade from white to green-black:
        // So start: rgb(255,255,255), then fade towards rgb(0,255,0)

        // Let's interpolate from white (255,255,255) to green (0,255,0):
        // We'll use age to interpolate. Max age is, say, 30 frames (or until it resets)
        const maxAge = 30;
        const ratio = Math.min(drop.age / maxAge, 1);

        // interpolate from white to green
        const r = Math.round(255 * (1 - ratio));
        const g = 255;
        const b = Math.round(255 * (1 - ratio));

        context.fillStyle = `rgb(${r},${g},${b})`;

        context.fillText(text, i * fontSize, drop.y * fontSize);

        if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
            drop.y = 0;
            drop.age = 0;
        }
        drop.y++;
        drop.age++;
    }
};

setInterval(draw, 30);
