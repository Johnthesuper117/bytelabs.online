'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SafeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export default function SafeLink({ href, children, className, ...props }: SafeLinkProps) {
  const rareUrl = typeof window !== 'undefined' ? window.location.origin + '/rick/roll.html' : '/rick/roll.html';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber === 1) {
      e.preventDefault();
      window.location.href = rareUrl;
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
