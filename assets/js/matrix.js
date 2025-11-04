document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('Matrix');
    if (!canvas) return;
    
    const context = canvas.getContext('2d');

    // Function to handle canvas resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalculate columns when canvas is resized
        columns = Math.floor(canvas.width/fontSize);
        // Reset raindrops arrays
        rainDrops.length = 0;
        speeds.length = 0;
        brightnesses.length = 0;
        for(let x = 0; x < columns; x++) {
            rainDrops[x] = Math.random() * canvas.height;
            speeds[x] = (Math.random() * 0.5 + 0.5) * baseSpeed;
            brightnesses[x] = Math.random();
        }
    }

    // Set up canvas properties
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    const fontSize = 14;
    const baseSpeed = 1.5;
    let columns = Math.floor(canvas.width/fontSize);
    const rainDrops = [];
    const speeds = [];
    const brightnesses = [];

    // Initialize arrays
    for(let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * canvas.height;
        speeds[x] = (Math.random() * 0.5 + 0.5) * baseSpeed;
        brightnesses[x] = Math.random();
    }

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Drawing function
    const draw = () => {
        // Create trailing effect
        context.fillStyle = 'rgba(0, 0, 0, 0.07)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw characters
        for(let i = 0; i < rainDrops.length; i++) {
            // Vary the brightness for each column
            const brightness = Math.floor(brightnesses[i] * 155 + 100); // Range 100-255
            context.fillStyle = `rgba(0, ${brightness}, 0, 0.9)`;
            context.font = `${fontSize}px monospace`;

            // Draw current character
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const x = i * fontSize;
            const y = rainDrops[i];
            context.fillText(text, x, y);

            // Draw trailing characters with decreasing opacity
            for(let j = 1; j <= 15; j++) {
                const trailY = y - (j * fontSize);
                if(trailY < 0) continue;
                const opacity = (15 - j) / 30;
                context.fillStyle = `rgba(0, ${brightness}, 0, ${opacity})`;
                const trailChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                context.fillText(trailChar, x, trailY);
            }

            // Update raindrop position
            rainDrops[i] += speeds[i];

            // Reset when reaching bottom
            if(rainDrops[i] * fontSize > canvas.height) {
                rainDrops[i] = 0;
                speeds[i] = (Math.random() * 0.5 + 0.5) * baseSpeed;
                brightnesses[i] = Math.random();
            }
        }
        
        requestAnimationFrame(draw);
    };

    // Start the animation
    draw();    
});