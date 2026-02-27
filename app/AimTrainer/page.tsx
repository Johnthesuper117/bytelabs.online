'use client';

import { useEffect, useRef, useState } from 'react';

interface Target {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface ShotResult {
  hit: boolean;
  distance: number;
  time: number;
  accuracy: number;
}

export default function AimTrainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [shots, setShots] = useState<ShotResult[]>([]);
  const [stats, setStats] = useState({
    hits: 0,
    accuracy: 0,
    avgTime: 0,
    totalShots: 0,
    timeLeft: 60,
  });
  const [gameActive, setGameActive] = useState(false);
  const [targetIdRef, setTargetId] = useState(0);
  const sessionStartRef = useRef<number | null>(null);
  const targetGeneratedRef = useRef<number | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedDuration, setSelectedDuration] = useState(60);

  const getDifficultySettings = (diff: typeof difficulty) => {
    switch (diff) {
      case 'easy':
        return { minSize: 60, maxSize: 100, speedMult: 0.5 };
      case 'medium':
        return { minSize: 40, maxSize: 70, speedMult: 1 };
      case 'hard':
        return { minSize: 20, maxSize: 50, speedMult: 2 };
    }
  };

  const generateTarget = () => {
    if (!canvasRef.current) return;

    const settings = getDifficultySettings(difficulty);
    const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
    const x = Math.random() * (canvasRef.current.width - size);
    const y = Math.random() * (canvasRef.current.height - size);

    const newTarget: Target = {
      x,
      y,
      size,
      id: targetIdRef,
    };

    setTarget(newTarget);
    targetGeneratedRef.current = Date.now();
    setTargetId(targetIdRef + 1);
  };

  const startGame = () => {
    if (!canvasRef.current) return;

    setGameActive(true);
    setShots([]);
    setStats({
      hits: 0,
      accuracy: 0,
      avgTime: 0,
      totalShots: 0,
      timeLeft: selectedDuration,
    });
    sessionStartRef.current = Date.now();
    setTargetId(0);
    generateTarget();

    // Game timer
    let timeElapsed = 0;
    gameTimerRef.current = setInterval(() => {
      timeElapsed += 1;
      const timeLeft = Math.max(0, selectedDuration - timeElapsed);
      setStats((prev) => ({ ...prev, timeLeft }));

      if (timeLeft === 0) {
        setGameActive(false);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      }
    }, 1000);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    // Start game on first click if not active
    if (!gameActive) {
      startGame();
      return;
    }

    if (!target || !targetGeneratedRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetCenterX = target.x + target.size / 2;
    const targetCenterY = target.y + target.size / 2;

    const distance = Math.sqrt(
      Math.pow(clickX - targetCenterX, 2) + Math.pow(clickY - targetCenterY, 2)
    );

    const hit = distance <= target.size / 2;
    const timeElapsed = Date.now() - targetGeneratedRef.current;
    const accuracy = Math.max(0, 1 - (distance / (target.size / 2)) * 0.5);

    const result: ShotResult = {
      hit,
      distance,
      time: timeElapsed,
      accuracy,
    };

    setShots((prev) => {
      const newShots = [result, ...prev];
      const hits = newShots.filter((s) => s.hit).length;
      const avgTime =
        newShots.reduce((sum, s) => sum + s.time, 0) / newShots.length;
      const avgAccuracy =
        newShots.reduce((sum, s) => sum + s.accuracy, 0) / newShots.length;

      setStats((prev) => ({
        ...prev,
        hits,
        accuracy: avgAccuracy,
        avgTime,
        totalShots: newShots.length,
      }));

      return newShots;
    });

    generateTarget();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 20, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      if (!gameActive) {
        // Show start message
        ctx.fillStyle = '#FFD300';
        ctx.font = 'bold 32px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CLICK TO START', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = '#00FF41';
        ctx.font = '16px "JetBrains Mono", monospace';
        ctx.fillText('Select difficulty and duration above', canvas.width / 2, canvas.height / 2 + 20);
        return;
      }

      if (!target) return;

      // Draw target
      const targetCenterX = target.x + target.size / 2;
      const targetCenterY = target.y + target.size / 2;

      // Outer circle
      ctx.strokeStyle = '#FFD300';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, target.size / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Middle circle
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, target.size / 3, 0, Math.PI * 2);
      ctx.stroke();

      // Bull's eye
      ctx.fillStyle = '#FF3131';
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, target.size / 8, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair at center
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(targetCenterX - 10, targetCenterY);
      ctx.lineTo(targetCenterX + 10, targetCenterY);
      ctx.moveTo(targetCenterX, targetCenterY - 10);
      ctx.lineTo(targetCenterX, targetCenterY + 10);
      ctx.stroke();
    };

    draw();
    const animFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrame);
  }, [target, gameActive]);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      color: '#00FF41',
      fontFamily: "'JetBrains Mono', monospace",
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
        &gt; AIM TRAINER
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Game Area */}
        <div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            style={{
              display: 'block',
              background: 'rgba(0, 20, 0, 0.6)',
              border: '3px solid #00FF41',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
              cursor: gameActive ? 'crosshair' : 'default',
              width: '100%',
              maxWidth: '800px',
            }}
          />
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Timer */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', marginBottom: '10px', opacity: 0.7 }}>TIME REMAINING</p>
            <p style={{
              fontSize: '48px',
              fontWeight: 700,
              color: stats.timeLeft <= 10 ? '#FF3131' : '#FFD300',
              textShadow: stats.timeLeft <= 10 ? '0 0 20px #FF3131' : '0 0 20px #FFD300',
            }}>
              {stats.timeLeft}
            </p>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(0, 20, 0, 0.6)',
            border: '2px solid #00FF41',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#FFD300' }}>&gt; STATS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div>
                <p style={{ opacity: 0.7, marginBottom: '4px' }}>Shots Fired</p>
                <p style={{ fontSize: '20px', fontWeight: 700 }}>{stats.totalShots}</p>
              </div>
              <div>
                <p style={{ opacity: 0.7, marginBottom: '4px' }}>Hits</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#00FF41' }}>{stats.hits}</p>
              </div>
              <div>
                <p style={{ opacity: 0.7, marginBottom: '4px' }}>Accuracy</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#FFD300' }}>
                  {(stats.accuracy * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p style={{ opacity: 0.7, marginBottom: '4px' }}>Avg Time</p>
                <p style={{ fontSize: '16px', fontWeight: 700 }}>
                  {stats.avgTime > 0 ? Math.round(stats.avgTime) : '0'}ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings and Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Difficulty */}
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '16px',
            marginBottom: '15px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '10px',
          }}>
            &gt; DIFFICULTY
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  if (!gameActive) setDifficulty(diff as typeof difficulty);
                }}
                disabled={gameActive}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: difficulty === diff ? '#00FF41' : 'transparent',
                  border: '1px solid #00FF41',
                  color: difficulty === diff ? '#000' : '#00FF41',
                  cursor: gameActive ? 'not-allowed' : 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  transition: 'all 0.3s',
                  opacity: gameActive ? 0.5 : 1,
                  textTransform: 'uppercase',
                  fontSize: '12px',
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
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '16px',
            marginBottom: '15px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '10px',
          }}>
            &gt; DURATION
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[30, 60, 120].map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  if (!gameActive) {
                    setSelectedDuration(dur);
                    setStats((prev) => ({ ...prev, timeLeft: dur }));
                  }
                }}
                disabled={gameActive}
                style={{
                  padding: '10px',
                  background: selectedDuration === dur && !gameActive ? '#00FF41' : 'transparent',
                  border: '1px solid #00FF41',
                  color: selectedDuration === dur && !gameActive ? '#000' : '#00FF41',
                  cursor: gameActive ? 'not-allowed' : 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: selectedDuration === dur && !gameActive ? 700 : 400,
                  transition: 'all 0.3s',
                  opacity: gameActive ? 0.5 : 1,
                  fontSize: '12px',
                }}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Shots */}
      {shots.length > 0 && (
        <div style={{
          background: 'rgba(0, 20, 0, 0.6)',
          border: '2px solid #00FF41',
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}>
          <h3 style={{
            fontSize: '16px',
            marginBottom: '15px',
            color: '#FFD300',
            textShadow: '0 0 10px #FFD300',
            borderBottom: '1px solid #00FF41',
            paddingBottom: '10px',
          }}>
            &gt; RECENT SHOTS
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}>
            {shots.slice(0, 12).map((shot, idx) => (
              <div
                key={idx}
                style={{
                  background: shot.hit ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 49, 49, 0.1)',
                  border: `1px solid ${shot.hit ? '#00FF41' : '#FF3131'}`,
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: '8px' }}>
                  {shot.hit ? '✓ HIT' : '✗ MISS'}
                </p>
                <p>Time: {Math.round(shot.time)}ms</p>
                <p>Distance: {Math.round(shot.distance)}px</p>
                <p>Accuracy: {(shot.accuracy * 100).toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
