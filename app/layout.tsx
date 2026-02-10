import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/app/components/Navbar';
import DynamicTitle from '@/app/components/DynamicTitle';

export const metadata: Metadata = {
  title: 'Bytelabs.online',
  description: 'Projects, programs, games, and more!',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link id="favicon" rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="bg-terminal-black text-terminal-green font-mono">
        <DynamicTitle />
        <Navbar />
        <main style={{ paddingTop: '120px' }} className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
