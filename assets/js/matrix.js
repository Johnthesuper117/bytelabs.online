document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('Matrix');
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    
    // Hide page content initially
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in';

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
    let startTime;
    const loadDuration = 3000; // 3 seconds loading animation
    
    const draw = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / loadDuration, 1);
        
        // Clear with darker fade for better character visibility
        context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Bright green matrix characters
        context.fillStyle = '#00FF00';
        context.font = fontSize + 'px monospace';
        
        // Calculate how many columns to show based on progress
        const activeColumns = Math.floor(columns * progress);
        
        for(let i = 0; i < activeColumns; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            context.fillText(text, i*fontSize, rainDrops[i]*fontSize);
            if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
        
        if (progress < 1) {
            animationId = requestAnimationFrame(draw);
        } else {
            // Fade in the page content
            document.body.style.opacity = '1';
            // Clean up the canvas
            setTimeout(() => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                canvas.remove(); // Remove canvas completely
            }, 1000);
        }
    };

    // Start the animation when everything is loaded
    window.addEventListener('load', () => {
        startTime = Date.now();
        draw();
    });    
});