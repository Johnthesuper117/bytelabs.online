'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navbar.css';

export default function Navbar() {
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
    // Close dropdowns when toggling mobile menu
    setIsTrainingOpen(false);
    setIsProjectsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          &gt; BYTELABS.ONLINE
        </Link>

        <ul className={`nav-menu${isMobileOpen ? ' active' : ''}`}>
          <li className="nav-item">
            <Link href="/" className={`nav-link${isActive('/') ? ' nav-link-active' : ''}`}>
              HOME
            </Link>
          </li>

          <li className="nav-item dropdown">
            <button
              type="button"
              className="nav-link dropdown-toggle"
              onClick={() => { setIsTrainingOpen(!isTrainingOpen); setIsProjectsOpen(false); }}
              aria-expanded={isTrainingOpen}
              aria-haspopup="true"
            >
              TRAINING ▼
            </button>
            {isTrainingOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link href="/CPSTracker" title="Test how fast you can click">Clicks Per Second Tracker</Link>
                </li>
                <li>
                  <Link href="/AimTrainer" title="Practice your mouse accuracy">Aim Trainer</Link>
                </li>
                <li>
                  <Link href="/RTTrainer" title="Measure and improve your reaction speed">Reaction Time Trainer</Link>
                </li>
                <li>
                  <Link href="/QTETrainer" title="Practice hitting timed button prompts">Quick Time Event Trainer</Link>
                </li>
                <li>
                  <Link href="/CITrainer" title="Practice fighting-game style command inputs">Command Input Trainer</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item dropdown">
            <button
              type="button"
              className="nav-link dropdown-toggle"
              onClick={() => { setIsProjectsOpen(!isProjectsOpen); setIsTrainingOpen(false); }}
              aria-expanded={isProjectsOpen}
              aria-haspopup="true"
            >
              PROJECTS ▼
            </button>
            {isProjectsOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link href="/soundboard">SoundBoard</Link>
                </li>
                <li>
                  <Link href="/bookmarklets">Bookmarklets</Link>
                </li>
                <li>
                  <Link href="/passwordGen">Password Generator</Link>
                </li>
                <li>
                  <Link href="/matrix">Matrix</Link>
                </li>
                <li>
                  <Link href="/hackertyper">Hacker Typer</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link href="/guide" className={`nav-link${isActive('/guide') ? ' nav-link-active' : ''}`}>
              GUIDE
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/profile" className={`nav-link${isActive('/profile') ? ' nav-link-active' : ''}`}>
              ABOUT ME
            </Link>
          </li>
        </ul>

        <button
          className={`hamburger${isMobileOpen ? ' active' : ''}`}
          onClick={toggleMobile}
          aria-label="Toggle navigation"
          aria-expanded={isMobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
