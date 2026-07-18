import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { useToast } from '../hooks/use-toast';

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting ARZANA Arabia. Our team will get back to you shortly.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageWrapper>
      <section className="bg-muted py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our engineering and technical support teams are ready to assist with your inquiries, project requirements, and technical specifications.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-card border rounded-2xl p-8 space-y-8">
                <h3 className="text-2xl font-bold text-foreground">Head Office</h3>
                
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-3 rounded-full text-primary shrink-0 h-fit">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Address</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      ServCorp Building 13, Laysen Valley Complex,<br/>
                      Al Urubah Road, Umm Al Hamam Al Gharbi District,<br/>
                      Riyadh 12329, Saudi Arabia
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-3 rounded-full text-primary shrink-0 h-fit">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                    <div className="flex flex-col gap-1 text-sm text-foreground/70">
                      <a href="tel:+966112041144" className="hover:text-primary">Tel: +966 11 2041144</a>
                      <a href="tel:+966566676600" className="hover:text-primary">Mob: +966 56 667 6600</a>
                      <a href="tel:+966597080480" className="hover:text-primary">Mob: +966 59 708 0480</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-3 rounded-full text-primary shrink-0 h-fit">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <div className="flex flex-col gap-1 text-sm text-foreground/70">
                      <a href="mailto:m.saadi@arzanaco.com" className="hover:text-primary">m.saadi@arzanaco.com</a>
                      <a href="mailto:moaath@arzanaco.com" className="hover:text-primary">moaath@arzanaco.com</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-3 rounded-full text-primary shrink-0 h-fit">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Business Hours</h4>
                    <p className="text-foreground/70 text-sm">Sunday - Thursday<br/>8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-muted border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-64">
                <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">Laysen Valley Complex</p>
                <p className="text-muted-foreground text-sm">Riyadh, Saudi Arabia</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-foreground mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name *</label>
                      <Input required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Company Name *</label>
                      <Input required placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address *</label>
                      <Input required type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone Number *</label>
                      <Input required type="tel" placeholder="+966 5X XXX XXXX" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Enquiry Type *</label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product Enquiry</SelectItem>
                          <SelectItem value="quote">Request a Quote</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="testing">Testing & Commissioning</SelectItem>
                          <SelectItem value="safety">Safety System Enquiry</SelectItem>
                          <SelectItem value="general">General Enquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Country</label>
                      <Input placeholder="Saudi Arabia" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Subject *</label>
                    <Input required placeholder="How can we help you?" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message *</label>
                    <Textarea required placeholder="Please provide details about your project or enquiry..." className="min-h-[150px]" />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
