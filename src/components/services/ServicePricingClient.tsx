'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import PricingTiers from '@/components/ui/PricingTiers';
import { SERVICE_PRICING } from '@/lib/currency';

interface ServicePricingClientProps {
  serviceSlug: string;
  serviceName: string;
}

export default function ServicePricingClient({ serviceSlug, serviceName }: ServicePricingClientProps) {
  const { currentCurrency, isLocalCurrency, getLocalDiscountMessage } = useCurrency();
  
  // Map service slugs to pricing service types
  const servicePricingMap: Record<string, keyof typeof SERVICE_PRICING> = {
    'business-plan-and-logo-design': 'business-plan',
    'web-and-mobile-software-development': 'web-development',
    'social-media-advertising-and-marketing': 'digital-marketing',
    'profile-and-portfolio-building': 'web-development', // Use web-development pricing
    'mentoring-and-consulting': 'digital-marketing', // Use digital-marketing pricing for consulting
  };

  const serviceType = servicePricingMap[serviceSlug];
  
  // If no pricing available for this service, return null
  if (!serviceType || !SERVICE_PRICING[serviceType]) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <PricingTiers 
          service={serviceType}
          title={`${serviceName} Packages`}
          description="Choose the package that best fits your needs and budget. All packages include our quality guarantee and dedicated support."
          showLocalDiscount={true}
          showPopularBadge={true}
        />
      </div>
    </div>
  );
}
