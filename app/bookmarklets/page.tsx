'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookmarklets } from '../data/bookmarklets';

export default function BookmarkletsPage() {
  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>Bookmarklets</h1>
      <Navbar />
      <div className="content">
        <p>
          Drag and drop the bookmarklets below to your bookmarks bar, then click them like bookmarks to activate them! 
          Keep in mind that they are not permanent, so refreshing the page will undo their effect, and make sure 
          JavaScript is enabled in your browser or they won't work at all.
        </p>
        <ul>
          {bookmarklets.map((bookmarklet, index) => (
            <li key={index}>
              <a href={bookmarklet.link} onClick={(e) => { e.preventDefault(); handleCheckChance(bookmarklet.link); }}>{bookmarklet.text}</a>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}
