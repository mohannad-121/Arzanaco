import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';

export default function RequestQuote() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    categoryId: '',
    selectedProducts: [] as string[],
    projectName: '',
    location: '',
    quantity: '',
    date: '',
    requirements: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  if (submitted) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Quote Request Received</h1>
          <p className="text-lg text-foreground/70 mb-8">
            Thank you for your interest in ARZANA Arabia. Your request has been successfully submitted. Our engineering team will review your requirements and respond within 1-2 business days.
          </p>
          <div className="bg-muted p-6 rounded-lg inline-block mb-8 border">
            <span className="text-sm text-muted-foreground block mb-1">Reference Number</span>
            <span className="text-2xl font-mono font-bold text-foreground">ARZ-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
          </div>
          <br/>
          <Button onClick={() => window.location.href = '/'}>Return to Home</Button>
        </div>
      </PageWrapper>
    );
  }

  const availableProducts = products.filter(p => p.categoryId === formData.categoryId);
  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <PageWrapper>
      <section className="bg-muted py-12 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Request a Quote</h1>
          
          {/* Progress */}
          <div className="max-w-2xl mx-auto flex items-center justify-between mt-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-border -z-10 -translate-y-1/2"></div>
            <div className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
            
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-background ${step >= s ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-foreground border-b pb-4">1. Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company *</label>
                    <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone *</label>
                    <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-foreground border-b pb-4">2. Select Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => {
                        setFormData({...formData, categoryId: cat.id, selectedProducts: []});
                        setTimeout(nextStep, 200);
                      }}
                      className={`border p-4 rounded-lg cursor-pointer transition-all ${formData.categoryId === cat.id ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-primary/50 hover:bg-muted'}`}
                    >
                      <h3 className="font-semibold">{cat.nameEn}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-foreground border-b pb-4">3. Select Products</h2>
                <p className="text-muted-foreground">From category: <strong className="text-foreground">{selectedCategory?.nameEn}</strong></p>
                <div className="space-y-3">
                  {availableProducts.map(prod => (
                    <div key={prod.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted transition-colors">
                      <Checkbox 
                        id={prod.id}
                        checked={formData.selectedProducts.includes(prod.id)}
                        onCheckedChange={() => handleProductToggle(prod.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor={prod.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          {prod.nameEn}
                        </label>
                      </div>
                    </div>
                  ))}
                  {availableProducts.length === 0 && (
                    <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
                      No specific products listed. Please detail your requirements in the next step.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-foreground border-b pb-4">4. Project Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name</label>
                    <Input value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location / City</label>
                    <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Required Quantity</label>
                    <Input value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Required Delivery Date</label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Technical Requirements / Description</label>
                    <Textarea 
                      className="min-h-[120px]" 
                      placeholder="Please specify ratings, standards, and any special requirements..."
                      value={formData.requirements} 
                      onChange={e => setFormData({...formData, requirements: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-foreground border-b pb-4">5. Review & Submit</h2>
                
                <div className="bg-muted p-6 rounded-lg space-y-6 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground block mb-1">Contact</span>
                      <strong className="block">{formData.name}</strong>
                      <span>{formData.company}</span>
                      <span className="block">{formData.email}</span>
                      <span className="block">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Category</span>
                      <strong className="block">{selectedCategory?.nameEn || 'None selected'}</strong>
                    </div>
                  </div>

                  {formData.selectedProducts.length > 0 && (
                    <div className="border-t pt-4 border-border">
                      <span className="text-muted-foreground block mb-2">Selected Products</span>
                      <ul className="list-disc pl-4 space-y-1">
                        {formData.selectedProducts.map(id => (
                          <li key={id}>{products.find(p => p.id === id)?.nameEn}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t pt-4 border-border">
                    <span className="text-muted-foreground block mb-2">Requirements</span>
                    <p className="whitespace-pre-wrap">{formData.requirements || 'No details provided.'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the privacy policy and consent to being contacted regarding this quote.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              {step < 5 ? (
                <Button onClick={nextStep} disabled={step === 2 && !formData.categoryId}>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} size="lg">
                  Submit Request
                </Button>
              )}
            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
