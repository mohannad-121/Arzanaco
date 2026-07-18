import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLocation, Link } from 'wouter';

import safetyImg from '@assets/service_safety.jpg';
import safetyNetImg from '@assets/area_safety.jpg';

export default function SafetySystems() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const products = [
    { name: "Safety Nets", desc: "Collective fall-protection net systems to reduce risks of work at height." },
    { name: "Edge Protection", desc: "Temporary edge-protection systems for exposed slab edges, platforms, and elevated areas." },
    { name: "Loading Platforms", desc: "Temporary construction loading platforms for safe material transfer between building levels." },
    { name: "Shaft Gates", desc: "Temporary access-control and protection for open shafts and hazardous construction openings." }
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-foreground text-background py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={safetyImg} alt="Safety Systems" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Safety & Protection Fall System</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Industrial Safety & Fall Protection Systems
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Protecting lives on construction sites and industrial facilities with robust, collective fall-protection systems and edge barriers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setLocation('/contact')}>
                Request Safety Consultation
              </Button>
              <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0" onClick={() => setLocation('/request-quote')}>
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
            <div className="lg:w-1/2">
              <div className="aspect-square max-h-[500px] rounded-2xl overflow-hidden shadow-2xl border">
                <img src={safetyNetImg} alt="Safety Netting" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-semibold mb-2">
                <ShieldAlert className="w-4 h-4" /> Priority: Life Safety
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Critical Protection for High-Risk Environments</h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Work at height presents the highest risk of fatal injury in the construction and industrial sectors. ARZANA Arabia provides collective fall protection systems designed to mitigate these risks effectively without impeding workflow.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Our solutions are engineered for rapid deployment, high durability, and maximum safety compliance for exposed edges, open shafts, and elevated work areas.
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Core Safety Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p, i) => (
              <div key={i} className="bg-card border p-8 rounded-xl hover:border-primary transition-colors flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-3">{p.name}</h4>
                  <p className="text-foreground/70">{p.desc}</p>
                </div>
                <Link href="/products/safety-fall-protection" className="inline-flex items-center text-primary font-medium mt-6 group">
                  View Specifications <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
