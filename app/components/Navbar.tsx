'use client';

import { useState } from 'react';
import Link from 'next/link';
import './Navbar.css';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          &gt; BYTELABS.ONLINE
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              HOME
            </Link>
          </li>

          <li className="nav-item dropdown">
            <button
              type="button"
              className="nav-link dropdown-toggle"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              PROJECTS ▼
            </button>
            {isDropdownOpen && (
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
            <Link href="/guide" className="nav-link">
              GUIDE
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/profile" className="nav-link">
              ABOUT ME
            </Link>
          </li>

        </ul>

        <button
          className="hamburger"
          onClick={toggleDropdown}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
