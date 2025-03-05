import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { RegulatoryNewsFeed } from '@/components/landing/regulatory-news-feed';
import { ComplianceScoreDemo } from '@/components/landing/compliance-score-demo';
import { AIFeatureShowcase } from '@/components/landing/ai-feature-showcase';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { ArrowRight, Shield, Globe, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <LandingHeader />
      
      <main>
        <HeroSection />
        
        {/* Quick Overview */}
        <section className="container py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all interactive-card">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Coverage</h3>
              <p className="text-muted-foreground mb-4">Manage compliance across GDPR, CCPA, HIPAA, ISO27001, SOX, and 37+ other regulatory frameworks.</p>
              <Link href="/frameworks" className="text-primary inline-flex items-center">
                Explore Frameworks <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all interactive-card">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Compliance</h3>
              <p className="text-muted-foreground mb-4">Operate confidently in 67 jurisdictions with real-time regulatory updates and localized guidance.</p>
              <Link href="/global-compliance" className="text-primary inline-flex items-center">
                View Coverage Map <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all interactive-card">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automated Compliance</h3>
              <p className="text-muted-foreground mb-4">Reduce manual work by 87% with AI-powered assessments, monitoring, and remediation workflows.</p>
              <Link href="/automation" className="text-primary inline-flex items-center">
                See Automation <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        
        <FeaturesSection />
        
        <AIFeatureShowcase />
        
        <ComplianceScoreDemo />
        
        <RegulatoryNewsFeed />
        
        <PricingSection />
        
        <TestimonialsSection />
        
        <FAQSection />
        
        {/* Trust Signals */}
        <section className="container py-12 border-t border-border">
          <h3 className="text-center text-lg text-muted-foreground mb-8">Trusted by Leading Organizations</h3>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-[120px] md:w-[140px] h-12 relative">
                <Image 
                  src={`/images/logos/client-logo-${i}.svg`} 
                  alt={`Client logo ${i}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="filter grayscale"
                />
              </div>
            ))}
          </div>
        </section>
        
        <CTASection />
      </main>
      
      <LandingFooter />
    </div>
  );
}
