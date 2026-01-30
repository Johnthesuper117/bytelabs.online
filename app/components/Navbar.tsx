'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleCheckChance = (href: string) => {
    const rareUrl = '/rick/roll';
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber === 1) {
      router.push(rareUrl);
    } else {
      // Map old .html paths to new Next.js routes
      const routeMap: Record<string, string> = {
        '/index.html': '/',
        '/matrix.html': '/matrix',
        '/bookmarklets.html': '/bookmarklets',
        '/soundboard.html': '/soundboard',
        '/passwordGen.html': '/passwordGen',
        '/guide.html': '/guide',
        '/profile.html': '/profile',
      };

      const route = routeMap[href] || href;
      router.push(route);
    }
  };

  // Handle all link clicks with 1% chance
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href') || '';
    handleCheckChance(href);
  };

  return (
    <nav className="sidebar-nav">
      <ul>
        <li className="nav">
          <a href="/index.html" onClick={handleLinkClick} className="nav-link">
            Home
          </a>
        </li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle">Games</a>
          <ul className="dropdown-menu">
            <li><a href="#">Not currently available. Sorry!</a></li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle">Programs</a>
          <ul className="dropdown-menu">
            <li><a href="/matrix.html" onClick={handleLinkClick} className="dropdown-item">Matrix</a></li>
            <li><a href="/bookmarklets.html" onClick={handleLinkClick} className="dropdown-item">Bookmarklets</a></li>
            <li><a href="/soundboard.html" onClick={handleLinkClick} className="dropdown-item">Soundboard</a></li>
            <li><a href="/passwordGen.html" onClick={handleLinkClick} className="dropdown-item">Password Generator</a></li>
          </ul>
        </li>
        <li className="nav">
          <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://school.bytelabs.online', '_blank'); }} className="nav-link">
            School Projects
          </a>
        </li>
        <li className="nav">
          <a href="/guide.html" onClick={handleLinkClick} className="nav-link">
            Coding Guide
          </a>
        </li>
        <li className="nav">
          <a href="/profile.html" onClick={handleLinkClick} className="nav-link">
            About Me
          </a>
        </li>
      </ul>
    </nav>
  );
}
