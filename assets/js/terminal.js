/* ===== GLOBAL VARIABLES ===== */
const terminal = document.getElementById('terminal');
let currentScreen = 'boot';
let selectedMenuIndex = 0;

/* ===== FULLSCREEN FUNCTIONALITY ===== */
document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

/* ===== PREVENT ARROW KEY SCROLLING ===== */
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
}, false);

/* ===== UTILITY FUNCTIONS ===== */
function clearTerminal() {
    terminal.innerHTML = '';
}

function typeText(text, delay = 30) {
    return new Promise((resolve) => {
        let i = 0;
        const line = document.createElement('div');
        line.className = 'line';
        terminal.appendChild(line);
        
        const interval = setInterval(() => {
            if (i < text.length) {
                line.textContent += text[i];
                i++;
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}

function addLine(text) {
    const line = document.createElement('div');
    line.className = 'line';
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

/* ===== BOOT SEQUENCE ===== */
async function bootSequence() {
    clearTerminal();
    await typeText('RETRO TERMINAL v1.0', 50);
    await typeText('Copyright (c) 1985 RetroSoft Systems', 30);
    addLine('');
    await typeText('Initializing memory... OK', 20);
    await typeText('Loading game archive... OK', 20);
    await typeText('Calibrating CRT display... OK', 20);
    addLine('');
    await typeText('System ready.', 30);
    addLine('');
    setTimeout(showMainMenu, 500);
    showMainMenu();
}

/* ===== MAIN MENU ===== */
function showMainMenu() {
    currentScreen = 'menu';
    clearTerminal();
    
    const ascii = `
╔═══════════════════════════════════════════╗
║                 TERMINAL                  ║
╚═══════════════════════════════════════════╝
    `;
    
    addLine(ascii);
    addLine('');

    startTerminal();
}

/* ===== TEXT INPUT ===== */
function startTerminal() {
    clearTerminal();
    
    const container = document.createElement('div');
    container.className = 'text-input';
    
    const output = document.createElement('div');
    output.id = 'textOutput';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Enter command...';
    input.id = 'textInput';
    
    
    function displayText(text) {
        const line = document.createElement('div');
        line.className = 'line';
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }
    
    function processCommand(cmd) {
        cmd = cmd.toLowerCase().trim();
        displayText('> ' + cmd);
        displayText('');
        
        if (cmd === '1') {
            displayText('1');
            
        } else if (cmd.startsWith('echo ')) {
            const echo = cmd.split(' ')[1];
            displayText(echo);
        } else {
            displayText('Unknown command. Type HELP for commands.');
        }
        
        displayText('');
        
        }
    }
    
    // Initial text
    displayText('');
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            processCommand(input.value);
            input.value = '';
        }
    });
    
    input.focus();

/* ===== START APPLICATION ===== */
window.addEventListener('load', () => {
    bootSequence();
});