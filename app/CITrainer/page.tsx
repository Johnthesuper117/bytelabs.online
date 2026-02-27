'use client';

import { useEffect, useRef, useState } from 'react';
import './CITrainer.css';

interface Keybind {
  up: string;
  down: string;
  left: string;
  right: string;
  light_punch: string;
  medium_punch: string;
  heavy_punch: string;
  light_kick: string;
  medium_kick: string;
  heavy_kick: string;
  special: string;
}

interface InputAction {
  type: 'direction' | 'button';
  name: string;
}

interface Command {
  name: string;
  sequence: InputAction[];
  timing: number; // milliseconds
}

const DEFAULT_COMMANDS: Command[] = [
  { name: 'Forward Quarter Circle', sequence: [{ type: 'direction', name: 'down' }, { type: 'direction', name: 'down-right' }, { type: 'direction', name: 'right' }], timing: 500 },
  { name: 'Backward Quarter Circle', sequence: [{ type: 'direction', name: 'down' }, { type: 'direction', name: 'down-left' }, { type: 'direction', name: 'left' }], timing: 500 },
  { name: 'Forward Half Circle', sequence: [{ type: 'direction', name: 'right' }, { type: 'direction', name: 'down-right' }, { type: 'direction', name: 'down' }, { type: 'direction', name: 'down-left' }, { type: 'direction', name: 'left' }], timing: 800 },
  { name: 'Backward Half Circle', sequence: [{ type: 'direction', name: 'left' }, { type: 'direction', name: 'down-left' }, { type: 'direction', name: 'down' }, { type: 'direction', name: 'down-right' }, { type: 'direction', name: 'right' }], timing: 800 },
  { name: 'Shoryuken', sequence: [{ type: 'direction', name: 'right' }, { type: 'direction', name: 'down' }, { type: 'direction', name: 'down-right' }, { type: 'button', name: 'light_punch' }], timing: 400 },
  { name: 'Double Tap Forward', sequence: [{ type: 'direction', name: 'right' }, { type: 'direction', name: 'right' }], timing: 300 },
];

const DEFAULT_KEYBINDS: Keybind = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  light_punch: 'q',
  medium_punch: 'e',
  heavy_punch: 'r',
  light_kick: 'u',
  medium_kick: 'i',
  heavy_kick: 'o',
  special: 'p',
};

