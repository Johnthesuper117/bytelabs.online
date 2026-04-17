'use client';

import { useEffect, useRef, useState } from 'react';
import './Soundboard.css';

interface Sound {
  name: string;
  filename: string;
  category?: string;
}

// Friendly display names for sounds
const DISPLAY_NAMES: Record<string, string> = {
  'test1': 'Test Sound 1',
  'test2': 'Test Sound 2',
  'metal-pipe-clang': 'Metal Pipe Clang',
  'time-skip': 'Time Skip',
  'keyboard': 'Keyboard Clack',
  'ahThatllPutTheFearInThem': 'Ah, That\'ll Put The Fear In Them',
  'grass-grows-birds-fly-sun-shines-and-brother-i-hurt-people': 'Brother, I Hurt People',
  'minos-prime-theme': 'Minos Prime Theme',
  'SODA': 'SODA',
  'ladies-and-gentlemen-we-got-him-song': 'Ladies & Gentlemen, We Got Him',
  'SHEESH': 'SHEESH',
  'tf2-demoman-laugh': 'TF2 Demoman Laugh',
  'kira-laugh': 'Kira Laugh',
  'let-it-go-tf2': 'Let It Go (TF2)',
  'levelUp': 'Level Up',
  'ahhyooaaawhoaaa': 'Ahhyoo Whoaaa',
  'killjoy': 'Killjoy',
  'heavy_oh_no': 'Heavy Oh No',
  'social-credit-deducted': 'Social Credit Deducted',
  'juggernaut': 'Juggernaut',
  'Time Skip': 'Time Skip (WAV)',
  'epic-fail': 'Epic Fail',
  'judgment': 'Judgment',
  'yippeeeeeeeeeeeeee': 'Yippee!!!',
  'ENDSKIP': 'End Skip',
  'SKIP': 'Skip',
  'halo-first-strike': 'Halo: First Strike',
  'headshot': 'Headshot',
  'movieDeath': 'Movie Death',
  'scout-tf2-wananana': 'TF2 Scout Wananana',
  'halo-double-kill': 'Halo: Double Kill',
  'heavy_laugh': 'Heavy Laugh',
  'dk-yeah': 'DK Yeah',
  'super-luigi-on-the-xbox-one': 'Super Luigi on the Xbox One',
  'gameover': 'Game Over',
  'assault': 'Assault',
  'nani': 'Nani?!',
  'this-prison-to-hold-me': 'No Prison Can Hold Me',
  'perfection': 'Perfection',
  'censor-beep': 'Censor Beep',
  'Epitaph': 'Epitaph',
  'fart': 'Fart',
  'scout-boink': 'TF2 Scout Boink',
  'oneMoreWordOracle': 'One More Word, Oracle',
  'yoink-halo': 'Halo: Yoink',
  'oof': 'Oof',
  'payday-2-sound-cloaker-scream': 'Payday 2: Cloaker Scream',
  'you-know-the-rules-and-so-do-i-say-goodbye': 'Never Gonna Give You Up',
  'killionaire': 'Halo: Killionaire',
  'engineer_no': 'TF2 Engineer No',
  'hail_to_the_king': 'Hail to the King',
  'chicken-jockey': 'Chicken Jockey',
  'woboba': 'Woboba',
  'reinforcements': 'Reinforcements',
  'trollface': 'Trollface Music',
  'tf2-heavy-im-coming-for-you': 'TF2 Heavy: I\'m Coming For You',
  'imacowardlyfool': 'I\'m a Cowardly Fool',
  'cloaker-full-difficulty-tweak': 'Cloaker Full Difficulty Tweak',
  'xbox-360-startup': 'Xbox 360 Startup',
  'XBOX720': 'Xbox 720',
  'ta-da': 'Ta-Da!',
  'betrayal': 'Betrayal',
  'five_mins_remaining': '5 Minutes Remaining',
  'extermination': 'Extermination',
  'hold-up': 'Hold Up',
  'emotionalDamage': 'EMOTIONAL DAMAGE',
  'meet_the_sniper': 'Meet the Sniper',
  'you-are-dead-not-big-surprise-sound-effect': 'You Are Dead (Not Big Surprise)',
  'heavy_no': 'Heavy No',
  'pleaseStopBeingHuman': 'Please Stop Being Human',
  'taco-bell': 'Taco Bell Ding',
  'prowler-sfx': 'Prowler SFX',
  'requiem': 'Requiem',
  'fbi-open-up': 'FBI OPEN UP',
  'tf2-right-behind-you': 'TF2 Spy: Right Behind You',
  'game-over-yeah': 'Game Over Yeah',
  'hello-its-john-cena': 'Hello, It\'s John Cena',
  'johnsonBooHa': 'Johnson Boo Ha',
  'defense': 'Defense!',
  'iAmAGenius': 'I Am a Genius',
  'whatIsThePassword': 'What Is the Password?',
  'halo-untouchable': 'Halo: Untouchable',
  'comeOnNowIsThatAWeaponOrA': 'Come On, Is That a Weapon?',
  'marineLaugh': 'Marine Laugh',
  'beatboxing-tetris': 'Beatboxing Tetris',
  'mustard': 'Mustard',
  'mario-no-one-asked-for-your-opinion': 'Mario: No One Asked',
  'chicken-jockey-loud': 'Chicken Jockey (LOUD)',
  'meme-song': 'Meme Song',
  'who_asked': 'Who Asked?',
  'think-fast': 'Think Fast',
  'teammate_gained': 'Teammate Gained',
  'batman_ridin': 'Batman Ridin\'',
  'halo-touch-grass': 'Halo: Touch Grass',
  'marineGrenade': 'Marine Grenade',
  'memes-the-dna-of-the-soul': 'Memes: DNA of the Soul',
  'road-rage': 'Road Rage',
  'thomas-the-tank-engine': 'Thomas the Tank Engine',
  'KABOOM': 'KABOOM',
  'flashbang': 'Flashbang',
  'galaxy-meme': 'Galaxy Meme',
  'run': 'RUN',
  'heavy_i_am_bullet_proof': 'Heavy: I Am Bullet Proof',
  'hahahaGetInLine': 'Hahaha Get In Line',
  'invincible': 'Invincible',
  'heavy_ratata': 'Heavy Ratata',
  'whatIsItGoodForAbsolutelyNothing': 'What Is It Good For? Absolutely Nothing',
  'wanna-see-a-magic-trick-tf2': 'TF2: Wanna See a Magic Trick?',
  'halo-skill-issue': 'Halo: Skill Issue',
  'ive-taken-a-grievous-wound': 'I\'ve Taken a Grievous Wound',
  'tf2-spy-peekaboo-sound-effect': 'TF2 Spy: Peekaboo',
  'tf2-heavy-om-nom-nom-sound-effect': 'TF2 Heavy: Om Nom Nom',
  'eliteWort': 'Elite Wort Wort',
  'stabx3': 'Stab x3',
  'say-goodbye-kneecaps': 'Say Goodbye to Your Kneecaps',
  'halo-multiple-kills': 'Halo: Multiple Kills',
  'tf2-bonk': 'TF2 Scout: Bonk!',
};

