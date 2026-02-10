"use client";

import Navbar from '../components/Navbar';
import { useEffect } from 'react';

export default function GuidePage() {
  useEffect(() => {
    // Add the hidden button after the content is rendered
    const button = document.createElement('button');
    button.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      background-color: transparent;
      cursor: pointer;
      opacity: 0;
      z-index: 9999;
    `;
    button.textContent = '🔑'; // Key emoji
    button.onclick = () => {
      window.location.href = '/hidden/lore/secrets/cloaker';
    };
    
    // Add the button to the body
    document.body.appendChild(button);
    
    // Clean up on unmount
    return () => {
      document.body.removeChild(button);
    };
  }, []);

  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>How to learn how to code</h1>
      <Navbar />
      <div className="content">
        <h3>Step 1: Where to start?</h3>
        The first thing you need to do is decide what you want to achive with you code. Do you want to calculate math problems? Search for specific data in a list? Program hardware? Make a website? Create a video game to entertain? Once you decide this, you need to figure out which coding language is best for the job while keeping in mind what resourses you have.

        <h3>Step 2: Training Arc</h3>
        Learn the basics of the coding language(s) you chose. There are plenty of websites and videos you can use to learn the language. Note, while there are books you can use, they more expensive than videos and are not updated like official docs or other websites.

        <h3>Step 3: Practicing make progress</h3>
        Keep practicing by making small projects with different goals so as to build your skill variety and efficiency. Make sure to be consistent and practice at least a little as often as your able.
        <br />
        <br />

        <h2>Resources:</h2>
        <ul>
          <h3>Downloads:</h3>
          <a href="https://www.python.org/downloads/">Python</a>
          <br />
          <a href="https://cplusplus.com/">C++</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML</a>
          <br />
          <a href="https://www.php.net/downloads.php">PHP</a>
          <br />
          <br />
          <h3>Docs:</h3>
          <a href="https://docs.python.org">Python Docs</a>
          <br />
          <a href="https://www.learncpp.com/">Learn C++</a>
          <br />
          <a href="https://htmlcheatsheet.com/">HTML Cheat Sheet</a>
          <br />
          <a href="https://www.php.net/docs.php">PHP Docs</a>
          <br />
          <br />
          <h3>Others:</h3>
          <a href="https://quickref.me/">Quick Ref</a>
          <br />
          <br />
          <br />
          <h3>Sandboxes/Playgrounds/IDEs:</h3>
          <a href="https://replit.com/">Replit</a>
          <br />
          <a href="https://codepen.io/">CodePen</a>
          <br />
          <a href="https://code.visualstudio.com/">Visual Studio Code</a>
          <br />
          <a href="https://www.online-python.com/">Python IDE Online</a>
          <br />
          <a href="https://www.programiz.com/">Programiz</a>
          <br />
          <br />
          <br />
        </ul>
      </div>
    </>
  );
}
