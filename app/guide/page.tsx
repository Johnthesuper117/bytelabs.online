"use client";

import { useState, useRef, useEffect } from 'react';
import prompts from '../data/cloaker-prompts.json';

type Prompt = { prompt: string; password: string };

export default function GuidePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function openModal() {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(random);
    setInputValue('');
    setModalOpen(true);
  }

  useEffect(() => {
    if (modalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalOpen]);

  function handleSubmit() {
    if (!currentPrompt) return;
    if (inputValue.trim().toLowerCase() === currentPrompt.password.toLowerCase()) {
      setModalOpen(false);
      const tab = window.open('about:blank', '_blank');
      if (tab) {
        tab.document.write(
          '<!DOCTYPE html><html><head><title>New Tab</title><style>*{margin:0;padding:0;overflow:hidden}html,body{width:100%;height:100%}iframe{width:100%;height:100%;border:none;display:block}</style></head>' +
          '<body><iframe src="https://johnthesuper117.github.io/persona/" allowfullscreen></iframe></body></html>'
        );
        tab.document.close();
      }
    } else {
      setModalOpen(false);
      window.location.href = '/';
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') setModalOpen(false);
  }

  return (
    <>
      {/* Hidden Easter egg button */}
      <button
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          opacity: 0,
          zIndex: 9999,
        }}
        onClick={openModal}
        aria-hidden="true"
        tabIndex={-1}
      >
      </button>

      {/* Cloaker prompt modal */}
      {modalOpen && currentPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 10000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div
            style={{
              background: '#000',
              border: '2px solid #00FF41',
              borderRadius: '6px',
              padding: '32px 36px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 0 30px rgba(0,255,65,0.4)',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              color: '#00FF41',
            }}
          >
            <p style={{ fontSize: '13px', marginBottom: '24px', lineHeight: '1.8', textShadow: '0 0 8px #00FF41' }}>
              {currentPrompt.prompt}
            </p>
            <input
              ref={inputRef}
              type="text"
              maxLength={15}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="_ _ _ _ _ _ _ _ _ _ _ _ _ _ _"
              style={{
                width: '100%',
                background: '#000',
                border: '1px solid #00FF41',
                borderRadius: '3px',
                color: '#00FF41',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: '15px',
                padding: '10px 12px',
                outline: 'none',
                boxShadow: '0 0 8px rgba(0,255,65,0.3)',
                letterSpacing: '1px',
              }}
            />
            <div style={{ marginTop: '18px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #00FF41',
                  color: '#00FF41',
                  padding: '8px 18px',
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: '13px',
                  cursor: 'pointer',
                  borderRadius: '3px',
                }}
              >
                cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  background: '#00FF41',
                  border: '1px solid #00FF41',
                  color: '#000',
                  padding: '8px 18px',
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '3px',
                }}
              >
                enter
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="content">
        <h2>&gt; HOW TO LEARN HOW TO CODE</h2>

        <h3>Step 1: Where to Start?</h3>
        <p>
          The first thing you need to do is decide what you want to achieve with your code. Do you want to calculate
          math problems? Search for specific data in a list? Program hardware? Make a website? Create a video game?
          Once you decide, figure out which coding language is best suited for the job while keeping in mind what
          resources you have available.
        </p>

        <h3>Step 2: Training Arc</h3>
        <p>
          Learn the basics of the language(s) you chose. There are plenty of websites and videos you can use.
          Note: while there are books available, they are more expensive and often not updated as frequently as
          official docs or community websites.
        </p>

        <h3>Step 3: Practice Makes Progress</h3>
        <p>
          Keep practicing by making small projects with different goals to build your skill variety and efficiency.
          Be consistent and practice at least a little as often as you&apos;re able — progress compounds over time.
        </p>

        <h2>Resources</h2>

        <h3>Languages &amp; Downloads</h3>
        <ul>
          <li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">Python</a></li>
          <li><a href="https://code.visualstudio.com/docs/languages/cpp" target="_blank" rel="noopener noreferrer">C++ (VS Code setup guide)</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noopener noreferrer">HTML (MDN)</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer">CSS (MDN)</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">JavaScript (MDN)</a></li>
          <li><a href="https://www.typescriptlang.org/download" target="_blank" rel="noopener noreferrer">TypeScript</a></li>
          <li><a href="https://www.php.net/downloads.php" target="_blank" rel="noopener noreferrer">PHP</a></li>
        </ul>

        <h3>Documentation &amp; References</h3>
        <ul>
          <li><a href="https://docs.python.org" target="_blank" rel="noopener noreferrer">Python Docs</a></li>
          <li><a href="https://www.learncpp.com/" target="_blank" rel="noopener noreferrer">Learn C++</a></li>
          <li><a href="https://htmlcheatsheet.com/" target="_blank" rel="noopener noreferrer">HTML Cheat Sheet</a></li>
          <li><a href="https://cssreference.io/" target="_blank" rel="noopener noreferrer">CSS Reference</a></li>
          <li><a href="https://javascript.info/" target="_blank" rel="noopener noreferrer">JavaScript.info</a></li>
          <li><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">TypeScript Docs</a></li>
          <li><a href="https://www.php.net/docs.php" target="_blank" rel="noopener noreferrer">PHP Docs</a></li>
          <li><a href="https://quickref.me/" target="_blank" rel="noopener noreferrer">Quick Ref (multi-language cheat sheets)</a></li>
        </ul>

        <h3>Sandboxes, Playgrounds &amp; IDEs</h3>
        <ul>
          <li><a href="https://replit.com/" target="_blank" rel="noopener noreferrer">Replit</a></li>
          <li><a href="https://codepen.io/" target="_blank" rel="noopener noreferrer">CodePen</a></li>
          <li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">Visual Studio Code</a></li>
          <li><a href="https://www.online-python.com/" target="_blank" rel="noopener noreferrer">Python IDE Online</a></li>
          <li><a href="https://www.programiz.com/" target="_blank" rel="noopener noreferrer">Programiz</a></li>
          <li><a href="https://stackblitz.com/" target="_blank" rel="noopener noreferrer">StackBlitz (web & Node projects)</a></li>
        </ul>

        <h3>Game Development</h3>
        <ul>
          <li><a href="https://docs.unity.com/" target="_blank" rel="noopener noreferrer">Unity Docs</a></li>
          <li><a href="https://docs.unrealengine.com/" target="_blank" rel="noopener noreferrer">Unreal Engine Docs</a></li>
          <li><a href="https://docs.godotengine.org/" target="_blank" rel="noopener noreferrer">Godot Engine Docs</a></li>
          <li><a href="https://developer.valvesoftware.com/wiki/Main_Page" target="_blank" rel="noopener noreferrer">Valve Developer Wiki (Source Engine)</a></li>
          <li><a href="https://scratch.mit.edu" target="_blank" rel="noopener noreferrer">Scratch (great starting point!)</a></li>
        </ul>

        <h3>Cybersecurity</h3>
        <ul>
          <li><a href="https://tryhackme.com/" target="_blank" rel="noopener noreferrer">TryHackMe (beginner-friendly CTF / labs)</a></li>
          <li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener noreferrer">Hack The Box</a></li>
          <li><a href="https://overthewire.org/wargames/" target="_blank" rel="noopener noreferrer">OverTheWire (wargames)</a></li>
          <li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">OWASP Top 10 (web security)</a></li>
        </ul>

        <h3>Learning Platforms</h3>
        <ul>
          <li><a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer">freeCodeCamp</a></li>
          <li><a href="https://www.theodinproject.com/" target="_blank" rel="noopener noreferrer">The Odin Project</a></li>
          <li><a href="https://www.khanacademy.org/computing/computer-programming" target="_blank" rel="noopener noreferrer">Khan Academy — Computing</a></li>
          <li><a href="https://cs50.harvard.edu/" target="_blank" rel="noopener noreferrer">Harvard CS50 (free)</a></li>
        </ul>
      </div>
    </>
  );
}
