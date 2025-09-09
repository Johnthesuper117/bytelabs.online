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
const columns = Math.floor(canvas.width / fontSize);

// For each column, store an array of y positions for the trail and the head
const rainDrops = [];
const trailLength = 20; // How long the "fade" trail is

for (let x = 0; x < columns; x++) {
    // Each drop starts at a random y position
    rainDrops[x] = {
        y: Math.floor(Math.random() * canvas.height / fontSize),
        trail: []
    };
}

const draw = () => {
    // Fade canvas slightly
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        let drop = rainDrops[i];

        // Add previous head position to trail
        drop.trail.unshift(drop.y);

        // If trail is too long, remove oldest
        if (drop.trail.length > trailLength) drop.trail.pop();

        // Draw trail
        for (let t = 1; t < drop.trail.length; t++) {
            // Fade from bright green (head) to black (tail)
            // The closer to the head, the brighter
            // We'll interpolate the green channel: rgb(0, g, 0) where g goes from 255 (bright) to 0 (black)
            const brightness = Math.floor(255 * (1 - t / trailLength));
            context.fillStyle = `rgb(0,${brightness},0)`;
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            context.fillText(text, i * fontSize, drop.trail[t] * fontSize);
        }

        // Draw head (always white)
        context.fillStyle = 'rgb(255,255,255)';
        const headText = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(headText, i * fontSize, drop.y * fontSize);

        // Move the drop down
        drop.y++;

        // Reset drop to top with a random chance
        if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
            drop.y = 0;
            drop.trail = [];
        }
    }
};

setInterval(draw, 30);
