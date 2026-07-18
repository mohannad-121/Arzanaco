import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';

export default function Clients() {
  const [, setLocation] = useLocation();

  const clients = [
    "Saudi Electricity Company",
    "Saudi Customs",
    "Ministry of Media",
    "King Saud University",
    "ABB",
    "Alfanar",
    "Safari",
    "SANS",
    "Teleco",
    "L&T Construction",
    "Al Ajwani",
    "EG&G",
    "EHS",
    "EL SEIF"
  ];

  return (
    <PageWrapper>
      <section className="bg-muted py-24 border-b text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by Industry Leaders
          </h1>
          <p className="text-xl text-foreground/70 leading-relaxed">
            ARZANA has supported organizations across utility, infrastructure, commercial, government, and industrial environments.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((client, idx) => (
              <div 
                key={idx} 
                className="bg-card border rounded-xl p-8 flex items-center justify-center text-center h-32 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="font-bold text-lg text-foreground/80 group-hover:text-primary transition-colors">
                  {client}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center border-t pt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Client Network</h2>
            <p className="text-foreground/70 mb-8">Discuss how our engineering and product solutions can support your next major project.</p>
            <Button size="lg" onClick={() => setLocation('/contact')}>
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
