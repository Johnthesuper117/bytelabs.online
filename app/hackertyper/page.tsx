'use client';

import { useEffect, useRef, useState } from 'react';
import './hackertyper.css';

const SAMPLE = `// initializing...\nfunction init() {\n  const secret = 42;\n  for (let i = 0; i < 10; i++) {\n    console.log('ByteLabs', i, secret);\n  }\n}\n\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return 'Hello, ' + this.name + '!';\n  }\n}\n\n// More pseudo code to simulate fast typing\nconst payload = { id: '0xdeadbeef', data: [1,2,3] };\n// End of sample\n`;

export default function HackerTyper() {
  const [text, setText] = useState('');
  const posRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // ignore modifier keys
      if (e.key.length > 1 && e.key !== 'Enter' && e.key !== 'Backspace') return;

      // append a small chunk to simulate typing
      const chunkLength = Math.max(1, Math.floor(Math.random() * 6));
      let out = '';
      for (let i = 0; i < chunkLength; i++) {
        const idx = posRef.current % SAMPLE.length;
        out += SAMPLE[idx];
        posRef.current += 1;
      }

      setText((t) => t + out);

      // Scroll to bottom
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleClear = () => {
    setText('');
    posRef.current = 0;
  };

  return (
    <div className="ht-page">
      <div ref={containerRef} className="ht-wrapper">
        <pre className="ht-screen" aria-live="polite">
{text}
        </pre>
      </div>
    </div>
  );
}
