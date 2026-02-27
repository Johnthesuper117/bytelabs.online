'use client';

import { useEffect, useRef, useState } from 'react';

interface ReactionResult {
  reactionTime: number;
  timestamp: Date;
}

export default function RTTrainer() {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'clicked'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [stimulus, setStimulus] = useState<'color' | 'sound'>('color');
  const [stimulusColor, setStimulusColor] = useState('#00FF41');
  const [history, setHistory] = useState<ReactionResult[]>([]);
  const [stats, setStats] = useState({ avg: 0, best: Infinity, worst: 0, count: 0 });
  const [waitTime, setWaitTime] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startTrial = () => {
    setState('waiting');
    setReactionTime(null);
    setWaitTime(0);

    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    timeoutRef.current = setTimeout(() => {
      startStimulusRef.current();
    }, delay);
  };

  const startStimulusRef = useRef(() => {
    setState('ready');
    startTimeRef.current = Date.now();
    
    if (stimulus === 'color') {
      const colors = ['#FF3131', '#00FF41', '#FFD300', '#00FFFF', '#FF00FF'];
      setStimulusColor(colors[Math.floor(Math.random() * colors.length)]);
    } else if (stimulus === 'sound') {
      playSound();
    }
  });

  const playSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 800;
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  const handleClick = () => {
    if (state === 'idle') {
      // Start trial on click when idle
      startTrial();
      return;
    }
    
    if (state === 'ready' && startTimeRef.current) {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setState('clicked');

      const result: ReactionResult = {
        reactionTime: time,
        timestamp: new Date(),
      };

      setHistory((prev) => {
        const newHistory = [result, ...prev];
        const all = newHistory.map((r) => r.reactionTime);
        const avg = all.reduce((a, b) => a + b, 0) / all.length;
        const best = Math.min(...all);
        const worst = Math.max(...all);

        setStats({ avg, best, worst, count: all.length });
        return newHistory;
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else if (state === 'waiting') {
      setReactionTime(-1); // False start
      setState('clicked');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else if (state === 'clicked') {
      // Start next trial on click when in clicked state
      startTrial();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const resetStats = () => {
    setHistory([]);
    setStats({ avg: 0, best: Infinity, worst: 0, count: 0 });
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      color: '#00FF41',
      fontFamily: "'JetBrains Mono', monospace",
      minHeight: '100vh',
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#00FF41',
        marginBottom: '30px',
        borderBottom: '2px solid #00FF41',
        paddingBottom: '15px',
        textShadow: '0 0 10px #00FF41',
        letterSpacing: '1px',
      }}>
        &gt; REACTION TIME TRAINER
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Main Trainer */}
        <div>
          {/* Stimulus Type Selector */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontSize: '16px',
              marginBottom: '15px',
              color: '#FFD300',
              textShadow: '0 0 10px #FFD300',
              borderBottom: '1px solid #00FF41',
              paddingBottom: '10px',
            }}>
              &gt; STIMULUS TYPE
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['color', 'sound'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setStimulus(type as 'color' | 'sound');
                    setState('idle');
                  }}
                  disabled={state !== 'idle'}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: stimulus === type ? '#00FF41' : 'transparent',
                    border: '1px solid #00FF41',
                    color: stimulus === type ? '#000' : '#00FF41',
                    cursor: state === 'idle' ? 'pointer' : 'not-allowed',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    opacity: state === 'idle' ? 1 : 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Main Display Area */}
          <div
            onClick={handleClick}
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              background: state === 'ready' ? stimulusColor : state === 'waiting' ? 'rgba(0, 30, 0, 0.8)' : 'rgba(0, 20, 0, 0.6)',
              border: '4px solid #00FF41',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.1s',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {state === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '20px', color: '#FFD300', textShadow: '0 0 10px #FFD300' }}>
                  Click to Start
                </p>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  Wait for the stimulus to appear
                </p>
              </div>
            )}

            {state === 'waiting' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '3px solid #00FF41',
                  borderRadius: '50%',
                  animation: 'spin 2s linear infinite',
                }}></div>
                <p style={{ fontSize: '18px', color: '#00FF41' }}>Waiting...</p>
              </div>
            )}

            {state === 'ready' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                animation: 'pulse 0.5s ease-in-out',
              }}>
                {stimulus === 'color' && (
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: stimulusColor,
                    boxShadow: `0 0 60px ${stimulusColor}`,
                    animation: 'pulse 0.5s ease-in-out',
                  }} />
                )}
                <p style={{
                  fontSize: '24px',
                  color: stimulusColor === '#000000' ? '#00FF41' : '#000000',
                  fontWeight: 700,
                  textShadow: stimulus === 'color' ? `0 0 20px ${stimulusColor}` : 'none',
                }}>
                  REACT NOW!
                </p>
              </div>
            )}

            {state === 'clicked' && reactionTime !== null && reactionTime !== null && reactionTime !== null && (
              <div style={{ textAlign: 'center' }}>
                {reactionTime === -1 ? (
                  <>
                    <p style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#FF3131',
                      textShadow: '0 0 20px #FF3131',
                      marginBottom: '20px',
                    }}>
                      ✗ FALSE START
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '20px' }}>You clicked too early!</p>
                    <p style={{ fontSize: '12px', opacity: 0.6 }}>Click again to retry</p>
                  </>
                ) : (
                  <>
                    <p style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#FFD300',
                      textShadow: '0 0 20px #FFD300',
                      marginBottom: '20px',
                    }}>
                      {reactionTime}ms
                    </p>
                    <p style={{
                      fontSize: '14px',
                      marginBottom: '20px',
                      opacity: 0.8,
                    }}>
                      {reactionTime !== null && (reactionTime < 150 ? 'Inhuman!' : reactionTime < 200 ? 'Excellent!' : reactionTime < 250 ? 'Great!' : reactionTime < 300 ? 'Good!' : 'Keep practicing!')}
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.6 }}>Click again for next trial</p>
                  </>
                )}
              </div>
            )}

            <style jsx>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
            `}</style>
          </div>
        </div>

        {/* Stats Panel */}
        <div>
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontSize: '16px',
              marginBottom: '15px',
              color: '#FFD300',
              textShadow: '0 0 10px #FFD300',
              borderBottom: '1px solid #00FF41',
              paddingBottom: '10px',
            }}>
              &gt; STATISTICS
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>AVERAGE</p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#FFD300',
                  textShadow: '0 0 10px #FFD300',
                }}>
                  {stats.avg > 0 ? Math.round(stats.avg) : '—'}ms
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>BEST</p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#00FF41',
                  textShadow: '0 0 10px #00FF41',
                }}>
                  {stats.best !== Infinity ? Math.round(stats.best) : '—'}ms
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>WORST</p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#FF3131',
                }}>
                  {stats.worst > 0 ? Math.round(stats.worst) : '—'}ms
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>TRIALS</p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#00FF41',
                }}>
                  {stats.count}
                </p>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div style={{
              background: 'rgba(0, 20, 0, 0.6)',
              border: '2px solid #00FF41',
              padding: '20px',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{
                  fontSize: '16px',
                  color: '#FFD300',
                  textShadow: '0 0 10px #FFD300',
                  borderBottom: '1px solid #00FF41',
                  paddingBottom: '10px',
                  flex: 1,
                }}>
                  &gt; HISTORY
                </h2>
                <button
                  onClick={resetStats}
                  style={{
                    padding: '6px 10px',
                    background: 'transparent',
                    border: '1px solid #FF3131',
                    color: '#FF3131',
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    transition: 'all 0.3s',
                  }}
                >
                  CLEAR
                </button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {history.slice(0, 20).map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(0, 255, 65, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                    }}
                  >
                    <span>#{history.length - idx}</span>
                    <span style={{
                      color: result.reactionTime < 200 ? '#00FF41' : result.reactionTime < 250 ? '#FFD300' : '#FF3131',
                      fontWeight: 700,
                    }}>
                      {Math.round(result.reactionTime)}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
