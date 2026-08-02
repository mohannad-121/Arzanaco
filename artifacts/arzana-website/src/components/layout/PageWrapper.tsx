import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="site-shell min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};
