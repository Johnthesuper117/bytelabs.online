'use client';

import { useEffect, useRef, useState } from 'react';
import './rick.css';

export default function RickRoll() {
  const preRef = useRef<HTMLPreElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFrames = async () => {
      try {
        console.log('Fetching frames.js...');
        const response = await fetch('/frames.js');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Frames.js content length:', text.length);
        
        if (!text || text.trim().length === 0) {
          throw new Error('frames.js is empty');
        }

        // Parse the frames array from the JavaScript
        console.log('Parsing frames...');
        
        try {
          // Create a function that executes the script and returns frames
          const result = new Function('return (function() { ' + text + '; return typeof frames !== "undefined" ? frames : []; })()');
          const loadedFrames = result();
          
          console.log('Loaded frames count:', loadedFrames.length);
          
          if (!Array.isArray(loadedFrames) || loadedFrames.length === 0) {
            throw new Error('No frames array found or array is empty');
          }

          setFrames(loadedFrames);
          setLoading(false);
          
          // Play audio after a short delay
          setTimeout(() => {
            if (audioRef.current) {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(err => {
                  console.warn('Audio autoplay blocked:', err);
                });
              }
            }
          }, 100);
        } catch (parseError) {
          console.error('Parse error:', parseError);
          throw new Error(`Failed to parse frames: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error loading frames:', errorMsg);
        setError(errorMsg);
        setLoading(false);
      }
    };

    loadFrames();
  }, []);

  useEffect(() => {
    if (frames.length === 0 || !preRef.current) {
      console.log('Frames not ready:', frames.length);
      return;
    }

    console.log('Starting animation with', frames.length, 'frames');
    
    let frameIndex = 0;
    let animationId: number;
    const fps = 12;
    const frameTime = 1000 / fps;
    let lastFrameTime = Date.now();

    const animate = () => {
      const now = Date.now();

      if (now - lastFrameTime >= frameTime) {
        lastFrameTime = now;
        
        if (preRef.current && frames.length > 0) {
          const currentFrame = frames[frameIndex % frames.length];
          preRef.current.textContent = currentFrame;
        }
        frameIndex++;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [frames]);

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="rick-roll-container">
      <div className="rick-roll-content">
        <h1 className="rick-title">&gt; YOU'VE BEEN RICK ROLLED!</h1>

        {loading ? (
          <div className="loading-message">$ LOADING ANIMATION...</div>
        ) : error ? (
          <div className="error-message">
            $ ERROR: {error}
            <br />
            <small style={{ marginTop: '10px', display: 'block' }}>
              DEBUG: Check browser console for details
            </small>
          </div>
        ) : frames.length === 0 ? (
          <div className="error-message">
            $ ERROR: NO FRAMES LOADED
            <br />
            <small style={{ marginTop: '10px', display: 'block' }}>
              Ensure frames.js contains a frames array
            </small>
          </div>
        ) : (
          <pre ref={preRef} className="rick-animation"></pre>
        )}

        <audio
          ref={audioRef}
          src="/bitRick.wav"
          loop
          onError={(e) => {
            console.error('Audio error:', e);
          }}
        />

        <div className="rick-message">
          <p>Never gonna give you up...</p>
          <p>Never gonna let you down...</p>
          <button onClick={handleGoBack} className="back-button">
            &gt; GO BACK
          </button>
        </div>
      </div>
    </div>
  );
}
