'use client';

import { useEffect, useRef, useState } from 'react';

const COLORS = ['#00FF41', '#FFD300', '#FF3131', '#00FFFF', '#FF00FF'];

export default function MatrixPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const speedRef = useRef(33);
  const colorRef = useRef('#00FF41');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropsRef = useRef<number[]>([]);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(33);
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / 20);
      dropsRef.current = Array.from({ length: cols }, () => 1);
    };
    resize();

    function draw() {
      if (!ctx || !canvas || pausedRef.current) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colorRef.current;
      ctx.font = '15px monospace';
      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    intervalRef.current = setInterval(draw, speedRef.current);
    window.addEventListener('resize', resize);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const restart = (newSpeed: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    function draw() {
      if (!ctx || !canvas || pausedRef.current) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colorRef.current;
      ctx.font = '15px monospace';
      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas!.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    intervalRef.current = setInterval(draw, newSpeed);
  };

  const handlePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const handleSpeed = (val: number) => {
    speedRef.current = val;
    setSpeed(val);
    if (!pausedRef.current) restart(val);
  };

  const handleColor = (idx: number) => {
    colorRef.current = COLORS[idx];
    setColorIdx(idx);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const controlBar: React.CSSProperties = {
    position: 'fixed',
    top: '110px',
    right: '20px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'rgba(0,0,0,0.85)',
    border: '1px solid #00FF41',
    padding: '14px',
    borderRadius: '4px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#00FF41',
    minWidth: '160px',
  };

  const btn: React.CSSProperties = {
    padding: '8px',
    background: 'transparent',
    border: '1px solid #00FF41',
    color: '#00FF41',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    transition: 'all 0.2s',
  };

  return (
    <>
      <canvas
        id="Matrix"
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* Controls overlay */}
      <div style={controlBar}>
        <p style={{ fontWeight: 700, color: '#FFD300', marginBottom: '6px', textShadow: '0 0 8px #FFD300' }}>&gt; MATRIX CONTROLS</p>

        <button style={{ ...btn, background: paused ? 'rgba(255,211,0,0.15)' : 'transparent', borderColor: paused ? '#FFD300' : '#00FF41', color: paused ? '#FFD300' : '#00FF41' }} onClick={handlePause}>
          {paused ? '▶ RESUME' : '⏸ PAUSE'}
        </button>

        <button style={btn} onClick={handleClear}>
          🗑 CLEAR
        </button>

        <div style={{ marginTop: '6px' }}>
          <p style={{ marginBottom: '6px', opacity: 0.7 }}>Speed</p>
          {[{ label: 'Slow', val: 66 }, { label: 'Normal', val: 33 }, { label: 'Fast', val: 16 }].map(({ label, val }) => (
            <button
              key={val}
              onClick={() => handleSpeed(val)}
              style={{
                ...btn,
                width: '100%',
                marginBottom: '4px',
                background: speed === val ? 'rgba(0,255,65,0.15)' : 'transparent',
                fontWeight: speed === val ? 700 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '6px' }}>
          <p style={{ marginBottom: '6px', opacity: 0.7 }}>Color</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {COLORS.map((c, i) => (
              <button
                key={c}
                onClick={() => handleColor(i)}
                style={{
                  width: '28px',
                  height: '28px',
                  background: c,
                  border: colorIdx === i ? '2px solid #fff' : '2px solid transparent',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  opacity: colorIdx === i ? 1 : 0.6,
                  transition: 'opacity 0.2s',
                }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
