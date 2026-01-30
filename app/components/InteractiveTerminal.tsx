{/*}

'use client';

import { useState, useEffect } from 'react';

interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

export default function InteractiveTerminal() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [terminalActive, setTerminalActive] = useState(true);

  const availableCommands = {
    help: {
      description: 'Show available commands',
      output: [
        'Available commands:',
        '  help - Show this help message',
        '  clear - Clear the terminal',
        '  rickroll - Experience the classic',
        '  matrix - Start matrix rain',
        '  soundboard - Open soundboard',
        '  games - List available games',
        '  about - Show about information',
        '  credits - Show credits'
      ]
    },
    clear: {
      description: 'Clear the terminal screen',
      output: ['Clearing screen...']
    },
    rickroll: {
      description: 'Never gonna give you up',
      output: [
        'Never gonna give you up!',
        'Never gonna let you down!',
        'Never gonna run around and desert you!',
        'Redirecting to rickroll...'
      ]
    },
    matrix: {
      description: 'Start matrix rain effect',
      output: ['Initializing matrix rain...']
    },
    soundboard: {
      description: 'Open soundboard',
      output: ['Opening soundboard...']
    },
    games: {
      description: 'List available games',
      output: [
        'Available games:',
        '  No games currently available',
        '  Check back later for updates!'
      ]
    },
    about: {
      description: 'Show about information',
      output: [
        'ByteLabs Online Terminal',
        'Version: 1.0.0',
        'Built with Next.js and TypeScript',
        'Retro terminal theme with modern features',
        'Created by Johnthesuper117'
      ]
    },
    credits: {
      description: 'Show credits',
      output: [
        'Development: Johnthesuper117',
        'Design: Retro terminal aesthetic',
        'Sounds: Various sources',
        'Fonts: VT323',
        'Special thanks to the open source community'
      ]
    }
  };

  const executeCommand = (command: string) => {
    const timestamp = new Date();
    const cleanCommand = command.trim().toLowerCase();

    if (cleanCommand === '') return;

    const commandParts = cleanCommand.split(' ');
    const mainCommand = commandParts[0];

    let output: string[] = [];
    let shouldRedirect = false;
    let redirectUrl = '';

    if (availableCommands[mainCommand]) {
      output = availableCommands[mainCommand].output;
      
      if (mainCommand === 'rickroll') {
        shouldRedirect = true;
        redirectUrl = '/rick/roll';
      } else if (mainCommand === 'matrix') {
        shouldRedirect = true;
        redirectUrl = '/matrix';
      } else if (mainCommand === 'soundboard') {
        shouldRedirect = true;
        redirectUrl = '/soundboard';
      }
    } else {
      output = [`${mainCommand}: command not found`];
    }

    setCommands(prev => [...prev, { input: command, output, timestamp }]);
    
    if (shouldRedirect) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }

    setCurrentInput('');
  };

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 200);
  };

  useEffect(() => {
    const terminal = document.getElementById('terminal-container');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="terminal-container" id="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="btn close"></div>
          <div className="btn minimize"></div>
          <div className="btn maximize"></div>
        </div>
        <div className="terminal-title">ByteLabs Terminal v1.0.0</div>
      </div>
      
      <div className="terminal-body">
        <div className="terminal-output">
          {commands.length === 0 && (
            <div className="terminal-line">
              <span className="prompt">guest@bytelabs:~$</span>
              <span className="text">Type 'help' to get started</span>
            </div>
          )}
          
          {commands.map((command, index) => (
            <div key={index}>
              <div className="terminal-line">
                <span className="prompt">guest@bytelabs:~$</span>
                <span className="text">{command.input}</span>
              </div>
              {command.output.map((line, outputIndex) => (
                <div key={outputIndex} className="terminal-line output">
                  <span className="output-text">{line}</span>
                </div>
              ))}
            </div>
          ))}
          
          <div className="terminal-line">
            <span className="prompt">guest@bytelabs:~$</span>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleInput}
              onKeyPress={handleTyping}
              className="terminal-input"
              placeholder="Type a command..."
              autoFocus
            />
            {isTyping && <span className="cursor typing">█</span>}
          </div>
        </div>
      </div>
      
      <div className="terminal-footer">
        <button 
          onClick={() => setTerminalActive(false)}
          className="terminal-close-btn"
        >
          Close Terminal
        </button>
      </div>
    </div>
  );
}

*/}