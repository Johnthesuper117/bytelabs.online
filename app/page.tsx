import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <div className="container">
        <section className="hero" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className="section-title" style={{ fontSize: '48px' }}>
            &gt; WELCOME TO BYTELABS.ONLINE
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '20px', lineHeight: '1.8' }}>
            A showcase of projects, programs, games, and experiments from the void.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.8 }}>
            Welcome! This is my website which I use to post fun, random, stuff like projects or games I make, school projects, all that.
So take a look around, admire my work, mess with people using the soundboard, play my mid scratch game, complement my effort and ideas, criticize me, tell me how you could have done better in every way possible, send a suggestion and review, whatever. Just try to have fun!
          </p>
        </section>
      </div>
    </>
  );
}
