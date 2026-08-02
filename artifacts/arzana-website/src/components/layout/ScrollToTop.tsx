import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'wouter';

/** Keeps in-app navigation independent from the scroll position of the page being left. */
export function ScrollToTop() {
  const [pathname] = useLocation();
  const positions = useRef(new Map<string, { left: number; top: number }>());
  const isPopNavigation = useRef(false);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previousRestoration; };
  }, []);

  useLayoutEffect(() => {
    const onPopState = () => { isPopNavigation.current = true; };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useLayoutEffect(() => () => {
    positions.current.set(pathname, { left: window.scrollX, top: window.scrollY });
  }, [pathname]);

  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      target?.scrollIntoView({ block: 'start' });
      return;
    }

    const position = isPopNavigation.current ? positions.current.get(pathname) : undefined;
    isPopNavigation.current = false;
    window.scrollTo({ top: position?.top ?? 0, left: position?.left ?? 0, behavior: 'auto' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
