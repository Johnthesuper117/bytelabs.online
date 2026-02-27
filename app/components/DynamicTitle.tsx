'use client';

import { useEffect } from 'react';

export default function DynamicTitle() {
  useEffect(() => {
    const pageTitle = document.title;
    const attentionMessage = 'GET OVER HERE!';

    const handleVisibilityChange = () => {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      const isPageActive = !document.hidden;

      if (isPageActive) {
        document.title = pageTitle;
        if (favicon) favicon.href = '/favicon.ico';
      } else {
        document.title = attentionMessage;
        if (favicon) favicon.href = '/assets/images/favicon.ico';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return null;
}
