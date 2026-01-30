'use client';

import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sounds } from '../data/soundboard';

export default function SoundboardPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
  }, []);

  const playSound = (file: string) => {
    if (audioRef.current) {
      audioRef.current.src = file;
      audioRef.current.play();
    }
  };

  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>Soundboard</h1>
      <Navbar />
      <div className="content">
        {sounds.map((sound, index) => (
          <button 
            key={index} 
            className="button" 
            onClick={() => playSound(sound.file)}
          >
            {sound.name}
          </button>
        ))}
        <br />
        <br />
      </div>
      <Footer />
    </>
  );
}
