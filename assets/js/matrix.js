// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('Matrix');
    if (!canvas) return; // Exit if canvas is not found
    
    const context = canvas.getContext('2d');

    // Function to handle canvas resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalculate columns when canvas is resized
        columns = Math.floor(canvas.width/fontSize);
        // Reset raindrops array
        rainDrops.length = 0;
        for(let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }
    }

    // Set up canvas properties
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    const fontSize = 16;
    let columns = Math.floor(canvas.width/fontSize);
    const rainDrops = [];

    // Initialize raindrops
    for(let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let animationId;

    // Drawing function
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
        
        requestAnimationFrame(draw);
    };

    // Start the animation when the window loads
    window.addEventListener('load', draw);
});

