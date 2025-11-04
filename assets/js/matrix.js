// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('Matrix');
    if (!canvas) return; // Exit if canvas is not found
    
    const context = canvas.getContext('2d');
    
    // Hide all content initially
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

    // Drawing function with building effect
    let startTime = Date.now();
    const animationDuration = 3000; // 3 seconds
    
    const draw = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Clear with fading alpha based on progress
        context.fillStyle = `rgba(0, 0, 0, ${0.05 + (0.95 * (1-progress))})`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#0F0';
        context.font = fontSize + 'px monospace';
        
        // Calculate how many columns should be active based on progress
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
            
            // Continue with a more subtle background effect
            const backgroundDraw = () => {
                context.fillStyle = 'rgba(0, 0, 0, 0.1)';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = 'rgba(0, 255, 0, 0.15)';
                context.font = fontSize + 'px monospace';
                
                for(let i = 0; i < rainDrops.length; i++) {
                    if (Math.random() > 0.98) {
                        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                        context.fillText(text, i*fontSize, rainDrops[i]*fontSize);
                    }
                    if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
                        rainDrops[i] = 0;
                    }
                    rainDrops[i]++;
                }
                
                animationId = requestAnimationFrame(backgroundDraw);
            };
            
            backgroundDraw();
        }
    };

    // Wait for all content to load before starting the animation
    window.addEventListener('load', () => {
        startTime = Date.now();
        draw();
    });
});

