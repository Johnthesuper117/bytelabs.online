'use client';

import { useEffect, useRef, useState } from 'react';

// ASCII frames for the Rick Roll animation
const frames = [
`                                                                                                                                                        
` /* Full frames array would be very long - truncated for brevity. In production, include all frames from rick/frames.js */,
];

// Fit text to container function
function fitTextToContainer(text: string, fontFace: string, containerWidth: number): number {
  const PIXEL_RATIO = getPixelRatio();

  const canvas = createHiDPICanvas(containerWidth, 0);
  const context = canvas.getContext('2d');
  if (!context) return 12;

  const longestLine = getLongestLine(split(text), context);
  const fittedFontSize = getFittedFontSize(longestLine, fontFace, context, canvas);

  return fittedFontSize;
}

function getPixelRatio(): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 1;
  const dpr = window.devicePixelRatio || 1;
  // @ts-ignore - These properties exist on the context in some browsers
  const bsr = ctx.webkitBackingStorePixelRatio ||
    // @ts-ignore
    ctx.mozBackingStorePixelRatio ||
    // @ts-ignore
    ctx.msBackingStorePixelRatio ||
    // @ts-ignore
    ctx.oBackingStorePixelRatio ||
    // @ts-ignore
    ctx.backingStorePixelRatio || 1;
  return dpr / bsr;
}

function split(text: string): string[] {
  return text.split('\n');
}

function getLongestLine(lines: string[], context: CanvasRenderingContext2D): string {
  let longest = -1;
  let longestIndex = -1;

  lines.forEach((line, ii) => {
    const lineWidth = context.measureText(line).width;
    if (lineWidth > longest) {
      longestIndex = ii;
      if (!line.includes('exempt-from-text-fit-calculation')) {
        longest = lineWidth;
      }
    }
  });

  return ('number' === typeof longestIndex) ? lines[longestIndex] : '';
}

function getFittedFontSize(text: string, fontFace: string, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): number {
  const fits = () => context.measureText(text).width <= canvas.width;
  const font = (size: number, face: string) => size + 'px ' + face;

  let fontSize = 300;

  do {
    fontSize--;
    context.font = font(fontSize, fontFace);
  } while (!fits() && fontSize > 1);

  const PIXEL_RATIO = getPixelRatio();
  return fontSize / (PIXEL_RATIO / 1.62);
}

function createHiDPICanvas(w: number, h: number): HTMLCanvasElement {
  const PIXEL_RATIO = getPixelRatio();
  const canvas = document.createElement('canvas');
  canvas.width = w * PIXEL_RATIO;
  canvas.height = h * PIXEL_RATIO;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.getContext('2d')?.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  return canvas;
}

// Placeholder frames (the full 2161 frames would be inserted here from rick/frames.js)
const asciiFrames = [
`                                                                                                                                                        `,
`                                                                                                                                                        `,
`                                                                                                                                                        `,
];

export default function RickRoll() {
  const preRef = useRef<HTMLPreElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [direction, setDirection] = useState<'inc' | 'dec'>('inc');

  useEffect(() => {
    // Play sound on load
    const audio = new Audio('/rick/bitRick.wav');
    audio.play().catch(() => {
      // Autoplay might be blocked
      console.log('Audio autoplay blocked');
    });

    let i = 0;
    let dir: 'inc' | 'dec' = 'inc';
    const max = asciiFrames.length;
    const fps = 12;

    const setPreCharSize = () => {
      if (!preRef.current) return;
      const charRatio = 0.66;
      const charWidth = fitTextToContainer(asciiFrames[0].split('\n')[1] || '', 'monospace', preRef.current.clientWidth) * charRatio;
      const charHeight = charRatio * charWidth;
      preRef.current.style.fontSize = charWidth + 'px';
      preRef.current.style.lineHeight = charHeight + 'px';
    };

    setPreCharSize();
    window.addEventListener('resize', setPreCharSize);

    const fpsInterval = 1000 / fps;
    let then = Date.now();
    let elapsed: number;

    const animate = () => {
      requestAnimationFrame(animate);

      const now = Date.now();
      elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        // Step animation
        if (dir === 'inc') {
          if (i === max - 1) {
            dir = 'dec';
            i--;
          } else {
            i++;
          }
        } else if (dir === 'dec') {
          if (i === 0) {
            dir = 'inc';
            i++;
          } else {
            i--;
          }
        }

        setCurrentFrame(i);
        setDirection(dir);
      }
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setPreCharSize);
      cancelAnimationFrame(animationId);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: '66%',
      fontFamily: 'monospace',
      border: '1px dashed green',
      margin: '0 auto',
      color: 'green',
      backgroundColor: 'black',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <pre
        ref={preRef}
        id="trace"
        style={{
          width: '100%',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        <span id="trace-chars">{asciiFrames[currentFrame]}</span>
      </pre>
    </div>
  );
}
