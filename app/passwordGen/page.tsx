'use client';

import { useState, useCallback } from 'react';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*(){}[]=<>/?,.';
const AMBIGUOUS = /[0O1lI]/g;

function secureRandom(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let val: number;
  do {
    crypto.getRandomValues(arr);
    val = arr[0];
  } while (val >= limit);
  return val % max;
}

function generatePassword(
  length: number,
  includeUpper: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  excludeAmbiguous: boolean,
  requireEach: boolean,
): string {
  let pool = LOWER;
  if (includeUpper) pool += UPPER;
  if (includeNumbers) pool += NUMBERS;
  if (includeSymbols) pool += SYMBOLS;
  if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) return '';

  if (requireEach) {
    // Build a guaranteed character from each active set, then fill the rest randomly
    const guaranteed: string[] = [];
    let lowerPool = LOWER;
    let upperPool = UPPER;
    let numPool = NUMBERS;
    let symPool = SYMBOLS;
    if (excludeAmbiguous) {
      lowerPool = lowerPool.replace(AMBIGUOUS, '');
      upperPool = upperPool.replace(AMBIGUOUS, '');
      numPool = numPool.replace(AMBIGUOUS, '');
    }
    if (lowerPool) guaranteed.push(lowerPool[secureRandom(lowerPool.length)]);
    if (includeUpper && upperPool) guaranteed.push(upperPool[secureRandom(upperPool.length)]);
    if (includeNumbers && numPool) guaranteed.push(numPool[secureRandom(numPool.length)]);
    if (includeSymbols && symPool) guaranteed.push(symPool[secureRandom(symPool.length)]);

    const rest = Array.from({ length: Math.max(0, length - guaranteed.length) }, () =>
      pool[secureRandom(pool.length)]
    );

    // Shuffle via Fisher-Yates
    const combined = [...guaranteed, ...rest];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1);
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined.join('');
  }

  return Array.from({ length }, () => pool[secureRandom(pool.length)]).join('');
}

function getStrength(
  password: string,
  length: number,
  hasUpper: boolean,
  hasNumbers: boolean,
  hasSymbols: boolean,
): { width: string; color: string; text: string } {
  let score = 0;
  if (length > 8) score++;
  if (length > 14) score++;
  if (length > 20) score++;
  if (hasUpper) score++;
  if (hasNumbers) score++;
  if (hasSymbols) score++;

  if (score <= 2) return { width: '20%', color: '#FF3131', text: 'Weak' };
  if (score <= 3) return { width: '45%', color: '#FF8C00', text: 'Fair' };
  if (score <= 4) return { width: '65%', color: '#FFD300', text: 'Good' };
  if (score <= 5) return { width: '85%', color: '#00FF41', text: 'Strong' };
  return { width: '100%', color: '#00FF41', text: 'Very Strong' };
}

export default function PasswordGenPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [requireEach, setRequireEach] = useState(true);
  const [copied, setCopied] = useState(false);

  const strength = password
    ? getStrength(password, length, uppercase, numbers, symbols)
    : { width: '0%', color: '#FF3131', text: '—' };

  const generate = useCallback(() => {
    const p = generatePassword(length, uppercase, numbers, symbols, excludeAmbiguous, requireEach);
    setPassword(p);
    setCopied(false);
  }, [length, uppercase, numbers, symbols, excludeAmbiguous, requireEach]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const panelStyle: React.CSSProperties = {
    background: 'rgba(0, 20, 0, 0.6)',
    border: '2px solid #00FF41',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#00FF41',
    fontFamily: "'JetBrains Mono', monospace",
  };

  const checkStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    accentColor: '#00FF41',
    cursor: 'pointer',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: "'JetBrains Mono', monospace", color: '#00FF41' }}>
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
        &gt; PASSWORD GENERATOR
      </h1>

      {/* Result */}
      <div style={panelStyle}>
        <h2 style={{ fontSize: '14px', color: '#FFD300', textShadow: '0 0 8px #FFD300', marginBottom: '15px' }}>&gt; GENERATED PASSWORD</h2>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid #00FF41',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '15px',
          minHeight: '50px',
        }}>
          <span style={{
            flex: 1,
            wordBreak: 'break-all',
            fontSize: '16px',
            letterSpacing: '1px',
            color: password ? '#00FF41' : 'rgba(0,255,65,0.3)',
          }}>
            {password || 'Click GENERATE to create a password'}
          </span>
          {password && (
            <button
              onClick={copyToClipboard}
              title="Copy to clipboard"
              style={{
                background: copied ? '#00FF41' : 'transparent',
                border: '1px solid #00FF41',
                color: copied ? '#000' : '#00FF41',
                padding: '8px 12px',
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? '✓ COPIED' : '📋 COPY'}
            </button>
          )}
        </div>

        {/* Strength meter */}
        <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Strength</span>
          <span style={{ color: strength.color, fontWeight: 700 }}>{strength.text}</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden', border: '1px solid #00FF41' }}>
          <div style={{
            height: '100%',
            width: strength.width,
            background: strength.color,
            transition: 'width 0.3s ease, background-color 0.3s ease',
            boxShadow: `0 0 8px ${strength.color}`,
          }} />
        </div>
      </div>

      {/* Settings */}
      <div style={panelStyle}>
        <h2 style={{ fontSize: '14px', color: '#FFD300', textShadow: '0 0 8px #FFD300', marginBottom: '15px' }}>&gt; SETTINGS</h2>

        {/* Length */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ ...labelStyle, marginBottom: '8px' }}>
            <span>Length</span>
            <span style={{ color: '#FFD300', fontWeight: 700 }}>{length}</span>
          </div>
          <input
            type="range"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#00FF41', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
            <span>4</span><span>128</span>
          </div>
        </div>

        {/* Checkboxes */}
        {[
          { label: 'Include Uppercase (A–Z)', value: uppercase, set: setUppercase },
          { label: 'Include Numbers (0–9)', value: numbers, set: setNumbers },
          { label: 'Include Symbols (!@#…)', value: symbols, set: setSymbols },
          { label: 'Exclude Ambiguous Chars (0, O, l, 1, I)', value: excludeAmbiguous, set: setExcludeAmbiguous },
          { label: 'Require at Least One of Each Type', value: requireEach, set: setRequireEach },
        ].map(({ label, value, set }) => (
          <label key={label} style={{ ...labelStyle, cursor: 'pointer', userSelect: 'none' }}>
            <span>{label}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => set(e.target.checked)}
              style={checkStyle}
            />
          </label>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        style={{
          width: '100%',
          padding: '16px',
          background: '#00FF41',
          border: 'none',
          color: '#000',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: '18px',
          cursor: 'pointer',
          letterSpacing: '2px',
          transition: 'all 0.2s',
          boxShadow: '0 0 20px rgba(0,255,65,0.3)',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,255,65,0.6)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,255,65,0.3)'; }}
      >
        GENERATE
      </button>
    </div>
  );
}
