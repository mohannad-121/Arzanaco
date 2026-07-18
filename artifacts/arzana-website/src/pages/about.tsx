import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, Target, Award, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';

export default function About() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-muted py-24 border-b">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About ARZANA Arabia Company
          </h1>
          <p className="text-xl text-foreground/70 leading-relaxed">
            A premium Saudi engineering and electrical solutions provider offering integrated power, automation, safety, and testing services.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Who We Are</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                ARZANA Arabia Company is a specialized provider of engineering and electrical solutions based in Riyadh, Saudi Arabia. We serve utilities, government bodies, industrial complexes, and major construction projects with precision-engineered equipment and reliable services.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Our portfolio spans medium and low voltage power distribution, uninterruptible power supplies, precision instrumentation, industrial safety systems, and comprehensive testing and commissioning services.
              </p>
            </div>
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Our Mission</h3>
                    <p className="text-foreground/70">To support customers with dependable electrical products, integrated solutions, responsive technical support, and professional engineering services.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Our Vision</h3>
                    <p className="text-foreground/70">To be a trusted provider of electrical, power, safety, and engineering solutions in Saudi Arabia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commitment */}
          <div className="bg-foreground text-background rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Commitment to Quality & Support</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              We operate with a solutions-focused approach. Supplying equipment is only part of our mandate; ensuring that equipment integrates seamlessly, operates reliably, and is maintained professionally is where we deliver true value. Our engineering support team stands ready to assist at every project stage.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90" onClick={() => setLocation('/contact')}>Contact Our Team</Button>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
