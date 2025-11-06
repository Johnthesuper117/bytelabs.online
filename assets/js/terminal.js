/* ===== GLOBAL VARIABLES ===== */
const terminal = document.getElementById('terminal');
let currentScreen = 'boot';
let selectedMenuIndex = 0;

/* ===== FULLSCREEN FUNCTIONALITY ===== */
const fsBtn = document.getElementById('fullscreenBtn');
if (fsBtn) {
    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}

/* ===== PREVENT ARROW KEY SCROLLING ===== */
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
}, false);

/* ===== UTILITY FUNCTIONS ===== */
function clearTerminal() {
    if (terminal) terminal.innerHTML = '';
}

function typeText(text, delay = 30) {
    return new Promise((resolve) => {
        let i = 0;
        const line = document.createElement('div');
        line.className = 'line';
        if (terminal) terminal.appendChild(line);
        
        const interval = setInterval(() => {
            if (i < text.length) {
                line.textContent += text[i];
                i++;
                if (terminal) terminal.scrollTop = terminal.scrollHeight;
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
    if (terminal) {
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }
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
    // show main menu after a short delay
    setTimeout(showMainMenu, 500);
}

/* ===== MAIN MENU ===== */
function showMainMenu() {
    currentScreen = 'menu';
    clearTerminal();
    
    const ascii = `\n╔═══════════════════════════════════════════╗\n║                 TERMINAL                  ║\n╚═══════════════════════════════════════════╝\n`;
    
    addLine(ascii);
    addLine('');
    
    startTerminal();
}

/* ===== TEXT INPUT ===== */
function startTerminal() {
    clearTerminal();

    // container for the output and input
    const container = document.createElement('div');
    container.className = 'text-input';

    const output = document.createElement('div');
    output.id = 'textOutput';
    output.style.minHeight = '200px';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Enter command...';
    input.id = 'textInput';

    // append output and input to container, then to terminal
    container.appendChild(output);
    container.appendChild(input);
    if (terminal) terminal.appendChild(container);

    function displayText(text) {
        const line = document.createElement('div');
        line.className = 'line';
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function processCommand(cmd) {
        cmd = (cmd || '').toLowerCase().trim();
        if (!cmd) return;
        displayText('> ' + cmd);

        if (cmd === '1') {
            displayText('You pressed 1.');
        } else if (cmd.startsWith('echo ')) {
            // echo rest of the string after the command
            const echo = cmd.slice(5);
            displayText(echo);
        } else if (cmd === 'help') {
            displayText('Available commands: HELP, ECHO <text>, 1');
        } else {
            displayText('Unknown command. Type HELP for commands.');
        }

        displayText('');
    }

    // Initial text
    displayText('Welcome. Type HELP for commands.');

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (input.value.trim()) {
                processCommand(input.value);
                input.value = '';
            }
        }
    });

    input.focus();
}

/* ===== START APPLICATION ===== */
window.addEventListener('load', () => {
    bootSequence();
});