import { useSyncExternalStore } from 'react';
import type { ThemeMode } from '../types';

function getThemeSnapshot(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('gautama_portfolio_theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  const handleCustomEvent = (e: any) => {
    callback();
  };

  window.addEventListener('theme-change', handleCustomEvent);
  window.addEventListener('storage', handleCustomEvent);

  return () => {
    observer.disconnect();
    window.removeEventListener('theme-change', handleCustomEvent);
    window.removeEventListener('storage', handleCustomEvent);
  };
}

/**
 * Universal theme hook that synchronizes real-time theme mode (dark/light)
 * across Astro pages, React Islands, and DOM classList mutations using useSyncExternalStore.
 */
export function useTheme(initialTheme?: ThemeMode): ThemeMode {
  return useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    () => initialTheme || 'light'
  );
}

