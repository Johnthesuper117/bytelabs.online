"use client";

import { useState, useEffect } from 'react'; // Added useEffect import
import Navbar from '../../../../components/Navbar';

export default function CloakerPage() {
  const [url, setUrl] = useState('');

  // FIX: This useEffect replaces the code from Line 7
  useEffect(() => {
    const signalUnsavedChanges = (event: any) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', signalUnsavedChanges);

    // Cleanup: Remove the listener when the user leaves the page to prevent memory leaks
    return () => {
      window.removeEventListener('beforeunload', signalUnsavedChanges);
    };
  }, []);

  const openWebsite = () => {
    const trimmedUrl = url.trim();
    // Strengthened validation: Only allow HTTP(S) URLs using URL constructor
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        const win = window.open();
        if (win) {
          const iframe = win.document.createElement('iframe');
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "none";
          iframe.src = parsedUrl.href;
          win.document.body.appendChild(iframe);
        }
      } else {
        alert("Please enter a valid URL starting with http:// or https://");
      }
    } catch (e) {
      alert("Please enter a valid URL starting with http:// or https://");
    }
  };

  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>&gt; WEBSITE CLOAKER</h1>
      <Navbar />
      <div className="content">
        <p>
          <br />
          Don't forget to add "https://" to the beginning
          <br />
          <br />
          <label htmlFor="urlInput">Enter URL:</label>
          <input 
            type="text" 
            id="urlInput" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && openWebsite()}
            placeholder="https://example.com"
            style={{
              padding: '10px',
              marginLeft: '8px',
              marginRight: '8px',
              borderRadius: '4px',
              border: '2px solid #00FF41',
              backgroundColor: '#000000',
              color: '#00FF41',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '14px',
              width: '300px',
            }}
          />
          <br />
          <br />
          <button 
            onClick={openWebsite}
            style={{
              padding: '10px 20px',
              backgroundColor: '#000000',
              color: '#00FF41',
              border: '2px solid #00FF41',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontWeight: '700',
              transition: 'all 0.2s ease',
              textShadow: '0 0 10px #00FF41'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#003300';
              (e.target as HTMLButtonElement).style.borderColor = '#FFD300';
              (e.target as HTMLButtonElement).style.color = '#FFD300';
              (e.target as HTMLButtonElement).style.textShadow = '0 0 10px #FFD300';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#000000';
              (e.target as HTMLButtonElement).style.borderColor = '#00FF41';
              (e.target as HTMLButtonElement).style.color = '#00FF41';
              (e.target as HTMLButtonElement).style.textShadow = '0 0 10px #00FF41';
            }}
          >
            OPEN WEBSITE
          </button>
          <br />
          <br />
          Note that not all links will work, since some block embedded iframes.
        </p>
      </div>
    </>
  );
}