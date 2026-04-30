import SafeLink from './SafeLink';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '2px solid #00FF41',
      background: '#000000',
      padding: '30px 20px',
      marginTop: '60px',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: '#00FF41',
      fontSize: '13px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
      }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '12px', color: '#FFD300', textShadow: '0 0 8px #FFD300' }}>
            &gt; BYTELABS.ONLINE
          </p>
          <p style={{ opacity: 0.7, lineHeight: '1.8' }}>
            A solo portfolio of projects, games, and experiments by Johnthesuper117.
          </p>
        </div>

        <div>
          <p style={{ fontWeight: 700, marginBottom: '12px', color: '#FFD300', textShadow: '0 0 8px #FFD300' }}>
            &gt; TRAINING
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><SafeLink href="/CPSTracker">CPS Tracker</SafeLink></li>
            <li><SafeLink href="/AimTrainer">Aim Trainer</SafeLink></li>
            <li><SafeLink href="/RTTrainer">Reaction Time Trainer</SafeLink></li>
            <li><SafeLink href="/QTETrainer">QTE Trainer</SafeLink></li>
            <li><SafeLink href="/CITrainer">Command Input Trainer</SafeLink></li>
          </ul>
        </div>

        <div>
          <p style={{ fontWeight: 700, marginBottom: '12px', color: '#FFD300', textShadow: '0 0 8px #FFD300' }}>
            &gt; PROJECTS
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><SafeLink href="/soundboard">Soundboard</SafeLink></li>
            <li><SafeLink href="/bookmarklets">Bookmarklets</SafeLink></li>
            <li><SafeLink href="/passwordGen">Password Generator</SafeLink></li>
            <li><SafeLink href="/matrix">Matrix</SafeLink></li>
            <li><SafeLink href="/hackertyper">Hacker Typer</SafeLink></li>
          </ul>
        </div>

        <div>
          <p style={{ fontWeight: 700, marginBottom: '12px', color: '#FFD300', textShadow: '0 0 8px #FFD300' }}>
            &gt; LINKS
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><SafeLink href="/guide">Guide</SafeLink></li>
            <li><SafeLink href="/profile">About Me</SafeLink></li>
            <li>
              <a href="https://github.com/Johnthesuper117/bytelabs.online" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://forms.gle/LAgGJ36C3mTxAyMK8" target="_blank" rel="noopener noreferrer">
                Send a Suggestion
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '30px auto 0',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,255,65,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        opacity: 0.6,
        fontSize: '12px',
      }}>
        <p>Made by Johnthesuper117</p>
        <p>bytelabs.online</p>
      </div>
    </footer>
  );
}
