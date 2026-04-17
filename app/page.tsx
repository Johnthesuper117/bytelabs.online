import Link from 'next/link';

const PROJECTS = [
  { href: '/CPSTracker',   label: 'CPS Tracker',            desc: 'Measure your clicks per second.' },
  { href: '/AimTrainer',   label: 'Aim Trainer',            desc: 'Practice mouse accuracy on randomised targets.' },
  { href: '/RTTrainer',    label: 'Reaction Time Trainer',  desc: 'Test and improve your reaction speed.' },
  { href: '/QTETrainer',   label: 'QTE Trainer',            desc: 'Hit timed button prompts under pressure.' },
  { href: '/CITrainer',    label: 'Command Input Trainer',  desc: 'Practice fighting-game style command inputs.' },
  { href: '/soundboard',   label: 'Soundboard',             desc: 'Mess with people using 100+ sound effects.' },
  { href: '/bookmarklets', label: 'Bookmarklets',           desc: 'Handy drag-and-drop browser bookmarklets.' },
  { href: '/passwordGen',  label: 'Password Generator',     desc: 'Generate strong, secure passwords.' },
  { href: '/matrix',       label: 'Matrix',                 desc: 'The classic falling-code Matrix screensaver.' },
  { href: '/hackertyper',  label: 'Hacker Typer',           desc: 'Look like a Hollywood hacker. Press any key.' },
];

export default function Home() {
  return (
    <div className="container">
      <section className="hero" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '48px' }}>
          &gt; WELCOME TO BYTELABS.ONLINE
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '20px', lineHeight: '1.8' }}>
          A portfolio of projects, programs, games, and experiments from my mind.
        </p>
        <p style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.8 }}>
          I&apos;m Johnthesuper117, a young aspiring software / video game developer and designer who likes to dabble
          in cyber security, web development, IT, and AI. This is my website where I post fun, random stuff like
          projects or games I make, school projects, all that. Take a look around, play my mid games, mess with
          people using the soundboard, or just have fun!
        </p>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2 className="section-title">&gt; PROJECTS &amp; TOOLS</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {PROJECTS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="project-card"
            >
              <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', letterSpacing: '0.5px' }}>
                &gt; {p.label}
              </p>
              <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
