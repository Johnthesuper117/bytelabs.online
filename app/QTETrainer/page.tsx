'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface QTEPrompt {
  button: string;
  id: number;
  startTime: number;
  windowSize: number;
}

interface QTEResult {
  button: string;
  hit: boolean;
  timingAccuracy: number;
  timestamp: number;
}

const BUTTON_LABELS = ['Q', 'W', 'E', 'R'];

export default function QTETrainer() {
  const [gameActive, setGameActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<QTEPrompt | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [results, setResults] = useState<QTEResult[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    hits: 0,
    accuracy: 0,
    avgTiming: 0,
    streak: 0,
    maxStreak: 0,
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [buttonsToShow, setButtonsToShow] = useState<string[]>(['Q', 'W', 'E', 'R']);
  const [buttonInput, setButtonInput] = useState<string>('Q W E R');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [animationTime, setAnimationTime] = useState(0);

  const sessionStartRef = useRef<number | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const promptIdRef = useRef(0);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);
  const gameActiveRef = useRef(false);
  const currentPromptRef = useRef<QTEPrompt | null>(null);

  const getDifficultySettings = (diff: typeof difficulty) => {
    switch (diff) {
      case 'easy':
        return { windowSize: 1000, minDelay: 1500, maxDelay: 2500 };
      case 'medium':
        return { windowSize: 600, minDelay: 800, maxDelay: 1500 };
      case 'hard':
        return { windowSize: 400, minDelay: 500, maxDelay: 1000 };
    }
  };

  const generatePrompt = useCallback(() => {
    if (!gameActiveRef.current || buttonsToShow.length === 0) return;

    const randomButton = buttonsToShow[Math.floor(Math.random() * buttonsToShow.length)];
    const settings = getDifficultySettings(difficulty);

    const newPrompt: QTEPrompt = {
      button: randomButton,
      id: promptIdRef.current,
      startTime: Date.now(),
      windowSize: settings.windowSize,
    };

    setCurrentPrompt(newPrompt);
    currentPromptRef.current = newPrompt;
    promptIdRef.current += 1;

    promptTimerRef.current = setTimeout(() => {
      if (!gameActiveRef.current) return;
      setCurrentPrompt(null);
      setFeedback({ text: 'MISSED!', color: '#FF3131' });
      streakRef.current = 0;
      const delay = Math.random() * (settings.maxDelay - settings.minDelay) + settings.minDelay;
      setTimeout(() => generatePrompt(), delay);
    }, settings.windowSize);
  }, [buttonsToShow, difficulty]);

  const handleButtonClick = useCallback((button: string) => {
    if (!gameActiveRef.current || !currentPromptRef.current) return;

    const elapsed = Date.now() - currentPromptRef.current.startTime;
    const halfWindow = currentPromptRef.current.windowSize / 2;
    const hit = button === currentPromptRef.current.button && elapsed <= currentPromptRef.current.windowSize;

    let timingAccuracy = 0;
    if (hit) {
      timingAccuracy = Math.max(0, 1 - Math.abs(elapsed - halfWindow) / halfWindow);
    }

    const result: QTEResult = {
      button: currentPromptRef.current.button,
      hit,
      timingAccuracy,
      timestamp: Date.now(),
    };

    setResults((prev) => {
      const newResults = [result, ...prev];
      const hits = newResults.filter((r) => r.hit).length;
      const avgTiming = newResults.reduce((sum, r) => sum + r.timingAccuracy, 0) / newResults.length;

      if (hit) {
        streakRef.current += 1;
        if (streakRef.current > maxStreakRef.current) {
          maxStreakRef.current = streakRef.current;
        }
      } else {
        streakRef.current = 0;
      }

      setStats({
        total: newResults.length,
        hits,
        accuracy: hits / newResults.length,
        avgTiming,
        streak: streakRef.current,
        maxStreak: maxStreakRef.current,
      });

      return newResults;
    });

    setFeedback({
      text: hit ? `PERFECT! +${Math.round(timingAccuracy * 100)}` : `MISS! Wrong button`,
      color: hit ? '#00FF41' : '#FF3131',
    });

    setCurrentPrompt(null);
    if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
    const settings = getDifficultySettings(difficulty);
    const delay = Math.random() * (settings.maxDelay - settings.minDelay) + settings.minDelay;
    promptTimerRef.current = setTimeout(() => generatePrompt(), delay);
  }, [difficulty]);

  const startGame = () => {
    gameActiveRef.current = true;
    setGameActive(true);
    setTimeLeft(selectedDuration);
    setResults([]);
    setStats({ total: 0, hits: 0, accuracy: 0, avgTiming: 0, streak: 0, maxStreak: 0 });
    streakRef.current = 0;
    maxStreakRef.current = 0;
    sessionStartRef.current = Date.now();
    promptIdRef.current = 0;
  };

  const resetGame = () => {
    gameActiveRef.current = false;
    currentPromptRef.current = null;
    setGameActive(false);
    setCurrentPrompt(null);
    setResults([]);
    setStats({ total: 0, hits: 0, accuracy: 0, avgTiming: 0, streak: 0, maxStreak: 0 });
    setTimeLeft(selectedDuration);
    streakRef.current = 0;
    maxStreakRef.current = 0;
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const updateButtons = (input: string) => {
    const buttons = input
      .toUpperCase()
      .split(/[\s,]+/)
      .filter((b) => b.length === 1 && /^[A-Z]$/.test(b));
    setButtonInput(input);
    if (buttons.length > 0) {
      setButtonsToShow(buttons);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (gameActiveRef.current && buttonsToShow.includes(key)) {
        e.preventDefault();
        handleButtonClick(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [buttonsToShow, handleButtonClick]);

  // Sync gameActiveRef and currentPromptRef with state
  useEffect(() => {
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  useEffect(() => {
    currentPromptRef.current = currentPrompt;
  }, [currentPrompt]);

  // Auto-clear feedback after 500ms
  useEffect(() => {
    if (!feedback) return;
    
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [feedback]);

  // Animation loop for smooth circle shrinking
  useEffect(() => {
    if (!gameActive || !currentPrompt) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setAnimationTime(0);
      return;
    }

    const animate = () => {
      setAnimationTime(Date.now() - currentPrompt.startTime);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameActive, currentPrompt]);

  useEffect(() => {
    if (!gameActive) {
      currentPromptRef.current = null;
      return;
    }

    // Generate first prompt
    generatePrompt();

    // Start game timer
    let elapsed = 0;
    gameTimerRef.current = setInterval(() => {
      elapsed += 1;
      const remaining = Math.max(0, selectedDuration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        gameActiveRef.current = false;
        setGameActive(false);
        setCurrentPrompt(null);
        currentPromptRef.current = null;
        setFeedback(null);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      }
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameActive, selectedDuration, generatePrompt]);

  // Animation timing calculations
  // Shrinking circle shrinks continuously from start to ~0 over the windowSize
  // Inner circle (perfect zone): 30px - tight timing window
  // Outer circle (okay zone): 60px - wider timing window
  const perfectRadius = 30;
  const okayRadius = 60;
  
  // Start radius calibrated so outer circle is reached around 300ms mark
  // For 600ms window: 120 * (1 - 300/600) = 120 * 0.5 = 60px at 300ms
  const startRadius = 120;
  
  const ringOpacity = currentPrompt
    ? Math.max(0, 1 - (animationTime / currentPrompt.windowSize) * 0.95)
    : 0;

  // Shrinking circle shrinks proportionally based on animation progress
  const shrinkingRadius = currentPrompt
    ? Math.max(0, startRadius * (1 - animationTime / currentPrompt.windowSize))
    : startRadius;

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      color: '#00FF41',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 700,
        color: '#00FF41',
        marginBottom: '20px',
        borderBottom: '2px solid #00FF41',
        paddingBottom: '10px',
        textShadow: '0 0 10px #00FF41',
        letterSpacing: '1px',
      }}>
        &gt; QTE TRAINER
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Main Game Area - Compact */}
        <div 
          onClick={() => {
            if (!gameActive) {
              startGame();
            }
          }}
          style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '30px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: !gameActive ? 'pointer' : 'default',
        }}>
          {/* Outer Circle - Okay Zone (300-600ms window) */}
          {currentPrompt && (
            <div
              style={{
                position: 'absolute',
                width: okayRadius * 2,
                height: okayRadius * 2,
                border: '2px solid rgba(0, 255, 65, 0.3)',
                borderRadius: '50%',
                opacity: 0.5,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Inner Circle - Perfect Zone (250-300ms window) */}
          {currentPrompt && (
            <div
              style={{
                position: 'absolute',
                width: perfectRadius * 2,
                height: perfectRadius * 2,
                border: '2px solid rgba(0, 255, 65, 0.7)',
                borderRadius: '50%',
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Shrinking Ring - Real-time Indicator */}
          {currentPrompt && (
            <div
              style={{
                position: 'absolute',
                width: shrinkingRadius * 2,
                height: shrinkingRadius * 2,
                border: `3px solid #00FF41`,
                borderRadius: '50%',
                opacity: Math.max(0, ringOpacity),
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.9)',
                animation: 'none',
                transition: 'none',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Prompt Display */}
          {currentPrompt ? (
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                fontSize: '80px',
                fontWeight: 700,
                color: '#FFD300',
                textShadow: '0 0 40px #FFD300',
                animation: 'pulse-scale 0.3s ease-out',
                pointerEvents: 'none',
              }}
            >
              {currentPrompt.button}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', marginBottom: '15px', color: '#FFD300', textShadow: '0 0 10px #FFD300' }}>
                {gameActive ? 'WAITING FOR PROMPT...' : 'Click to Start'}
              </p>
              {feedback?.text && (
                <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: feedback.color }}>{feedback.text}</p>
              )}
              {!gameActive && (
                <p style={{ fontSize: '12px', opacity: 0.6 }}>Press any enabled key to play</p>
              )}
            </div>
          )}


          <style jsx>{`
            @keyframes pulse-scale {
              0% {
                transform: scale(0.8);
                opacity: 0;
              }
              50% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(1);
              }
            }
          `}</style>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Timer */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '15px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '11px', marginBottom: '8px', opacity: 0.7 }}>TIME</p>
            <p style={{
              fontSize: '40px',
              fontWeight: 700,
              color: timeLeft <= 5 ? '#FF3131' : '#FFD300',
              textShadow: timeLeft <= 5 ? '0 0 20px #FF3131' : '0 0 20px #FFD300',
            }}>
              {timeLeft}
            </p>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '15px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
          }}>
            <h3 style={{ fontSize: '12px', marginBottom: '10px', color: '#FFD300' }}>&gt; STATS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ opacity: 0.7 }}>Hits:</p>
                <p style={{ fontWeight: 700, color: '#00FF41' }}>{stats.hits}/{stats.total}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ opacity: 0.7 }}>Accuracy:</p>
                <p style={{ fontWeight: 700, color: '#FFD300' }}>
                  {stats.total > 0 ? (stats.accuracy * 100).toFixed(0) : '0'}%
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0, 255, 65, 0.2)', paddingTop: '8px', marginTop: '8px' }}>
                <p style={{ opacity: 0.7 }}>Streak:</p>
                <p style={{ fontWeight: 700 }}>{stats.streak}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ opacity: 0.7 }}>Best:</p>
                <p style={{ fontWeight: 700, color: '#00FF41' }}>{stats.maxStreak}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        {/* Difficulty */}
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '15px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '13px',
            marginBottom: '10px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '8px',
          }}>
            &gt; DIFFICULTY
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  if (!gameActive) setDifficulty(diff as typeof difficulty);
                }}
                disabled={gameActive}
                style={{
                  padding: '8px',
                  background: difficulty === diff ? '#00FF41' : 'transparent',
                  border: '1px solid #00FF41',
                  color: difficulty === diff ? '#000' : '#00FF41',
                  cursor: gameActive ? 'not-allowed' : 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  transition: 'all 0.3s',
                  opacity: gameActive ? 0.5 : 1,
                  textTransform: 'uppercase',
                  fontSize: '11px',
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '15px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '13px',
            marginBottom: '10px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '8px',
          }}>
            &gt; DURATION
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[15, 30, 60].map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  if (!gameActive) {
                    setSelectedDuration(dur);
                    setTimeLeft(dur);
                  }
                }}
                disabled={gameActive}
                style={{
                  padding: '8px',
                  background: selectedDuration === dur ? '#00FF41' : 'transparent',
                  border: '1px solid #00FF41',
                  color: selectedDuration === dur ? '#000' : '#00FF41',
                  cursor: gameActive ? 'not-allowed' : 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  transition: 'all 0.3s',
                  opacity: gameActive ? 0.5 : 1,
                  fontSize: '11px',
                }}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Buttons */}
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '15px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '13px',
            marginBottom: '10px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '8px',
          }}>
            &gt; BUTTONS
          </h3>
          <input
            type="text"
            disabled={gameActive}
            placeholder="Q W E R"
            value={buttonInput}
            onChange={(e) => updateButtons(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid #00FF41',
              color: '#00FF41',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              boxSizing: 'border-box',
              opacity: gameActive ? 0.5 : 1,
              cursor: gameActive ? 'not-allowed' : 'text',
            }}
          />
          <p style={{ fontSize: '10px', opacity: 0.6, marginTop: '8px' }}>
            Active: {buttonsToShow.join(', ')}
          </p>
        </div>
      </div>



      {/* Reset Button */}
      {!gameActive && results.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={resetGame}
            style={{
              width: '100%',
              padding: '12px',
              background: '#00FF41',
              border: '2px solid #00FF41',
              color: '#000',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '14px',
              transition: 'all 0.3s',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            &gt; PLAY AGAIN
          </button>
        </div>
      )}
      {!gameActive && results.length > 0 && (
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '15px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '13px',
            marginBottom: '12px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '8px',
          }}>
            &gt; SESSION RESULTS
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px' }}>Total Prompts</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#FFD300' }}>{stats.total}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px' }}>Successful Hits</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#00FF41' }}>{stats.hits}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px' }}>Accuracy</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#FFD300' }}>
                {(stats.accuracy * 100).toFixed(0)}%
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px' }}>Best Streak</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#00FF41' }}>{stats.maxStreak}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
