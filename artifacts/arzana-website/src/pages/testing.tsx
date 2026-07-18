import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';

import testingImg from '@assets/service_testing.jpg';

export default function TestingCommissioning() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const systemsCovered = [
    "Low Voltage Switchgear",
    "Medium Voltage Switchgear",
    "Power Transformers",
    "Auxiliary Transformers",
    "Protection Relays",
    "AC Panels",
    "DC Panels",
    "Batteries",
    "Battery Chargers",
    "Medium Voltage Power Cables",
    "Capacitor Banks",
    "Cable Terminations"
  ];

  const workflow = [
    "Project and document review",
    "Equipment inspection",
    "Testing preparation",
    "Electrical and functional testing",
    "Verification of protection and control systems",
    "Commissioning support",
    "Reporting and documentation"
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-foreground text-background py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={testingImg} alt="Testing and Commissioning" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Testing and Commissioning of Electrical Substations
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Expert verification, testing, and commissioning services ensuring your electrical infrastructure operates safely, efficiently, and according to exact specifications.
            </p>
            <Button size="lg" onClick={() => setLocation('/contact')}>
              Request Engineering Support
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Systems */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Systems Covered</h2>
              <div className="bg-card border rounded-xl p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {systemsCovered.map((sys, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80 font-medium">{sys}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Workflow */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Service Workflow</h2>
              <div className="space-y-6">
                {workflow.map((step, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                      {i + 1}
                    </div>
                    <div className="text-lg text-foreground/80 font-medium border-b pb-4 flex-1">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-20 border-t">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Need Testing Services for Your Project?</h2>
          <p className="text-foreground/70 mb-8 text-lg">Our certified engineering team is ready to support your next installation or maintenance cycle.</p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => setLocation('/contact')}>Contact Us Now</Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/request-quote')}>Request a Quote</Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
