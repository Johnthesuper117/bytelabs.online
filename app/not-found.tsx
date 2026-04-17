'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '60px 20px',
      textAlign: 'center',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: '#00FF41',
    }}>
      <h1 style={{
        fontSize: '120px',
        fontWeight: 700,
        color: '#FF3131',
        textShadow: '0 0 30px #FF3131',
        margin: 0,
        lineHeight: 1,
      }}>
        404
      </h1>
      <p style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#FFD300',
        textShadow: '0 0 10px #FFD300',
        margin: '20px 0 10px',
      }}>
        PAGE NOT FOUND
      </p>
      <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '40px' }}>
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <pre style={{
        display: 'inline-block',
        padding: '20px 30px',
        border: '2px solid #FF3131',
        background: 'rgba(255,49,49,0.05)',
        color: '#FF3131',
        fontSize: '14px',
        textAlign: 'left',
        marginBottom: '40px',
      }}>
{`$ navigate <unknown route>
bash: 404: No such file or directory`}
      </pre>
      <div>
        <Link href="/" className="not-found-home-btn">
          &gt; GO HOME
        </Link>
      </div>
    </div>
  );
}
