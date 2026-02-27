import React from 'react';
import { ArrowRight, ShieldCheck, Briefcase, CreditCard, Landmark, BadgeIndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  badge: string;
}

const services: ServiceCard[] = [
  {
    id: 'kyc-loan',
    title: 'KYC Loan',
    description:
      'Get instant loans with minimal documentation. Complete your KYC once and enjoy fast, hassle-free loan approvals with competitive interest rates.',
    icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
    imageSrc: '/assets/generated/kyc-loan-icon.dim_128x128.png',
    badge: 'Quick Approval',
  },
  {
    id: 'private-salary-loan',
    title: 'Private Salary Loan',
    description:
      'Exclusive salary-based loans for private sector employees. Borrow up to 10× your monthly salary with flexible EMI options and zero prepayment charges.',
    icon: <BadgeIndianRupee className="w-5 h-5 text-red-600" />,
    imageSrc: '/assets/generated/salary-loan-icon.dim_128x128.png',
    badge: 'Low Interest',
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    description:
      'Fuel your business growth with our tailored business loans. Get funding for working capital, equipment, or expansion with flexible repayment terms.',
    icon: <Briefcase className="w-5 h-5 text-red-600" />,
    imageSrc: '/assets/generated/business-loan-icon.dim_128x128.png',
    badge: 'Up to ₹50L',
  },
  {
    id: 'zero-balance-account',
    title: 'Zero Balance Account',
    description:
      'Open a fully digital savings account with zero minimum balance requirement. Enjoy free NEFT/IMPS transfers, debit card, and 24×7 banking access.',
    icon: <Landmark className="w-5 h-5 text-red-600" />,
    imageSrc: '/assets/generated/zero-balance-icon.dim_128x128.png',
    badge: 'No Charges',
  },
  {
    id: 'credit-card',
    title: 'Credit Card',
    description:
      'Apply for our premium credit card with exclusive cashback rewards, zero annual fee for the first year, and a high credit limit based on your profile.',
    icon: <CreditCard className="w-5 h-5 text-red-600" />,
    imageSrc: '/assets/generated/credit-card-icon.dim_128x128.png',
    badge: 'Cashback Rewards',
  },
];

export default function LoanBankingServicesSection() {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Loan & Banking Services
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explore our financial products tailored for you
          </p>
        </div>
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <Landmark className="w-4 h-4 text-red-600" />
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <Card
            key={service.id}
            className="border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-200 bg-white"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon / Image */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={service.imageSrc}
                    alt={service.title}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      // Fallback to lucide icon if image fails
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {service.title}
                    </h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="sm"
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-xs h-8 gap-1"
              >
                Apply Now
                <ArrowRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-xl p-4 text-white flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Need help choosing?</p>
          <p className="text-xs text-red-200 mt-0.5">
            Talk to our financial advisor on WhatsApp
          </p>
        </div>
        <a
          href="https://wa.me/919422018674"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Button
            size="sm"
            className="bg-white text-red-700 hover:bg-red-50 text-xs h-8 font-semibold border-0"
          >
            Contact Us
          </Button>
        </a>
      </div>
    </section>
  );
}
