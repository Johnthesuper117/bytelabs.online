import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface DefaultLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DefaultLayout({ children, title = 'ByteLabs Online' }: DefaultLayoutProps) {
  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>{title}</h1>
      <Navbar />
      <div className="content">
        <p>{children}</p>
      </div>
      <Footer />
    </>
  );
}
