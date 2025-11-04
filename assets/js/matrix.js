const canvas = document.getElementById('Matrix');
const context = canvas.getContext('2d');

// Create a wrapper div for the canvas that will handle the fade effect
const canvasWrapper = document.createElement('div');
canvasWrapper.style.position = 'fixed';
canvasWrapper.style.top = '0';
canvasWrapper.style.left = '0';
canvasWrapper.style.width = '100%';
canvasWrapper.style.height = '100%';
canvasWrapper.style.zIndex = '9999';
canvasWrapper.style.backgroundColor = 'black';
canvasWrapper.style.transition = 'opacity 1s ease-out';
canvas.parentNode.insertBefore(canvasWrapper, canvas);
canvasWrapper.appendChild(canvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;
const fontSize = 16;
const columns = canvas.width/fontSize;
const rainDrops = [];

for( let x = 0; x < columns; x++ ) {
    rainDrops[x] = 1;
}

let animationId;
let opacity = 1;

const draw = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#0F0';
    context.font = fontSize + 'px monospace';
    
    for(let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(text, i*fontSize, rainDrops[i]*fontSize);
        if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
    
    animationId = requestAnimationFrame(draw);
};

// Start the animation
draw();

// After 3 seconds, start fading out
setTimeout(() => {
    canvasWrapper.style.opacity = '0';
    // After the fade completes, remove the canvas and stop the animation
    setTimeout(() => {
        canvasWrapper.remove();
        cancelAnimationFrame(animationId);
    }, 1000);
}, 3000);

