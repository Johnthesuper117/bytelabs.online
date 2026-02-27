'use client';

import { useEffect, useRef, useState } from 'react';

interface SessionStats {
  totalClicks: number;
  cps: number;
  duration: number;
  avgCps: number;
  maxCpsPoint: number;
}

export default function CPSTracker() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [history, setHistory] = useState<SessionStats[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [inCooldown, setInCooldown] = useState(false);
  const clickCountRef = useRef(0);
  const sessionStartRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxCpsRef = useRef(0);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = () => {
    setSessionActive(true);
    setTimeLeft(selectedDuration);
    setClicks(0);
    clickCountRef.current = 0;
    sessionStartRef.current = Date.now();
    maxCpsRef.current = 0;
    setInCooldown(false);
  };

  const getRatingMessage = (cps: number): string => {
    if (cps <= 2) return "I know you can do better";
    if (cps <= 9) return "Alright, pretty good";
    if (cps <= 13) return "Impressive, now go get a job";
    if (cps <= 29) return "We know you're better so just chill already";
    return "You can't trick me you Autoclicking Bot";
  };

  const handleClick = () => {
    if (!sessionActive && !inCooldown) {
      // Start session on first click
      startSession();
    }

    if (sessionActive) {
      clickCountRef.current += 1;
      setClicks(clickCountRef.current);

      if (sessionStartRef.current) {
        const elapsed = (Date.now() - sessionStartRef.current) / 1000;
        const currentCps = clickCountRef.current / elapsed;
        if (currentCps > maxCpsRef.current) {
          maxCpsRef.current = currentCps;
        }
      }
    }
  };

  useEffect(() => {
    if (!sessionActive) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSessionActive(false);
          setInCooldown(true);
          
          if (sessionStartRef.current) {
            const finalStats: SessionStats = {
              totalClicks: clickCountRef.current,
              cps: clickCountRef.current / selectedDuration,
              duration: selectedDuration,
              avgCps: clickCountRef.current / selectedDuration,
              maxCpsPoint: maxCpsRef.current,
            };
            setStats(finalStats);
            setHistory((prev) => [finalStats, ...prev]);
            setTotalClicks((prev) => prev + clickCountRef.current);
            
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
          }
          
          // Start cooldown
          if (cooldownTimeoutRef.current) {
            clearTimeout(cooldownTimeoutRef.current);
          }
          cooldownTimeoutRef.current = setTimeout(() => {
            setInCooldown(false);
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sessionActive, selectedDuration]);

  const resetSession = () => {
    setSessionActive(false);
    setTimeLeft(selectedDuration);
    setClicks(0);
    clickCountRef.current = 0;
    sessionStartRef.current = null;
    setStats(null);
    maxCpsRef.current = 0;
    setInCooldown(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    // Start cooldown
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    cooldownTimeoutRef.current = setTimeout(() => {
      setInCooldown(false);
    }, 1000);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#00FF41', fontFamily: "'JetBrains Mono', monospace" }}>
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
        &gt; CLICKS PER SECOND TRACKER
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Duration Selector */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
          }}>
            <h2 style={{
              fontSize: '16px',
              marginBottom: '15px',
              color: '#FFD300',
              textShadow: '0 0 10px #FFD300',
              borderBottom: '1px solid #00FF41',
              paddingBottom: '10px',
            }}>
              &gt; SESSION DURATION
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[1, 5, 10, 15, 30, 60].map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    if (!sessionActive) {
                      setSelectedDuration(duration);
                      setTimeLeft(duration);
                    }
                  }}
                  style={{
                    padding: '12px',
                    background: selectedDuration === duration && !sessionActive ? '#00FF41' : 'transparent',
                    border: '1px solid #00FF41',
                    color: selectedDuration === duration && !sessionActive ? '#000' : '#00FF41',
                    cursor: sessionActive ? 'not-allowed' : 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: selectedDuration === duration && !sessionActive ? 700 : 400,
                    transition: 'all 0.3s',
                    opacity: sessionActive ? 0.5 : 1,
                  }}
                  disabled={sessionActive}
                >
                  {duration}s
                </button>
              ))}
            </div>
          </div>

          {/* Stats Display */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '16px',
              marginBottom: '15px',
              color: '#FFD300',
              textShadow: '0 0 10px #FFD300',
              borderBottom: '1px solid #00FF41',
              paddingBottom: '10px',
            }}>
              &gt; LIVE STATS
            </h2>
            <div style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#FFD300',
              textShadow: '0 0 20px #FFD300',
              marginBottom: '20px',
            }}>
              {clicks}
            </div>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>Total Clicks</p>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#00FF41', marginBottom: '20px' }}>
              {sessionActive && sessionStartRef.current 
                ? ((clicks / ((Date.now() - sessionStartRef.current) / 1000)).toFixed(2))
                : '0.00'} CPS
            </div>
            <p style={{ fontSize: '14px' }}>Current Speed</p>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Timer */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '40px 20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '72px',
              fontWeight: 700,
              color: timeLeft <= 3 ? '#FF3131' : '#FFD300',
              textShadow: timeLeft <= 3 ? '0 0 20px #FF3131' : '0 0 20px #FFD300',
              marginBottom: '20px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {timeLeft}
            </div>
            <p style={{ fontSize: '14px', marginBottom: '30px' }}>Seconds Remaining</p>
            <div style={{
              height: '8px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid #00FF41',
            }}>
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${timeLeft > 5 ? '#00FF41' : '#FFD300'}, ${timeLeft <= 3 ? '#FF3131' : '#FFD300'})`,
                  width: `${((selectedDuration - timeLeft) / selectedDuration) * 100}%`,
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {sessionActive && (
              <button
                onClick={resetSession}
                style={{
                  padding: '15px',
                  background: 'transparent',
                  border: '2px solid #FF3131',
                  color: '#FF3131',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '16px',
                }}
              >
                STOP SESSION
              </button>
            )}
            {stats && (
              <button
                onClick={resetSession}
                style={{
                  padding: '15px',
                  background: '#00FF41',
                  color: '#000',
                  border: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '16px',
                }}
              >
                START NEW SESSION
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Click Button */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button
          onClick={handleClick}
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            border: '4px solid #00FF41',
            background: sessionActive ? 'rgba(0, 255, 65, 0.1)' : 'rgba(0, 255, 65, 0.03)',
            color: '#00FF41',
            fontSize: '24px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.1s',
            boxShadow: sessionActive ? '0 0 40px rgba(0, 255, 65, 0.3)' : '0 0 20px rgba(0, 255, 65, 0.1)',
            opacity: 1,
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 255, 65, 0.3)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = sessionActive ? 'rgba(0, 255, 65, 0.1)' : 'rgba(0, 255, 65, 0.03)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {sessionActive ? (
            'CLICK ME!'
          ) : stats ? (
            'START NEW'
          ) : (
            <>
              <div>CLICK TO START</div>
              <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '10px' }}>({selectedDuration}s session)</div>
            </>
          )}
        </button>
      </div>

      {/* Stats Display */}
      {!sessionActive && stats && (
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '20px',
          borderRadius: '4px',
          marginBottom: '30px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>Total Clicks</p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#FFD300', textShadow: '0 0 10px #FFD300' }}>
                {stats.totalClicks}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>CPS</p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#FFD300', textShadow: '0 0 10px #FFD300' }}>
                {stats.avgCps.toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>Peak CPS</p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#FFD300', textShadow: '0 0 10px #FFD300' }}>
                {stats.maxCpsPoint.toFixed(2)}
              </p>
            </div>
          </div>
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 211, 0, 0.1)',
            border: '1px solid #FFD300',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
          }}>
            {getRatingMessage(stats.avgCps)}
          </div>
        </div>
      )}

      {/* Cooldown Message */}
      {inCooldown && !sessionActive && !stats && (
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '15px',
          background: 'rgba(255, 49, 49, 0.1)',
          border: '1px solid #FF3131',
          borderRadius: '4px',
          color: '#FF3131',
          fontSize: '14px',
        }}>
          Please wait 1 second before starting a new session...
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '20px' }}>
            <h2 style={{
              fontSize: '16px',
              color: '#FFD300',
              textShadow: '0 0 10px #FFD300',
              borderBottom: '1px solid #00FF41',
              paddingBottom: '10px',
              flex: 1,
            }}>
              &gt; SESSION HISTORY
            </h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Total Clicks: <span style={{ color: '#FFD300', fontWeight: 700 }}>{totalClicks}</span></p>
              <button
                onClick={resetHistory}
                style={{
                  padding: '8px 15px',
                  background: 'transparent',
                  border: '1px solid #FF3131',
                  color: '#FF3131',
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  transition: 'all 0.3s',
                }}
              >
                CLEAR
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #00FF41' }}>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#FFD300' }}>Duration</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#FFD300' }}>Clicks</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#FFD300' }}>AVG CPS</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#FFD300' }}>Peak CPS</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((session, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(0, 255, 65, 0.2)' }}>
                    <td style={{ padding: '10px' }}>{session.duration}s</td>
                    <td style={{ padding: '10px' }}>{session.totalClicks}</td>
                    <td style={{ padding: '10px', color: '#FFD300', fontWeight: 700 }}>{session.avgCps.toFixed(2)}</td>
                    <td style={{ padding: '10px', color: '#FFD300', fontWeight: 700 }}>{session.maxCpsPoint.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
