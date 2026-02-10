'use client';

export function useLinkLoader() {
  const rareUrl = typeof window !== 'undefined' ? window.location.origin + '/rick' : '/rick';

  const checkChance = (intendedUrl: string) => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    // 1% chance (only when randomNumber === 1) to go to rick roll instead
    if (randomNumber === 1) {
      window.location.href = rareUrl;
    } else {
      // 99% chance to go to the intended URL
      window.location.href = intendedUrl;
    }
  };

  return { checkChance };
}
