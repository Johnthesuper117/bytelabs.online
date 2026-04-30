'use client';

import { useState } from 'react';
import SafeLink from './SafeLink';
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
        <SafeLink href="/" className="navbar-logo">
          &gt; BYTELABS.ONLINE
        </SafeLink>

        <ul className={`nav-menu${isMobileOpen ? ' active' : ''}`}>
          <li className="nav-item">
            <SafeLink href="/" className={`nav-link${isActive('/') ? ' nav-link-active' : ''}`}>
              HOME
            </SafeLink>
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
                  <SafeLink href="/CPSTracker" title="Test how fast you can click">Clicks Per Second Tracker</SafeLink>
                </li>
                <li>
                  <SafeLink href="/AimTrainer" title="Practice your mouse accuracy">Aim Trainer</SafeLink>
                </li>
                <li>
                  <SafeLink href="/RTTrainer" title="Measure and improve your reaction speed">Reaction Time Trainer</SafeLink>
                </li>
                <li>
                  <SafeLink href="/QTETrainer" title="Practice hitting timed button prompts">Quick Time Event Trainer</SafeLink>
                </li>
                <li>
                  <SafeLink href="/CITrainer" title="Practice fighting-game style command inputs">Command Input Trainer</SafeLink>
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
                  <SafeLink href="/soundboard">SoundBoard</SafeLink>
                </li>
                <li>
                  <SafeLink href="/bookmarklets">Bookmarklets</SafeLink>
                </li>
                <li>
                  <SafeLink href="/passwordGen">Password Generator</SafeLink>
                </li>
                <li>
                  <SafeLink href="/matrix">Matrix</SafeLink>
                </li>
                <li>
                  <SafeLink href="/hackertyper">Hacker Typer</SafeLink>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item">
            <SafeLink href="/guide" className={`nav-link${isActive('/guide') ? ' nav-link-active' : ''}`}>
              GUIDE
            </SafeLink>
          </li>

          <li className="nav-item">
            <SafeLink href="/profile" className={`nav-link${isActive('/profile') ? ' nav-link-active' : ''}`}>
              ABOUT ME
            </SafeLink>
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
