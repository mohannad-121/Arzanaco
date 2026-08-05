import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '../../contexts/LanguageContext';

const TRANSITION_DURATION = 2_000;
const ARZANA_ARABIA = String.fromCodePoint(
  0x627, 0x631, 0x632, 0x627, 0x646, 0x627, 0x20,
  0x627, 0x644, 0x639, 0x631, 0x628, 0x64a, 0x629,
);
const LOADING_PAGE_ARABIC = String.fromCodePoint(
  0x62c, 0x627, 0x631, 0x64d, 0x20, 0x62a, 0x62d, 0x645, 0x64a, 0x644, 0x20,
  0x627, 0x644, 0x635, 0x641, 0x62d, 0x629,
);

/** Displays the branded loading animation whenever Wouter changes pages. */
export function PageTransitionLoader() {
  const [pathname] = useLocation();
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const isInitialRender = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Do not show a transition before the first page has rendered.
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setIsVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsVisible(false), TRANSITION_DURATION);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pathname]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  if (!isVisible) return null;

  const label = language === 'ar' ? ARZANA_ARABIA : 'ARZANA ARABIA';
  const status = language === 'ar' ? LOADING_PAGE_ARABIC : 'Loading page';

  return (
    <div className="page-loader" role="status" aria-label={status}>
      <div className="loader-wrapper" dir={language === 'ar' ? 'rtl' : 'ltr'} aria-hidden="true">
        <div className="loader-word">
          {Array.from(label).map((letter, index) => (
            <span
              className={`loader-letter${letter === ' ' ? ' loader-letter--space' : ''}`}
              style={{ animationDelay: `${index * 0.08}s` }}
              key={`${letter}-${index}`}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="loader" />

        {Array.from({ length: 7 }, (_, index) => (
          <div className={`star star--${index + 1}`} key={index} />
        ))}
      </div>
    </div>
  );
}
