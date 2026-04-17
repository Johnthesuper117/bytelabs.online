"use client";

import Link from 'next/link';

export default function GuidePage() {
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
        onClick={() => { window.location.href = '/hidden/lore/secrets/cloaker'; }}
        aria-hidden="true"
        tabIndex={-1}
      >
        🔑
      </button>

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
