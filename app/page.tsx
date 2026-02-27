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
            A portfolio of projects, programs, games, and experiments from my mind.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.8 }}>
            I'm Johnthesuper117, a young aspiring software / video game developer and designer who likes to dabble in cyber security, web development, IT,  and AI. This is my website which I use to post fun, random, stuff like projects or games I make, school projects, all that. This is a solo project of mine, and while I’m not that great at web development, I try to make fun stuff that I think people might enjoy or want to use. So take a look around, admire my work, mess with people using the soundboard, play my mid games, complement my effort and ideas, criticize me, tell me how you could have done better in every way possible, send a suggestion and review, whatever. Just try to have fun!
          </p>
        </section>
      </div>
    </>
  );
}