function getDisplayName(filename: string): string {
  const base = filename.split('/').pop()?.replace(/\.(mp3|wav|ogg|m4a|flac|mp4)$/i, '') ?? filename;
  return DISPLAY_NAMES[base] ?? base.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Soundboard() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const audioRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await fetch('/soundboard.json');
        if (!response.ok) throw new Error('Failed to load sounds');
        const data = await response.json();
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data.sounds)) {
          items = data.sounds;
        }

        const parsed: Sound[] = items
          .map((it) => {
            const name = it.name || it.title || '';
            const filename = it.file || it.filename || it.path || '';
            return { name, filename } as Sound;
          })
          .filter((s) => {
            const f = s.filename || '';
            if (!f) return false;
            if (f.startsWith('http')) return true;
            return /\.(mp3|wav|ogg|m4a|flac|mp4)$/i.test(f);
          });

        setSounds(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSounds();
  }, []);

  const stopCurrent = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    setPlayingFile(null);
  };

  const playSound = async (filename: string) => {
    // Stop anything currently playing
    stopCurrent();

    try {
      const candidates: string[] = [];
      if (filename.startsWith('http')) candidates.push(filename);
      if (filename.startsWith('/')) candidates.push(window.location.origin + filename);
      const basename = filename.replace(/^\/+/, '');
      candidates.push(`/assets/sounds/${basename}`);

      let foundSrc: string | null = null;
      for (const cand of candidates) {
        try {
          const res = await fetch(cand, { method: 'HEAD' });
          if (res.ok) { foundSrc = cand; break; }
        } catch (_) { /* try next */ }
      }

      if (!foundSrc) {
        setError(`Sound file not found: ${filename}`);
        return;
      }

      let audio = audioRef.current.get(foundSrc);
      if (!audio) {
        audio = new Audio(foundSrc);
        audioRef.current.set(foundSrc, audio);
      }

      audio.currentTime = 0;
      setPlayingFile(filename);
      currentAudioRef.current = audio;

      audio.onended = () => setPlayingFile(null);
      await audio.play();
    } catch (err) {
      setError('Error playing sound');
      setPlayingFile(null);
    }
  };

  const filtered = sounds.filter((s) =>
    getDisplayName(s.filename).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="soundboard-container">
        <div className="loading">$ LOADING SOUNDBOARD...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="soundboard-container">
        <div className="error">
          [ERROR] {error}
          <br />
          <small>Check that soundboard.json is generated in /public/</small>
        </div>
      </div>
    );
  }

  if (sounds.length === 0) {
    return (
      <div className="soundboard-container">
        <div className="no-sounds">
          $ NO SOUNDS FOUND
          <br />
          <small>Place audio files in ./assets/sounds/ and run soundList.py</small>
        </div>
      </div>
    );
  }

  return (
    <div className="soundboard-container">
      <h1 className="soundboard-title">&gt; SOUNDBOARD</h1>

      {/* Controls bar */}
      <div className="soundboard-controls">
        <input
          type="text"
          className="soundboard-search"
          placeholder="Search sounds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search sounds"
        />
        {playingFile && (
          <button className="soundboard-stop-btn" onClick={stopCurrent}>
            ⏹ STOP
          </button>
        )}
        <span className="soundboard-count">
          {filtered.length} / {sounds.length} sounds
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="no-sounds">No sounds match &quot;{search}&quot;</div>
      ) : (
        <div className="soundboard-grid">
          {filtered.map((sound) => {
            const isPlaying = playingFile === sound.filename;
            return (
              <button
                key={sound.filename}
                className={`sound-button${isPlaying ? ' playing' : ''}`}
                onClick={() => playSound(sound.filename)}
                title={sound.filename}
              >
                <span className="button-text">{getDisplayName(sound.filename)}</span>
                {isPlaying && <span className="playing-indicator">▶ PLAYING</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
