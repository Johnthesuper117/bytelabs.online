import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ByteLabs Online',
  description: 'A personal website for fun projects and tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