export default function CITrainer() {
  const [activeCommand, setActiveCommand] = useState<Command>(DEFAULT_COMMANDS[0]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [lastInputTime, setLastInputTime] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'timing' | null>(null);
  const [keybinds, setKeybinds] = useState<Keybind>(DEFAULT_KEYBINDS);
  const [showKeybindMenu, setShowKeybindMenu] = useState(false);
  const [editingKey, setEditingKey] = useState<keyof Keybind | null>(null);
  const [customCommand, setCustomCommand] = useState('');
  const [customSequence, setCustomSequence] = useState<InputAction[]>([]);
  const [commands, setCommands] = useState<Command[]>(DEFAULT_COMMANDS);
  const sequenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDirectionRef = useRef<string | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  const directionMap: Record<string, string[]> = {
    'up': ['up'],
    'down': ['down'],
    'left': ['left'],
    'right': ['right'],
    'down-right': ['down', 'right'],
    'down-left': ['down', 'left'],
    'up-right': ['up', 'right'],
    'up-left': ['up', 'left'],
  };

  const getDirectionFromKeys = (keysPressed: Set<string>): string | null => {
    const dirKeys = ['up', 'down', 'left', 'right'];
    const activeKeys = dirKeys.filter(key => keysPressed.has(keybinds[key as keyof Keybind]));

    if (activeKeys.length === 0) return null;
    if (activeKeys.length === 1) return activeKeys[0];

    const hasVertical = 'up' in Object.fromEntries(activeKeys.map(k => [k, true])) || 'down' in Object.fromEntries(activeKeys.map(k => [k, true]));
    const hasHorizontal = 'left' in Object.fromEntries(activeKeys.map(k => [k, true])) || 'right' in Object.fromEntries(activeKeys.map(k => [k, true]));

    if (activeKeys.includes('down') && activeKeys.includes('right')) return 'down-right';
    if (activeKeys.includes('down') && activeKeys.includes('left')) return 'down-left';
    if (activeKeys.includes('up') && activeKeys.includes('right')) return 'up-right';
    if (activeKeys.includes('up') && activeKeys.includes('left')) return 'up-left';

    return activeKeys[0];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (keysPressed.current.has(key)) return; // Ignore repeated key events
      keysPressed.current.add(key);

      // Check if editing keybind
      if (editingKey) {
        const validKeys = Object.values(keybinds);
        if (!validKeys.includes(key)) {
          setKeybinds(prev => ({ ...prev, [editingKey]: key }));
          setEditingKey(null);
        }
        return;
      }

      // Check for button presses (attack buttons)
      const attackButtons: (keyof Keybind)[] = ['light_punch', 'medium_punch', 'heavy_punch', 'light_kick', 'medium_kick', 'heavy_kick', 'special'];
      for (const buttonAction of attackButtons) {
        if (keybinds[buttonAction] === key) {
          const expectedInput = activeCommand.sequence[currentSequenceIndex];
          
          if (expectedInput && expectedInput.type === 'button' && expectedInput.name === buttonAction) {
            const now = Date.now();
            const timeSinceLastInput = lastInputTime ? now - lastInputTime : 0;

            if (currentSequenceIndex > 0 && timeSinceLastInput > activeCommand.timing) {
              setFeedback('Timing expired! Sequence reset.');
              setFeedbackType('error');
              setCurrentSequenceIndex(0);
              setLastInputTime(0);
              return;
            }

            if (currentSequenceIndex === activeCommand.sequence.length - 1) {
              setFeedback(`✓ Success! Command: ${activeCommand.name}`);
              setFeedbackType('success');
              setCurrentSequenceIndex(0);
              setLastInputTime(0);
              if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
            } else {
              const nextInput = activeCommand.sequence[currentSequenceIndex + 1];
              setFeedback(`Next: ${nextInput.name}`);
              setFeedbackType('timing');
              setCurrentSequenceIndex(prev => prev + 1);
              setLastInputTime(now);
            }
          }
          return;
        }
      }

      // Check for direction changes
      const currentDirection = getDirectionFromKeys(keysPressed.current);
      if (currentDirection && currentDirection !== previousDirectionRef.current) {
        previousDirectionRef.current = currentDirection;

        const expectedInput = activeCommand.sequence[currentSequenceIndex];
        if (expectedInput && expectedInput.type === 'direction' && expectedInput.name === currentDirection) {
          const now = Date.now();
          const timeSinceLastInput = lastInputTime ? now - lastInputTime : 0;

          if (currentSequenceIndex > 0 && timeSinceLastInput > activeCommand.timing) {
            setFeedback('Timing expired! Sequence reset.');
            setFeedbackType('error');
            setCurrentSequenceIndex(0);
            setLastInputTime(0);
            previousDirectionRef.current = null;
            return;
          }

          if (currentSequenceIndex === activeCommand.sequence.length - 1) {
            setFeedback(`✓ Success! Command: ${activeCommand.name}`);
            setFeedbackType('success');
            setCurrentSequenceIndex(0);
            setLastInputTime(0);
            previousDirectionRef.current = null;
            if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
          } else {
            const nextInput = activeCommand.sequence[currentSequenceIndex + 1];
            setFeedback(`Next: ${nextInput.name}`);
            setFeedbackType('timing');
            setCurrentSequenceIndex(prev => prev + 1);
            setLastInputTime(now);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      
      // Check for direction changes when keys are released
      const currentDirection = getDirectionFromKeys(keysPressed.current);
      // Reset when no direction is pressed (allows pressing same direction again)
      if (!currentDirection) {
        previousDirectionRef.current = null;
        return;
      }
      
      if (currentDirection !== previousDirectionRef.current) {
        previousDirectionRef.current = currentDirection;

        const expectedInput = activeCommand.sequence[currentSequenceIndex];
        if (expectedInput && expectedInput.type === 'direction' && expectedInput.name === currentDirection) {
          const now = Date.now();
          const timeSinceLastInput = lastInputTime ? now - lastInputTime : 0;

          if (currentSequenceIndex > 0 && timeSinceLastInput > activeCommand.timing) {
            setFeedback('Timing expired! Sequence reset.');
            setFeedbackType('error');
            setCurrentSequenceIndex(0);
            setLastInputTime(0);
            previousDirectionRef.current = null;
            return;
          }

          if (currentSequenceIndex === activeCommand.sequence.length - 1) {
            setFeedback(`✓ Success! Command: ${activeCommand.name}`);
            setFeedbackType('success');
            setCurrentSequenceIndex(0);
            setLastInputTime(0);
            previousDirectionRef.current = null;
            if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
          } else {
            const nextInput = activeCommand.sequence[currentSequenceIndex + 1];
            setFeedback(`Next: ${nextInput.name}`);
            setFeedbackType('timing');
            setCurrentSequenceIndex(prev => prev + 1);
            setLastInputTime(now);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeCommand, currentSequenceIndex, lastInputTime, keybinds, editingKey]);

  // Reset sequence if timing expires
  useEffect(() => {
    if (currentSequenceIndex > 0 && lastInputTime) {
      sequenceTimeoutRef.current = setTimeout(() => {
        setFeedback('Timing expired! Sequence reset.');
        setFeedbackType('error');
        setCurrentSequenceIndex(0);
        setLastInputTime(0);
      }, activeCommand.timing);

      return () => {
        if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
      };
    }
  }, [currentSequenceIndex, lastInputTime, activeCommand.timing]);

  // Reset direction tracker when command changes
  useEffect(() => {
    previousDirectionRef.current = null;
  }, [activeCommand]);
  const handleAddCustomCommand = () => {
    if (customCommand && customSequence.length > 0) {
      const newCommand: Command = {
        name: customCommand,
        sequence: customSequence,
        timing: 500,
      };
      setCommands(prev => [...prev, newCommand]);
      setActiveCommand(newCommand);
      setCustomCommand('');
      setCustomSequence([]);
      setCurrentSequenceIndex(0);
      setLastInputTime(0);
      previousDirectionRef.current = null;
      setFeedback('Custom command added!');
      setFeedbackType('success');
    }
  };

  const addToSequence = (action: InputAction) => {
    setCustomSequence(prev => [...prev, action]);
  };

  const removeFromSequence = () => {
    setCustomSequence(prev => prev.slice(0, -1));
  };

  return (
    <div className="ci-container">
      <h1 className="section-title">&gt; COMMAND INPUT TRAINER</h1>

      <div className="ci-main-wrapper">
        {/* Command selector */}
        <div className="ci-panel ci-commands-panel">
          <h2 className="ci-panel-title">&gt; SELECT COMMAND</h2>
          <div className="ci-command-list">
            {commands.map((cmd, idx) => (
              <button
                key={idx}
                className={`ci-command-btn ${activeCommand.name === cmd.name ? 'active' : ''}`}
                onClick={() => {
                  setActiveCommand(cmd);
                  setCurrentSequenceIndex(0);
                  setLastInputTime(0);
                  setFeedback('');
                  setFeedbackType(null);
                }}
              >
                {cmd.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main trainer display */}
        <div className="ci-panel ci-trainer-panel">
          <h2 className="ci-panel-title">&gt; ACTIVE COMMAND</h2>
          
          <div className="ci-command-display">
            <p className="ci-command-name">{activeCommand.name}</p>
            <div className="ci-sequence-display">
              {activeCommand.sequence.map((step, idx) => (
                <div
                  key={idx}
                  className={`ci-step ${idx < currentSequenceIndex ? 'completed' : idx === currentSequenceIndex ? 'current' : 'upcoming'}`}
                >
                  {step.name.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>

          <div className={`ci-feedback ci-feedback-${feedbackType}`}>
            {feedback || 'Ready to input...'}
          </div>

          <div className="ci-timing-bar">
            <div
              className="ci-timing-fill"
              style={{
                width: lastInputTime ? `${Math.min(100, ((Date.now() - lastInputTime) / activeCommand.timing) * 100)}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Keybinds and settings */}
        <div className="ci-panel ci-settings-panel">
          <button
            className="ci-toggle-btn"
            onClick={() => setShowKeybindMenu(!showKeybindMenu)}
          >
            {showKeybindMenu ? '▼ Configure Keybinds' : '▶ Configure Keybinds'}
          </button>

          {showKeybindMenu && (
            <div className="ci-keybind-grid">
              {Object.entries(keybinds).map(([action, key]) => (
                <div key={action} className="ci-keybind-row">
                  <span className="ci-action-label">{action.replace(/_/g, ' ')}:</span>
                  <button
                    className={`ci-key-btn ${editingKey === action ? 'editing' : ''}`}
                    onClick={() => setEditingKey(editingKey === action ? null : (action as keyof Keybind))}
                  >
                    {editingKey === action ? 'Press any key...' : key.toUpperCase()}
                  </button>
                </div>
              ))}
              <button
                className="ci-reset-btn"
                onClick={() => {
                  setKeybinds(DEFAULT_KEYBINDS);
                  setEditingKey(null);
                }}
              >
                Reset to Default
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom command builder */}
      <div className="ci-panel ci-custom-panel">
        <h2 className="ci-panel-title">&gt; CREATE CUSTOM COMMAND</h2>
        <div className="ci-custom-builder">
          <input
            type="text"
            placeholder="Enter command name..."
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            className="ci-input"
          />
          
          <div className="ci-builder-section">
            <h3 className="ci-builder-label">Directions:</h3>
            <div className="ci-direction-buttons">
              {['up', 'down', 'left', 'right', 'down-right', 'down-left', 'up-right', 'up-left'].map((dir) => (
                <button
                  key={dir}
                  className="ci-direction-btn"
                  onClick={() => addToSequence({ type: 'direction', name: dir })}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div className="ci-builder-section">
            <h3 className="ci-builder-label">Attack Buttons:</h3>
            <div className="ci-attack-buttons">
              {['light_punch', 'medium_punch', 'heavy_punch', 'light_kick', 'medium_kick', 'heavy_kick'].map((btn) => (
                <button
                  key={btn}
                  className="ci-attack-btn"
                  onClick={() => addToSequence({ type: 'button', name: btn })}
                >
                  {btn.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="ci-custom-sequence">
            <p>Sequence:</p>
            <div className="ci-custom-steps">
              {customSequence.map((step, idx) => (
                <span key={idx} className="ci-custom-step">{step.name.replace(/_/g, ' ')}</span>
              ))}
            </div>
            <button className="ci-remove-btn" onClick={removeFromSequence}>
              Remove Last
            </button>
            <button className="ci-add-cmd-btn" onClick={handleAddCustomCommand}>
              Add Command
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ci-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          color: #00FF41;
          font-family: 'JetBrains Mono', monospace;
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: #00FF41;
          margin-bottom: 30px;
          border-bottom: 2px solid #00FF41;
          padding-bottom: 15px;
          text-shadow: 0 0 10px #00FF41;
          letter-spacing: 1px;
        }

        .ci-main-wrapper {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .ci-panel {
          background: rgba(0, 20, 0, 0.6);
          border: 2px solid #00FF41;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
        }

        .ci-panel-title {
          font-size: 16px;
          margin-bottom: 15px;
          color: #FFD300;
          text-shadow: 0 0 10px #FFD300;
          border-bottom: 1px solid #00FF41;
          padding-bottom: 10px;
        }

        .ci-command-btn {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          background: transparent;
          border: 1px solid #00FF41;
          color: #00FF41;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
        }

        .ci-command-btn:hover {
          background: rgba(0, 255, 65, 0.1);
          text-shadow: 0 0 10px #00FF41;
        }

        .ci-command-btn.active {
          background: #00FF41;
          color: #000000;
          font-weight: 700;
        }

        .ci-command-display {
          background: rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .ci-command-name {
          font-size: 18px;
          font-weight: 700;
          color: #FFD300;
          margin-bottom: 15px;
          text-shadow: 0 0 10px #FFD300;
        }

        .ci-sequence-display {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .ci-step {
          padding: 10px 15px;
          border: 2px solid #00FF41;
          border-radius: 4px;
          font-weight: 700;
          transition: all 0.3s;
        }

        .ci-step.completed {
          background: rgba(0, 255, 65, 0.5);
          color: #000;
        }

        .ci-step.current {
          background: #FFD300;
          color: #000;
          text-shadow: 0 0 10px #FFD300;
          box-shadow: 0 0 20px #FFD300;
        }

        .ci-step.upcoming {
          color: #00FF41;
        }

        .ci-feedback {
          padding: 15px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 15px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ci-feedback-success {
          background: rgba(0, 255, 65, 0.2);
          color: #00FF41;
          text-shadow: 0 0 10px #00FF41;
          border: 2px solid #00FF41;
        }

        .ci-feedback-error {
          background: rgba(255, 49, 49, 0.2);
          color: #FF3131;
          text-shadow: 0 0 10px #FF3131;
          border: 2px solid #FF3131;
        }

        .ci-feedback-timing {
          background: rgba(255, 211, 0, 0.2);
          color: #FFD300;
          text-shadow: 0 0 10px #FFD300;
          border: 2px solid #FFD300;
        }

        .ci-timing-bar {
          width: 100%;
          height: 20px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #00FF41;
          border-radius: 4px;
          overflow: hidden;
        }

        .ci-timing-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD300, #FF3131);
          transition: width 0.1s linear;
        }

        .ci-toggle-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid #00FF41;
          color: #00FF41;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s;
          font-weight: 700;
        }

        .ci-toggle-btn:hover {
          background: rgba(0, 255, 65, 0.1);
          text-shadow: 0 0 10px #00FF41;
        }

        .ci-keybind-grid {
          margin-top: 15px;
          display: grid;
          gap: 10px;
        }

        .ci-keybind-row {
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 12px;
        }

        .ci-action-label {
          flex: 1;
          text-transform: uppercase;
        }

        .ci-key-btn {
          flex: 0.5;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid #00FF41;
          color: #00FF41;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s;
        }

        .ci-key-btn:hover,
        .ci-key-btn.editing {
          background: #FFD300;
          color: #000;
          font-weight: 700;
        }

        .ci-reset-btn {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background: transparent;
          border: 1px solid #FF3131;
          color: #FF3131;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s;
        }

        .ci-reset-btn:hover {
          background: rgba(255, 49, 49, 0.1);
        }

        .ci-custom-panel {
          margin-top: 30px;
        }

        .ci-custom-builder {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .ci-builder-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ci-builder-label {
          font-size: 14px;
          color: #FFD300;
          margin: 0;
          text-shadow: 0 0 10px #FFD300;
        }

        .ci-input {
          padding: 12px;
          background: transparent;
          border: 1px solid #00FF41;
          color: #00FF41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
        }

        .ci-input::placeholder {
          color: rgba(0, 255, 65, 0.5);
        }

        .ci-direction-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .ci-direction-btn {
          padding: 10px;
          background: transparent;
          border: 1px solid #00FF41;
          color: #00FF41;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          transition: all 0.3s;
        }

        .ci-direction-btn:hover {
          background: rgba(0, 255, 65, 0.1);
          text-shadow: 0 0 10px #00FF41;
        }

        .ci-attack-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .ci-attack-btn {
          padding: 10px;
          background: transparent;
          border: 1px solid #FF6B6B;
          color: #FF6B6B;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          transition: all 0.3s;
        }

        .ci-attack-btn:hover {
          background: rgba(255, 107, 107, 0.1);
          text-shadow: 0 0 10px #FF6B6B;
        }

        .ci-custom-sequence {
          padding: 15px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #00FF41;
          border-radius: 4px;
        }

        .ci-custom-steps {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 10px 0;
          min-height: 40px;
          align-items: center;
        }

        .ci-custom-step {
          padding: 8px 12px;
          background: #FFD300;
          color: #000;
          border-radius: 4px;
          font-weight: 700;
        }

        .ci-remove-btn,
        .ci-add-cmd-btn {
          padding: 10px;
          background: transparent;
          border: 1px solid #00FF41;
          color: #00FF41;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s;
          margin-top: 10px;
        }

        .ci-remove-btn:hover {
          background: rgba(255, 49, 49, 0.1);
          border-color: #FF3131;
          color: #FF3131;
        }

        .ci-add-cmd-btn:hover {
          background: rgba(0, 255, 65, 0.1);
          text-shadow: 0 0 10px #00FF41;
        }

        @media (max-width: 1200px) {
          .ci-main-wrapper {
            grid-template-columns: 1fr;
          }

          .ci-direction-buttons {
            grid-template-columns: repeat(3, 1fr);
          }

          .ci-attack-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
