"use client";

import { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

export default function CloakerPage() {
  const [url, setUrl] = useState('');

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
      <h1>Website Cloaker</h1>
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
            style={{
              padding: '8px',
              marginLeft: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <br />
          <br />
          <button 
            onClick={openWebsite}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Website
          </button>
          <br />
          <br />
          Note that not all links will work, since some block embedded iframes.
        </p>
      </div>
      <Footer />
    </>
  );
}
