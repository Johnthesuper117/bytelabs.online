'use client';

import { bookmarklets } from '../data/bookmarklets';
import SafeLink from '../components/SafeLink';

export default function BookmarkletsPage() {
  return (
    <>
      <div className="content">
        <h2>&gt; BOOKMARKLETS</h2>
        <p>
          Drag and drop the bookmarklets below to your bookmarks bar, then click them like bookmarks to activate them!
          Keep in mind that they are not permanent, so refreshing the page will undo their effect, and make sure
          JavaScript is enabled in your browser or they won&apos;t work at all.
        </p>
        <ul>
          {bookmarklets.map((bookmarklet, index) =>
            bookmarklet.link.startsWith('http') ? (
              <li key={index}>
                <SafeLink href={bookmarklet.link}>{bookmarklet.text}</SafeLink>
              </li>
            ) : (
              <li key={index}>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href={bookmarklet.link}>{bookmarklet.text}</a>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
}
